# cspell:ignore genai gemini Nakuru unconfigured
import os
import json
try:
    # New Gemini SDK (google-genai)
    from google import genai as genai
except ImportError:  # pragma: no cover
    genai = None
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from landmanagement.models import LandListing
from .models import CropPredictionHistory


# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.0-flash')
GEMINI_CLIENT = None
if GEMINI_API_KEY and genai is not None:
    GEMINI_CLIENT = genai.Client(api_key=GEMINI_API_KEY)


def _parse_optional_float(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        stripped = value.strip()
        if stripped == '':
            return None
        try:
            return float(stripped)
        except ValueError:
            return None
    return None


def _is_positive_number(value):
    try:
        return value is not None and float(value) > 0
    except (TypeError, ValueError):
        return False


def _ai_config_error_response():
    if genai is None:
        return Response(
            {
                'error': 'AI service not configured',
                'message': 'Gemini SDK not installed (missing google-genai)'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    if not GEMINI_API_KEY:
        return Response(
            {
                'error': 'AI service not configured',
                'message': 'GEMINI_API_KEY environment variable is not set'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    if GEMINI_CLIENT is None:
        return Response(
            {
                'error': 'AI service not configured',
                'message': 'Gemini client not initialized (check GEMINI_API_KEY and installed packages)'
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    return None


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
    
    config_error = _ai_config_error_response()
    if config_error is not None:
        return config_error
    
    # Extract parameters from request
    mode = str(request.data.get('mode', '') or '')
    region = str(request.data.get('region', '') or '').strip()
    ph = _parse_optional_float(request.data.get('ph'))
    nitrogen = _parse_optional_float(request.data.get('nitrogen'))
    phosphorus = _parse_optional_float(request.data.get('phosphorus'))
    potassium = _parse_optional_float(request.data.get('potassium'))
    rainfall = _parse_optional_float(request.data.get('rainfall'))
    temperature = _parse_optional_float(request.data.get('temperature'))
    
    # Build the prompt for Gemini
    prompt = f"""You are an expert agricultural advisor for Kenyan farming. Based on the following parameters, recommend the top 5 most suitable crops for cultivation.

Parameters provided:
"""
    
    if region:
        prompt += f"- Region: {region}\n"
    if _is_positive_number(ph):
        prompt += f"- Soil pH: {ph}\n"
    if _is_positive_number(nitrogen):
        prompt += f"- Nitrogen content: {nitrogen} mg/kg\n"
    if _is_positive_number(phosphorus):
        prompt += f"- Phosphorus content: {phosphorus} mg/kg\n"
    if _is_positive_number(potassium):
        prompt += f"- Potassium content: {potassium} mg/kg\n"
    if _is_positive_number(rainfall):
        prompt += f"- Average annual rainfall: {rainfall} mm\n"
    if _is_positive_number(temperature):
        prompt += f"- Average temperature: {temperature} °C\n"
    
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
        # Generate response
        response = GEMINI_CLIENT.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        
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
                'mode': mode,
                'region': region,
                'ph': ph,
                'nitrogen': nitrogen,
                'phosphorus': phosphorus,
                'potassium': potassium,
                'rainfall': rainfall,
                'temperature': temperature,
            },
            'predictions': predictions.get('recommendations', [])
        }

        # Persist to history (best-effort)
        try:
            CropPredictionHistory.objects.create(
                user=request.user,
                mode=mode,
                region=region,
                ph=ph,
                nitrogen=nitrogen,
                phosphorus=phosphorus,
                potassium=potassium,
                rainfall=rainfall,
                temperature=temperature,
                predictions=result['predictions'],
            )
        except Exception:
            pass
        
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
        'status': 'healthy' if (GEMINI_API_KEY and genai is not None) else 'unconfigured',
        'api_key_set': bool(GEMINI_API_KEY),
        'sdk_available': genai is not None,
        'model': GEMINI_MODEL,
        'message': 'AI prediction service is ready' if (GEMINI_API_KEY and genai is not None) else 'GEMINI_API_KEY not set or Gemini SDK missing'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def prediction_history(request):
    paginator = PageNumberPagination()
    qs = CropPredictionHistory.objects.filter(user=request.user).order_by('-created_at')
    page = paginator.paginate_queryset(qs, request)

    results = []
    for item in page:
        top = item.predictions[0] if isinstance(item.predictions, list) and item.predictions else {}
        top_name = top.get('crop_name') or ''
        top_score = top.get('suitability_score')
        try:
            top_score = int(top_score) if top_score is not None else None
        except (TypeError, ValueError):
            top_score = None

        query_parts = []
        if item.region:
            query_parts.append(item.region)
        if item.ph is not None:
            query_parts.append(f"pH {item.ph}")
        if item.nitrogen is not None:
            query_parts.append("N")
        if item.phosphorus is not None:
            query_parts.append("P")
        if item.potassium is not None:
            query_parts.append("K")
        if item.rainfall is not None:
            query_parts.append(f"{item.rainfall}mm")

        results.append(
            {
                'id': item.id,
                'created_at': item.created_at,
                'mode': item.mode,
                'region': item.region,
                'ph': item.ph,
                'nitrogen': item.nitrogen,
                'phosphorus': item.phosphorus,
                'potassium': item.potassium,
                'rainfall': item.rainfall,
                'temperature': item.temperature,
                'query': ', '.join(query_parts) if query_parts else '—',
                'top_crop': top_name or '—',
                'match': top_score,
                'predictions': item.predictions,
            }
        )

    return paginator.get_paginated_response(results)


def _heuristic_land_match_score(user, land: LandListing):
    score = 60
    reasons = []

    if getattr(land, 'is_verified', False):
        score += 10
        reasons.append('verified listing')
    if str(getattr(land, 'status', '')).lower() == 'vacant':
        score += 8
        reasons.append('currently vacant')
    if getattr(land, 'has_irrigation', False):
        score += 6
        reasons.append('irrigation available')
    if getattr(land, 'has_road_access', False):
        score += 4
        reasons.append('good road access')

    user_county = str(getattr(user, 'county', '') or '').strip().lower()
    location = str(getattr(land, 'location_name', '') or '').strip().lower()
    if user_county and location and user_county in location:
        score += 8
        reasons.append('close to your county')

    score = max(0, min(100, score))
    if not reasons:
        reasons = ['good overall fit']
    return score, 'Good match: ' + ', '.join(reasons) + '.'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def land_match(request):
    land_ids = request.data.get('land_ids')
    if land_ids is None:
        return Response({'error': 'land_ids is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not isinstance(land_ids, list):
        return Response({'error': 'land_ids must be a list'}, status=status.HTTP_400_BAD_REQUEST)

    land_ids = [i for i in land_ids if isinstance(i, int)]
    land_ids = land_ids[:20]

    lands = (
        LandListing.objects.filter(id__in=land_ids)
        .select_related('soil_data')
        .only(
            'id',
            'title',
            'location_name',
            'total_area',
            'price_per_month',
            'has_irrigation',
            'has_road_access',
            'has_electricity',
            'has_fencing',
            'is_verified',
            'status',
        )
    )
    lands_by_id = {l.id: l for l in lands}

    config_error = _ai_config_error_response()
    if config_error is None:
        user_profile = {
            'county': getattr(request.user, 'county', None),
        }
        land_payload = []
        for land in lands_by_id.values():
            soil = getattr(land, 'soil_data', None)
            land_payload.append(
                {
                    'id': land.id,
                    'title': land.title,
                    'location': land.location_name,
                    'total_area': float(land.total_area) if land.total_area is not None else None,
                    'price_per_month': float(land.price_per_month) if land.price_per_month is not None else None,
                    'amenities': {
                        'irrigation': bool(getattr(land, 'has_irrigation', False)),
                        'road_access': bool(getattr(land, 'has_road_access', False)),
                        'electricity': bool(getattr(land, 'has_electricity', False)),
                        'fencing': bool(getattr(land, 'has_fencing', False)),
                    },
                    'verified': bool(getattr(land, 'is_verified', False)),
                    'status': getattr(land, 'status', ''),
                    'soil': {
                        'soil_type': getattr(soil, 'soil_type', None) if soil else None,
                        'ph_level': getattr(soil, 'ph_level', None) if soil else None,
                        'rainfall': getattr(soil, 'rainfall', None) if soil else None,
                        'temperature': getattr(soil, 'temperature', None) if soil else None,
                    },
                }
            )

        prompt = f"""You are an expert agricultural and leasing advisor for Kenya.

Given the user profile and a list of land listings, return an AI match score for each land (0-100) and a short 1-sentence reason tailored to the user.

Return JSON ONLY in this exact format:
{{
  \"matches\": [
    {{\"land_id\": 123, \"ai_score\": 84, \"ai_reason\": \"Short reason\"}}
  ]
}}

User profile: {json.dumps(user_profile)}
Lands: {json.dumps(land_payload)}
"""

        try:
            response = GEMINI_CLIENT.models.generate_content(model=GEMINI_MODEL, contents=prompt)
            text = response.text.strip()
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError:
                import re
                m = re.search(r'\{.*\}', text, re.DOTALL)
                parsed = json.loads(m.group()) if m else {}

            matches = parsed.get('matches', []) if isinstance(parsed, dict) else []
            normalized = []
            for m in matches:
                try:
                    lid = int(m.get('land_id'))
                except (TypeError, ValueError):
                    continue
                try:
                    score = int(m.get('ai_score'))
                except (TypeError, ValueError):
                    score = None
                reason = str(m.get('ai_reason') or '').strip()
                if score is None:
                    continue
                normalized.append({'land_id': lid, 'ai_score': max(0, min(100, score)), 'ai_reason': reason})

            by_id = {m['land_id']: m for m in normalized}
            out = []
            for lid in land_ids:
                if lid in by_id:
                    out.append(by_id[lid])
                elif lid in lands_by_id:
                    score, reason = _heuristic_land_match_score(request.user, lands_by_id[lid])
                    out.append({'land_id': lid, 'ai_score': score, 'ai_reason': reason})
            return Response({'matches': out}, status=status.HTTP_200_OK)
        except Exception:
            pass

    out = []
    for lid in land_ids:
        land = lands_by_id.get(lid)
        if not land:
            continue
        score, reason = _heuristic_land_match_score(request.user, land)
        out.append({'land_id': lid, 'ai_score': score, 'ai_reason': reason})
    return Response({'matches': out}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat(request):
    config_error = _ai_config_error_response()
    if config_error is not None:
        return config_error

    message = str(request.data.get('message', '') or '').strip()
    if not message:
        return Response({'error': 'message is required'}, status=status.HTTP_400_BAD_REQUEST)

    prompt = f"""You are FarmBot, the FarmLease in-app assistant for Kenyan farmers, landowners, and agro-dealers.

Answer the user's question in a helpful, concise way. Use short paragraphs or bullet points when appropriate. If the user asks for steps, give clear steps. If you don't know, say what you can and suggest where in the app to check.

User message: {message}
"""

    try:
        response = GEMINI_CLIENT.models.generate_content(model=GEMINI_MODEL, contents=prompt)
        text = (response.text or '').strip()
        return Response({'reply': text}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {
                'error': 'Chat failed',
                'message': str(e),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
