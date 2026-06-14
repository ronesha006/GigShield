import datetime
import statistics

import pytest
from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


def reset_data():
    main.user_data = {
        "income": [],
        "expenses": [],
        "goals": [],
        "savings_allocation": {"percentage": 30, "last_allocation_date": None}
    }


def dates_for(n_days):
    today = datetime.date.today()
    return [(today - datetime.timedelta(days=i)).isoformat() for i in range(n_days-1, -1, -1)]


def test_seven_day_avg_calculation():
    reset_data()
    # prepare 7 day incomes: 10,20,..70
    vals = [10,20,30,40,50,60,70]
    dts = dates_for(7)
    main.user_data['income'] = [{'amount': v, 'date': d} for v,d in zip(vals, dts)]

    resp = client.get('/income-engine')
    assert resp.status_code == 200
    data = resp.json()
    expected_avg = sum(vals)/7
    assert data['seven_day_avg'] == expected_avg


def test_bad_day_mode_detection():
    reset_data()
    # create incomes where last two calendar days have zero income
    today = datetime.date.today()
    # earlier days have income
    main.user_data['income'] = [
        {'amount': 100, 'date': (today - datetime.timedelta(days=4)).isoformat()},
        {'amount': 50, 'date': (today - datetime.timedelta(days=3)).isoformat()},
    ]
    # ensure last two days are zero by not adding entries for them
    main.compute_bad_day_mode()
    assert main.user_data.get('bad_day_mode', False) is True


def test_emergency_buffer_formula():
    reset_data()
    # create variable incomes over 14 days
    vals = [0,0,100,50,0,200,0,150,50,0,100,0,80,120]
    dts = dates_for(14)
    main.user_data['income'] = [{'amount': v, 'date': d} for v,d in zip(vals, dts)]

    resp = client.get('/emergency-buffer')
    assert resp.status_code == 200
    data = resp.json()

    last7 = [d['income'] for d in data['last14'][-7:]]
    seven_day_avg = sum(last7)/7
    stdev = statistics.pstdev([d['income'] for d in data['last14']])
    median = statistics.median([d['income'] for d in data['last14']])
    expected = max(round(seven_day_avg * 1.5,2), round(stdev * 3,2), round(max(seven_day_avg, median),2))
    assert data['recommended_buffer'] == expected