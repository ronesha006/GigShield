main.py
import anthropic
import os
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import statistics
from fastapi import Query

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://gig-shield-ecru.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

user_data = {
    "income": [],
    "expenses": [],
    "goals": [],
    "savings_allocation": {
        "percentage": 30,
        "last_allocation_date": None
    },
    "available_savings": 0,
    "allocated_savings": 0,
    "bad_day_mode": False
}

def _recalculate_available_savings():
    total_income = sum(x["amount"] for x in user_data["income"])
    total_expense = sum(x["total"] for x in user_data["expenses"])
    net_savings = total_income - total_expense

    user_data["available_savings"] = max(0, net_savings - user_data["allocated_savings"])

def today_str():
    return datetime.date.today().isoformat()

def compute_bad_day_mode():
    """Set a flag in user_data if there are 2 consecutive zero-income days."""
    # Build a map of date -> total income for that date
    income_by_date = {}
    for inc in user_data["income"]:
        d = inc.get("date") or today_str()
        income_by_date.setdefault(d, 0)
        income_by_date[d] += inc.get("amount", 0)

    # consider last 7 calendar days
    today = datetime.date.today()
    consecutive_zero = 0
    for i in range(0, 7):
        day = (today - datetime.timedelta(days=i)).isoformat()
        amt = income_by_date.get(day, 0)
        if amt == 0:
            consecutive_zero += 1
        else:
            break

    user_data["bad_day_mode"] = consecutive_zero >= 2


@app.get("/")
def home():
    return {
        "message": "GigShield API is running"
    }


class IncomeLog(BaseModel):
    amount: float


class ExpenseLog(BaseModel):
    food: float
    transport: float
    medical: float
    other: float

@app.post("/log-income")
def log_income(data: IncomeLog):
    # store date for each income entry to support the income engine
    entry = {"amount": data.amount, "date": today_str()}
    user_data["income"].append(entry)

    # After logging income, recompute bad day mode flag
    compute_bad_day_mode()

    _recalculate_available_savings()

    return {
        "message": "Income logged successfully",
        "data": user_data["income"]
    }


@app.post("/log-expense")
def log_expense(data: ExpenseLog):
    total = (data.food + data.transport + data.medical + data.other)

    expense_entry = {
        "food": data.food,
        "transport": data.transport,
        "medical": data.medical,
        "other": data.other,
        "total": total
    }

    user_data["expenses"].append(expense_entry)

    _recalculate_available_savings()

    return {
        "message": "Expense logged successfully",
        "data": user_data["expenses"]
    }


class Goal(BaseModel):
    name: str
    target: float


class Reorder(BaseModel):
    goal_order: list[str]


@app.post("/create-goal")
def create_goal(goal: Goal):

    new_goal = {
        "id": str(len(user_data["goals"]) + 1),
        "name": goal.name,
        "target": goal.target,
        "saved": 0,
        "priority": len(user_data["goals"]) + 1
    }

    user_data["goals"].append(new_goal)
    return new_goal


@app.post("/reorder-goals")
def reorder_goals(data: Reorder):

    goal_map = {g["id"]: g for g in user_data["goals"]}
    new_list = []

    for i, gid in enumerate(data.goal_order):
        goal_map[gid]["priority"] = i + 1
        new_list.append(goal_map[gid])

    user_data["goals"] = new_list
    return user_data["goals"]


@app.get("/goals")
def get_goals():
    return user_data["goals"]


@app.post("/update-savings")
def update_savings(amount: float):
    if user_data["goals"]:
        user_data["goals"][0]["saved"] += amount

    return user_data["goals"]


@app.post("/add-savings")
def add_savings(amount: float):
    remaining = amount

    for goal in sorted(user_data["goals"], key=lambda x: x["priority"]):
        if goal["saved"] < goal["target"]:
            need = goal["target"] - goal["saved"]
            if remaining >= need:
                goal["saved"] += need
                remaining -= need
            else:
                goal["saved"] += remaining
                break

    user_data["allocated_savings"] += amount
    _recalculate_available_savings()

    return user_data["goals"]


@app.get("/dashboard")
def dashboard():

    total_income = sum(x["amount"] for x in user_data["income"])
    total_expense = sum(x["total"] for x in user_data["expenses"])

    remaining = total_income - total_expense
    spend_limit = remaining * 0.5

    ai_nudge = (
        f"You spent ₹{total_expense}. "
        f"Try to stay under ₹{round(spend_limit)} today. "
        "Keep building your buffer."
    )
    

    return {
        "totalIncome": total_income,
        "totalExpense": total_expense,
        "remaining": remaining,
        "spendLimit": spend_limit,
        "aiNudge": ai_nudge,
        "goals": user_data["goals"],
        "availableSavings": user_data["available_savings"],
        "allocatedSavings": user_data["allocated_savings"]
    }



