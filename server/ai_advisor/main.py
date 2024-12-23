from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
openai.api_key = os.getenv("OPENAI_API_KEY")

# CORS configuratie
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    merchant_name: str
    amount: float
    category: str
    date: str

    class Config:
        from_attributes = True

class AdviceRequest(BaseModel):
    category: str
    budget: float
    current_spending: float
    transactions: List[Transaction]

    class Config:
        from_attributes = True

@app.post("/api/get-budget-advice")
async def get_budget_advice(request: AdviceRequest):
    try:
        # Analyseer uitgavenpatronen
        merchant_spending = {}
        for transaction in request.transactions:
            merchant = transaction.merchant_name
            merchant_spending[merchant] = merchant_spending.get(merchant, 0) + transaction.amount

        # Top uitgaven
        top_spending = sorted(
            merchant_spending.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]

        # Bereid context voor OpenAI voor
        context = f"""
        Categorie: {request.category}
        Budget: €{request.budget}
        Huidige uitgaven: €{request.current_spending}
        Overschrijding: €{request.current_spending - request.budget}

        Top uitgaven:
        {'\n'.join([f'- {merchant}: €{amount:.2f}' for merchant, amount in top_spending])}

        Geef specifiek en praktisch advies in het Nederlands over hoe deze persoon kan besparen 
        in deze categorie, gebaseerd op hun uitgavenpatroon. Focus op:
        1. Concrete besparingsmogelijkheden bij de top uitgaven
        2. Alternatieve opties of diensten
        3. Slimme besparingstips specifiek voor deze categorie
        4. Een realistische inschatting van mogelijke besparingen
        """

        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Je bent een ervaren financieel adviseur die praktische besparingstips geeft."},
                {"role": "user", "content": context}
            ],
            temperature=0.7,
            max_tokens=500
        )

        advice = response.choices[0].message.content

        # Schat potentiële besparingen
        potential_savings = round((request.current_spending - request.budget) * 0.3)

        return {
            "advice": advice,
            "potential_savings": potential_savings,
            "top_spending": top_spending
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 