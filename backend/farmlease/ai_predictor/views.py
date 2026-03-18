import os
import json
import google.genai as genai
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY and genai:
    genai.configure(api_key=GEMINI_API_KEY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_crop(request):
    """
    AI-powered crop prediction using Google Gemini API.
    
    Accepts:
    - region (optional): Regional preset like "Nakuru", "Rift Valley"
    - ph (optional): Soil pH level (0-14)
    - nitrogen (optional): Nitrogen content (mg/kg)
    - phosphorus (optional): Phosphorus content (mg/kg)
    - potassium (optional): Potassium content (mg/kg)
    - rainfall (optional): Average annual rainfall (mm/year)
    """
    
    # Check if the optional dependency is installed
    if not genai:
        return Response(
            {
                'error': 'AI service unavailable',
                'message': 'Optional dependency is missing: google-generativeai',
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # Check if API key is configured
    if not GEMINI_API_KEY:
        return Response(
            {
                'error': 'AI service not configured',
                'message': 'GEMINI_API_KEY environment variable is not set'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Extract parameters from request
    region = request.data.get('region', '')
    ph = request.data.get('ph', 0)
    nitrogen = request.data.get('nitrogen', 0)
    phosphorus = request.data.get('phosphorus', 0)
    potassium = request.data.get('potassium', 0)
    rainfall = request.data.get('rainfall', 0)
    
    # Build the prompt for Gemini
    prompt = f"""You are an expert agricultural advisor for Kenyan farming. Based on the following parameters, recommend the top 5 most suitable crops for cultivation.

Parameters provided:
"""
    
    if region:
        prompt += f"- Region: {region}\n"
    if ph > 0:
        prompt += f"- Soil pH: {ph}\n"
    if nitrogen > 0:
        prompt += f"- Nitrogen content: {nitrogen} mg/kg\n"
    if phosphorus > 0:
        prompt += f"- Phosphorus content: {phosphorus} mg/kg\n"
    if potassium > 0:
        prompt += f"- Potassium content: {potassium} mg/kg\n"
    if rainfall > 0:
        prompt += f"- Average annual rainfall: {rainfall} mm\n"
    
    prompt += """
Please provide your recommendations in the following JSON format ONLY (no additional text or markdown):
{
  "recommendations": [
    {
      "crop_name": "Full crop name with variety if applicable",
      "suitability_score": 95,
      "predicted_yield": "1.8 tons/acre",
      "estimated_revenue": "Ksh 450,000",
      "description": "Brief description explaining why this crop is suitable",
      "care_tips": "Key growing requirements and tips"
    }
  ]
}

Provide exactly 5 crop recommendations ranked by suitability score. Use realistic Kenyan market prices for revenue estimates. Consider the specific region and soil conditions if provided.
"""
    
    try:
        # Initialize Gemini model - using gemini-flash-latest (fast and has separate quota)
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Parse the response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            # Find the actual JSON content
            lines = response_text.split('\n')
            json_lines = []
            in_json = False
            for line in lines:
                if line.strip().startswith('```'):
                    in_json = not in_json
                    continue
                if in_json or (line.strip().startswith('{') or json_lines):
                    json_lines.append(line)
            response_text = '\n'.join(json_lines)
        
        # Parse JSON response
        try:
            predictions = json.loads(response_text)
        except json.JSONDecodeError:
            # If direct parsing fails, try to extract JSON from text
            import re
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                predictions = json.loads(json_match.group())
            else:
                raise ValueError("Could not parse AI response as JSON")
        
        # Add metadata
        result = {
            'success': True,
            'parameters': {
                'region': region,
                'ph': ph,
                'nitrogen': nitrogen,
                'phosphorus': phosphorus,
                'potassium': potassium,
                'rainfall': rainfall
            },
            'predictions': predictions.get('recommendations', [])
        }
        
        return Response(result, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Log the full error for debugging
        import traceback
        print(f"AI Prediction Error: {str(e)}")
        print(traceback.format_exc())
        
        # Provide specific error messages
        error_message = str(e)
        if "quota" in error_message.lower():
            error_message = "API quota exceeded. Please try again later or upgrade your plan."
        elif "api key" in error_message.lower():
            error_message = "Invalid API key. Please check your configuration."
        elif "404" in error_message or "not found" in error_message.lower():
            error_message = "AI model not available. Please contact support."
        
        return Response(
            {
                'error': 'Prediction failed',
                'message': error_message,
                'details': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_check(request):
    """Check if the AI service is properly configured"""
    return Response({
        'status': 'healthy' if (GEMINI_API_KEY and genai) else 'unconfigured',
        'dependency_installed': bool(genai),
        'api_key_set': bool(GEMINI_API_KEY),
        'message': (
            'AI prediction service is ready'
            if (GEMINI_API_KEY and genai)
            else (
                'google-generativeai not installed'
                if not genai
                else 'GEMINI_API_KEY not set'
            )
        ),
    })
