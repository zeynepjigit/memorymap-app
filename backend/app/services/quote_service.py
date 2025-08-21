import os
import random
from typing import Dict, List, Optional
from .providers.llm_gemini import GeminiLLMProvider

class QuoteService:
    def __init__(self):
        try:
            self.llm = GeminiLLMProvider()
            self.llm_available = True
        except (ValueError, RuntimeError):
            # If Gemini API key is not available, use fallback mode
            self.llm = None
            self.llm_available = False
        
        # Predefined color palettes for different emotions
        self.emotion_colors = {
            "POSITIVE": {
                "primary": "#FFD700",      # Gold
                "secondary": "#FFA500",    # Orange
                "accent": "#FF6B35",       # Coral
                "background": "#FFF8DC",   # Cornsilk
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "NEGATIVE": {
                "primary": "#4682B4",      # Steel Blue
                "secondary": "#5F9EA0",    # Cadet Blue
                "accent": "#87CEEB",       # Sky Blue
                "background": "#F0F8FF",   # Alice Blue
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "NEUTRAL": {
                "primary": "#708090",      # Slate Gray
                "secondary": "#A9A9A9",    # Dark Gray
                "accent": "#D3D3D3",       # Light Gray
                "background": "#F5F5F5",   # White Smoke
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "HAPPY": {
                "primary": "#FFD700",      # Gold
                "secondary": "#FFA500",    # Orange
                "accent": "#FF6B35",       # Coral
                "background": "#FFF8DC",   # Cornsilk
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "SAD": {
                "primary": "#4682B4",      # Steel Blue
                "secondary": "#5F9EA0",    # Cadet Blue
                "accent": "#87CEEB",       # Sky Blue
                "background": "#F0F8FF",   # Alice Blue
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "EXCITED": {
                "primary": "#FF4500",      # Orange Red
                "secondary": "#FF6347",    # Tomato
                "accent": "#FF8C00",       # Dark Orange
                "background": "#FFF5EE",   # Seashell
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "CALM": {
                "primary": "#20B2AA",      # Light Sea Green
                "secondary": "#48D1CC",    # Medium Turquoise
                "accent": "#40E0D0",       # Turquoise
                "background": "#F0FFFF",   # Azure
                "text": "#2F4F4F"          # Dark Slate Gray
            },
            "ANXIOUS": {
                "primary": "#DDA0DD",      # Plum
                "secondary": "#E6E6FA",    # Lavender
                "accent": "#9370DB",       # Medium Purple
                "background": "#F8F8FF",   # Ghost White
                "text": "#2F4F4F"          # Dark Slate Gray
            }
        }

    def generate_inspirational_quote(self, emotion: str, diary_content: str = "") -> Dict:
        """
        Generate an inspirational quote based on the user's emotion and diary content
        """
        try:
            # Determine emotion category
            emotion_category = self._categorize_emotion(emotion)
            
            # Check if LLM is available
            if not self.llm_available or self.llm is None:
                # Use fallback quotes if LLM is not available
                return self._get_fallback_quote(emotion)
            
            # Create prompt for quote generation
            prompt = self._create_quote_prompt(emotion_category, diary_content)
            
            # Generate quote using Gemini
            response = self.llm.chat(
                model="gemini-1.5-flash",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a wise and empathetic life coach who creates inspirational quotes. Generate quotes that are uplifting, meaningful, and relevant to the user's emotional state and life situation."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=150
            )
            
            # Parse the response to extract quote and author
            quote_data = self._parse_quote_response(response)
            
            # Get color palette for the emotion
            colors = self.emotion_colors.get(emotion_category, self.emotion_colors["NEUTRAL"])
            
            return {
                "success": True,
                "quote": quote_data["quote"],
                "author": quote_data["author"],
                "emotion": emotion_category,
                "colors": colors,
                "timestamp": self._get_current_timestamp()
            }
            
        except Exception as e:
            # Fallback to predefined quotes if AI generation fails
            return self._get_fallback_quote(emotion)

    def _categorize_emotion(self, emotion: str) -> str:
        """Categorize emotion into main categories"""
        emotion_lower = emotion.lower()
        
        if any(word in emotion_lower for word in ["happy", "joy", "excited", "positive", "good", "great"]):
            return "HAPPY"
        elif any(word in emotion_lower for word in ["sad", "depressed", "negative", "bad", "down"]):
            return "SAD"
        elif any(word in emotion_lower for word in ["excited", "thrilled", "energetic"]):
            return "EXCITED"
        elif any(word in emotion_lower for word in ["calm", "peaceful", "relaxed", "serene"]):
            return "CALM"
        elif any(word in emotion_lower for word in ["anxious", "worried", "nervous", "stressed"]):
            return "ANXIOUS"
        else:
            return "NEUTRAL"

    def _create_quote_prompt(self, emotion_category: str, diary_content: str) -> str:
        """Create a prompt for quote generation"""
        
        emotion_contexts = {
            "HAPPY": "The user is feeling happy and positive. Generate an uplifting quote that celebrates joy, gratitude, and the beauty of life.",
            "SAD": "The user is feeling sad or down. Generate a comforting and hopeful quote that offers solace and reminds them that difficult times pass.",
            "EXCITED": "The user is feeling excited and energetic. Generate a motivational quote that channels this energy into positive action and achievement.",
            "CALM": "The user is feeling calm and peaceful. Generate a serene quote that celebrates inner peace and mindfulness.",
            "ANXIOUS": "The user is feeling anxious or worried. Generate a reassuring quote that helps them find strength and perspective.",
            "NEUTRAL": "The user is in a neutral emotional state. Generate a balanced and thoughtful quote that encourages reflection and growth."
        }
        
        context = emotion_contexts.get(emotion_category, emotion_contexts["NEUTRAL"])
        
        if diary_content:
            # Extract key themes from diary content
            prompt = f"""
            {context}
            
            Based on this diary entry context: "{diary_content[:200]}..."
            
            Generate a short, inspirational quote (1-2 sentences) that resonates with their current situation and emotional state.
            The quote should be uplifting, meaningful, and personally relevant.
            
            Format your response as: "Quote text" - Author Name
            """
        else:
            prompt = f"""
            {context}
            
            Generate a short, inspirational quote (1-2 sentences) that would be meaningful for someone in this emotional state.
            The quote should be uplifting and encouraging.
            
            Format your response as: "Quote text" - Author Name
            """
        
        return prompt

    def _parse_quote_response(self, response: str) -> Dict:
        """Parse the AI response to extract quote and author"""
        try:
            # Clean the response
            response = response.strip()
            
            # Look for quote pattern: "Quote" - Author
            if ' - ' in response:
                parts = response.split(' - ')
                quote = parts[0].strip().strip('"')
                author = parts[1].strip()
            else:
                # Fallback: treat the whole response as quote
                quote = response.strip('"')
                author = "Unknown"
            
            return {
                "quote": quote,
                "author": author
            }
        except:
            return {
                "quote": "Every day is a new beginning. Take a deep breath and start again.",
                "author": "Anonymous"
            }

    def _get_fallback_quote(self, emotion: str) -> Dict:
        """Get a predefined quote if AI generation fails"""
        fallback_quotes = {
            "HAPPY": [
                {"quote": "Happiness is not something ready-made. It comes from your own actions.", "author": "Dalai Lama"},
                {"quote": "The joy of life comes from our encounters with new experiences.", "author": "Christopher McCandless"},
                {"quote": "Smile and the world smiles with you.", "author": "Anonymous"}
            ],
            "SAD": [
                {"quote": "This too shall pass.", "author": "Persian Proverb"},
                {"quote": "The wound is the place where the Light enters you.", "author": "Rumi"},
                {"quote": "Every storm runs out of rain.", "author": "Maya Angelou"}
            ],
            "EXCITED": [
                {"quote": "The future belongs to those who believe in the beauty of their dreams.", "author": "Eleanor Roosevelt"},
                {"quote": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"},
                {"quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs"}
            ],
            "CALM": [
                {"quote": "Peace comes from within. Do not seek it without.", "author": "Buddha"},
                {"quote": "In the midst of movement and chaos, keep stillness inside of you.", "author": "Deepak Chopra"},
                {"quote": "Calm mind brings inner strength and self-confidence.", "author": "Dalai Lama"}
            ],
            "ANXIOUS": [
                {"quote": "Worry does not empty tomorrow of its sorrows; it empties today of its strength.", "author": "Corrie Ten Boom"},
                {"quote": "Anxiety does not empty tomorrow of its sorrows, but only empties today of its strength.", "author": "Charles Spurgeon"},
                {"quote": "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.", "author": "Albert Camus"}
            ],
            "NEUTRAL": [
                {"quote": "Life is what happens when you're busy making other plans.", "author": "John Lennon"},
                {"quote": "The journey of a thousand miles begins with one step.", "author": "Lao Tzu"},
                {"quote": "Every day is a new beginning. Take a deep breath and start again.", "author": "Anonymous"}
            ]
        }
        
        emotion_category = self._categorize_emotion(emotion)
        quotes = fallback_quotes.get(emotion_category, fallback_quotes["NEUTRAL"])
        selected_quote = random.choice(quotes)
        
        colors = self.emotion_colors.get(emotion_category, self.emotion_colors["NEUTRAL"])
        
        return {
            "success": True,
            "quote": selected_quote["quote"],
            "author": selected_quote["author"],
            "emotion": emotion_category,
            "colors": colors,
            "timestamp": self._get_current_timestamp()
        }

    def _get_current_timestamp(self) -> str:
        """Get current timestamp in ISO format"""
        from datetime import datetime
        return datetime.now().isoformat()

    def get_quote_history(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get user's quote history (placeholder for future implementation)"""
        # This would typically fetch from database
        # For now, return empty list
        return []

# Global instance
quote_service = QuoteService()
