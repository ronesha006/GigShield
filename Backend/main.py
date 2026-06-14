import anthropic
import os
from dotenv import load_dotenv

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins = [ "https://gig-shield-ecru.vercel.app" ],
	allow_credentials = True,
	allow_methods = ["*"],
	allow_headers = ["*"]
)

user_data = {
    "income": [],
    "expenses": [],
    "goals": []
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
	
    user_data["expense"].append({
		"food": data.food,
		"transport": data.transport,
		"medical": data.medical,
		"other": data.other,
		"total": total
    })
	
    return {
		"message": "Expense logged successfully",
		"data": user_data["expense"]
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