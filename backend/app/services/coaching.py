import openai
import os
from typing import List, Dict

# OpenAI API ayarları
openai.api_key = os.getenv("OPENAI_API_KEY", "")

def generate_reflective_questions(diary_text: str, emotion: str = None, user_history: List[str] = None) -> Dict:
    """
    Günlük girdisine göre yansıtıcı sorular üretir
    """
    if not openai.api_key:
        return {
            "success": False,
            "error": "OpenAI API key is required"
        }
    
    # Prompt oluştur
    system_prompt = """You are a thoughtful life coach and therapist. Based on the user's diary entry, generate 3-5 reflective questions that help them explore their thoughts, feelings, and experiences more deeply. 

The questions should be:
- Thoughtful and introspective
- Encourage self-discovery
- Be supportive and non-judgmental
- Help the user understand patterns in their life
- Promote personal growth

Return the questions as a JSON array of strings."""

    user_prompt = f"Diary entry: {diary_text}"
    
    if emotion:
        user_prompt += f"\nDetected emotion: {emotion}"
    
    if user_history:
        user_prompt += f"\nUser's recent themes: {', '.join(user_history[-3:])}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        questions_text = response.choices[0].message.content
        
        # JSON parse etmeye çalış
        import json
        try:
            questions = json.loads(questions_text)
            if isinstance(questions, list):
                return {
                    "success": True,
                    "questions": questions,
                    "model_used": "gpt-4"
                }
        except json.JSONDecodeError:
            # JSON parse edilemezse, satır satır ayır
            questions = [q.strip() for q in questions_text.split('\n') if q.strip() and '?' in q]
            return {
                "success": True,
                "questions": questions[:5],  # İlk 5 soruyu al
                "model_used": "gpt-4"
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"GPT-4 request failed: {str(e)}"
        }

def generate_personal_development_advice(diary_entries: List[str], emotions: List[str] = None) -> Dict:
    """
    Kullanıcının günlük geçmişine göre kişisel gelişim önerileri üretir
    """
    if not openai.api_key:
        return {
            "success": False,
            "error": "OpenAI API key is required"
        }
    
    system_prompt = """You are an experienced life coach. Based on the user's recent diary entries, provide personalized development advice and actionable recommendations.

Focus on:
- Identifying patterns in their experiences
- Suggesting specific actions for improvement
- Highlighting their strengths
- Recommending resources or practices
- Encouraging positive habits

Return your advice as a structured response with sections: insights, recommendations, and next_steps."""

    entries_text = "\n\n".join([f"Entry {i+1}: {entry}" for i, entry in enumerate(diary_entries[-5:])])
    
    user_prompt = f"Recent diary entries:\n{entries_text}"
    
    if emotions:
        emotion_summary = ", ".join(emotions[-5:])
        user_prompt += f"\n\nRecent emotions: {emotion_summary}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        advice_text = response.choices[0].message.content
        
        return {
            "success": True,
            "advice": advice_text,
            "model_used": "gpt-4"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"GPT-4 request failed: {str(e)}"
        }

def analyze_progress(user_responses: List[Dict], time_period_days: int = 30) -> Dict:
    """
    Kullanıcının yansıtıcı soru yanıtlarına göre ilerleme analizi yapar
    """
    if not user_responses:
        return {
            "success": False,
            "error": "No user responses to analyze"
        }
    
    if not openai.api_key:
        return {
            "success": False,
            "error": "OpenAI API key is required"
        }
    
    system_prompt = """You are a progress tracking specialist. Based on the user's responses to reflective questions over time, analyze their personal growth and development patterns.

Provide insights on:
- Growth areas and improvements
- Recurring themes or challenges
- Positive changes over time
- Areas that need more attention
- Overall progress assessment

Return a structured analysis with sections: progress_summary, key_insights, areas_of_growth, and recommendations."""

    responses_text = "\n\n".join([
        f"Date: {resp.get('date', 'Unknown')}\nQuestion: {resp.get('question', '')}\nResponse: {resp.get('response', '')}"
        for resp in user_responses[-10:]  # Son 10 yanıt
    ])
    
    user_prompt = f"User's reflective question responses over the last {time_period_days} days:\n\n{responses_text}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=800,
            temperature=0.7
        )
        
        analysis_text = response.choices[0].message.content
        
        return {
            "success": True,
            "analysis": analysis_text,
            "model_used": "gpt-4",
            "responses_analyzed": len(user_responses)
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"GPT-4 request failed: {str(e)}"
        } 