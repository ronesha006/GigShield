from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins = ["*"],
	allow_credentials = True,
	allow_methods = ["*"],
	allow_headers = ["*"]
)

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

income_logs = []
expense_logs = []

@app.post("/log-income")
def log_income(data: IncomeLog):
	income_logs.append({
		"amount": data.amount
	})

	return {
		"message": "Income logged successfully",
		"data": income_logs
	}

@app.post("/log-expense")
def log_expense(data: ExpenseLog):
    total = (data.food + data.transport + data.medical + data.other)
	
    expense_logs.append({
		"food": data.food,
		"transport": data.transport,
		"medical": data.medical,
		"other": data.other,
		"total": total
    })
	
    return {
		"message": "Expense logged successfully",
		"data": expense_logs
	}

@app.get("/insights")
def get_insights():
	total_income = sum(item["amount"] for item in income_logs)
	total_expense = sum(item["total"] for item in expense_logs)
	remaining = (total_income - total_expense)
	spend_limit = remaining * 0.5
	
	return{
		"totalIncome": total_income,
		"totalExpense": total_expense,
		"remaining": remaining,
		"spendLimit": spend_limit
    }
	