import anthropic
import os
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import datetime

load_dotenv()

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins = [ "https://gig-shield-ecru.vercel.app", "http://localhost:5173" ],
	allow_credentials = True,
	allow_methods = ["*"],
	allow_headers = ["*"]
)

user_data = {
    "income": [],
    "expenses": [],
    "goals": [],
    "savings_allocation": {
        "percentage": 30,  # Default 30% of net savings
        "last_allocation_date": None
    }
}


@app.get("/")
def home():
    return{
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
	user_data["income"].append({
		"amount": data.amount
	})

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
        "goals": user_data["goals"]
    }



class SavingsAllocation(BaseModel):
    percentage: int

class AllocateSavingsRequest(BaseModel):
    amount: float
    force_override: bool = False  # If user ignores warning

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
        warning = {
            "message": f"Warning: Allocating ₹{data.amount} is {((data.amount/net_savings)*100):.1f}% of your net savings. This exceeds the recommended 50% limit.",
            "recommended_max": fifty_percent,
            "net_savings": net_savings,
            "requested_amount": data.amount,
            "exceeds_by": data.amount - fifty_percent
        }
        return warning
    
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