class SavingsAllocation(BaseModel):
    percentage: int


class AllocateSavingsRequest(BaseModel):
    amount: float
    force_override: bool = False


@app.post("/set-savings-percentage")
def set_savings_percentage(data: SavingsAllocation):
    """Set what percentage of net savings goes to goals"""
    if data.percentage < 0 or data.percentage > 100:
        return {"error": "Percentage must be between 0 and 100"}
    
    user_data["savings_allocation"]["percentage"] = data.percentage
    
    return {
        "message": f"Savings allocation set to {data.percentage}%",
        "percentage": data.percentage
    }


@app.post("/allocate-savings")
def allocate_savings(data: AllocateSavingsRequest):
    """Allocate a specific amount to goals from net savings"""
    
    _recalculate_available_savings()

    # Calculate total net savings (income - expenses)
    total_income = sum(x["amount"] for x in user_data["income"])
    total_expense = sum(x["total"] for x in user_data["expenses"])
    net_savings = total_income - total_expense
    
    if net_savings <= 0:
        return {
            "error": "No net savings available to allocate",
            "net_savings": 0,
            "can_allocate": False
        }
    
    # Check if allocation exceeds 50% of net savings
    fifty_percent = net_savings * 0.5
    warning = None
    
    if data.amount > fifty_percent and not data.force_override:
        return {
            "message": f"Warning: Allocating ₹{data.amount} is {((data.amount/net_savings)*100):.1f}% of your net savings. This exceeds the recommended 50% limit.",
            "recommended_max": fifty_percent,
            "net_savings": net_savings,
            "requested_amount": data.amount,
            "exceeds_by": data.amount - fifty_percent
        }
    
    # Check if user has enough net savings
    if data.amount > net_savings:
        return {
            "error": f"Insufficient net savings. You only have ₹{net_savings} available.",
            "net_savings": net_savings,
            "requested_amount": data.amount
        }
    
    # Allocate to goals (highest priority first)
    remaining = data.amount
    allocated_to = []
    
    for goal in sorted(user_data["goals"], key=lambda x: x["priority"]):
        if goal["saved"] < goal["target"]:
            need = goal["target"] - goal["saved"]
            if remaining >= need:
                goal["saved"] += need
                remaining -= need
                allocated_to.append({
                    "goal": goal["name"],
                    "amount": need,
                    "completed": goal["saved"] == goal["target"]
                })
            else:
                goal["saved"] += remaining
                allocated_to.append({
                    "goal": goal["name"],
                    "amount": remaining,
                    "completed": False
                })
                remaining = 0
                break
    
    user_data["allocated_savings"] += data.amount
    _recalculate_available_savings()
    user_data["savings_allocation"]["last_allocation_date"] = datetime.now().isoformat()
    
    return {
        "message": f"Successfully allocated ₹{data.amount} to your goals",
        "allocated_amount": data.amount,
        "percentage_of_net": (data.amount / net_savings) * 100,
        "net_savings": net_savings,
        "allocated_to": allocated_to,
        "remaining_net": net_savings - data.amount,
        "goals": user_data["goals"]
    }
    
@app.get("/savings-overview")
def savings_overview():
    """Get overview of net savings and allocation recommendations"""
    
    _recalculate_available_savings()
    
    total_income = sum(x["amount"] for x in user_data["income"])
    total_expense = sum(x["total"] for x in user_data["expenses"])
    net_savings = total_income - total_expense
    
    recommended_save = net_savings * 0.5  # 50% recommendation
    aggressive_save = net_savings * 0.7   # 70% aggressive
    conservative_save = net_savings * 0.3  # 30% conservative
    
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_savings": net_savings,
        "recommendations": {
            "conservative": conservative_save,
            "recommended": recommended_save,
            "aggressive": aggressive_save
        },
        "current_allocation_percentage": user_data["savings_allocation"]["percentage"],
        "goals": user_data["goals"]
    }


@app.get("/income-engine")
def income_engine():
    """Return 7-day average, per-day flags and a dynamic daily spend limit."""
    # Build date->income map
    income_by_date = {}
    for inc in user_data["income"]:
        d = inc.get("date") or today_str()
        income_by_date.setdefault(d, 0)
        income_by_date[d] += inc.get("amount", 0)

    today = datetime.date.today()
    last7 = []
    total = 0
    for i in range(6, -1, -1):
        day = (today - datetime.timedelta(days=i)).isoformat()
        amt = income_by_date.get(day, 0)
        last7.append({"date": day, "income": amt})
        total += amt

    seven_day_avg = total / 7 if total else 0

    # Simple dynamic daily spend limit:
    # take 80% of 7-day average as available for daily spending (conservative)
    daily_spend_limit = round(seven_day_avg * 0.8, 2)

    # Bad day mode schemes to surface when triggered
    gov_schemes = []
    if user_data.get("bad_day_mode"):
        gov_schemes = [
            {"name": "PM Jan Dhan Yojana", "desc": "Direct benefit transfer access and small savings"},
            {"name": "MGNREGA", "desc": "Rural employment guarantee schemes"}
        ]

    return {
        "seven_day_avg": seven_day_avg,
        "last7": last7,
        "daily_spend_limit": daily_spend_limit,
        "bad_day_mode": user_data.get("bad_day_mode", False),
        "gov_schemes": gov_schemes
    }


@app.get("/emergency-buffer")
def emergency_buffer(multiplier: float = Query(1.5, description="Multiplier for 7-day average")):
    """Calculate an emergency buffer recommendation based on recent income volatility.

    Strategy:
    - Build last 14 calendar day incomes
    - Compute 7-day average and 14-day standard deviation
    - Recommend buffer = max(1.5 * 7-day-average, 3 * stddev, 7-day-average)
    """
    # Build date->income map
    income_by_date = {}
    for inc in user_data["income"]:
        d = inc.get("date") or today_str()
        income_by_date.setdefault(d, 0)
        income_by_date[d] += inc.get("amount", 0)

    today = datetime.date.today()
    last14 = []
    for i in range(13, -1, -1):
        day = (today - datetime.timedelta(days=i)).isoformat()
        amt = income_by_date.get(day, 0)
        last14.append({"date": day, "income": amt})

    # 7-day avg
    last7_vals = [d["income"] for d in last14[-7:]]
    seven_day_avg = sum(last7_vals) / 7 if any(last7_vals) else 0

    # stddev over 14 days (population stddev)
    vals = [d["income"] for d in last14]
    stdev = statistics.pstdev(vals) if len(vals) > 0 else 0

    # median fallback
    median = statistics.median(vals) if len(vals) > 0 else 0

    # recommended buffer now uses multiplier param and volatility
    candidate1 = round(seven_day_avg * multiplier, 2)
    candidate2 = round(stdev * 3, 2)
    candidate3 = round(max(seven_day_avg, median), 2)
    recommended_buffer = max(candidate1, candidate2, candidate3)

    return {
        "seven_day_avg": seven_day_avg,
        "stddev_14": stdev,
        "median_14": median,
        "last14": last14,
        "recommended_buffer": recommended_buffer,
        "used_multiplier": multiplier,
        "note": "Recommended buffer = max(multiplier*7d_avg, 3*stddev, max(7d_avg, median))"
    }


@app.get("/ai-nudge")
def ai_nudge(lang: str = Query("en", description="Language code: en, hi, ta")):
    """Generate a brief savings nudge in the requested language using Claude (Anthropic).

    Requires ANTHROPIC_API_KEY in environment for production use. If missing, return a simple fallback translation.
    """
    total_income = sum(x["amount"] for x in user_data["income"])
    total_expense = sum(x["total"] for x in user_data["expenses"])
    remaining = total_income - total_expense

    base_nudge = (
        f"You spent ₹{total_expense}. Try to stay under ₹{round(remaining * 0.5)} today. Keep building your buffer."
    )

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        # Simple language map fallback
        translations = {
            "en": base_nudge,
            "hi": "आपने ₹{} खर्च किए। आज ₹{} के अंदर रहने की कोशिश करें। अपना बफर बनाते रहें।".format(total_expense, round(remaining * 0.5)),
            "ta": "நீங்கள் ₹{} செலவழித்தீர்கள். இன்றைக்கு ₹{} க்குள் இருக்க முயற்சிக்கவும். உங்கள் காப்புறுதியை உருவாக்கத் தொடருங்கள்.".format(total_expense, round(remaining * 0.5))
        }
        return {"aiNudge": translations.get(lang, base_nudge), "source": "fallback"}

    try:
        client = anthropic.Client(api_key=api_key)
        # Craft a short prompt asking for a concise nudge in the requested language
        prompt = (
            f"You are a helpful financial coach. Produce one short sentence (<= 25 words) in language '{lang}' giving a gentle spending nudge. "
            f"Context: total_expense={total_expense}, remaining={remaining}. Output only the sentence."
        )

        resp = client.completions.create(
            model="claude-2", prompt=prompt, max_tokens_to_sample=200
        )

        # resp may contain 'completion' field or similar
        content = resp.get("completion") if isinstance(resp, dict) else getattr(resp, "completion", None)
        if not content:
            # try alternate attribute
            content = str(resp)

        return {"aiNudge": content.strip(), "source": "claude"}
    except Exception as e:
        return {"aiNudge": base_nudge, "source": "error", "error": str(e)}