from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.location_extraction import extract_locations, get_coordinates

router = APIRouter(prefix="/api/v1/location", tags=["location"])

class LocationExtractRequest(BaseModel):
    text: str

@router.post("/extract", response_model=dict)
async def extract_location(request: LocationExtractRequest):
    try:
        locations = extract_locations(request.text)
        return {"success": True, "locations": locations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Location extraction failed: {str(e)}")

class CoordinatesRequest(BaseModel):
    location_name: str

@router.post("/coordinates", response_model=dict)
async def get_location_coordinates(request: CoordinatesRequest):
    try:
        coords = get_coordinates(request.location_name)
        if coords:
            return {"success": True, "coordinates": coords}
        else:
            return {"success": False, "error": "Coordinates not found"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Coordinate extraction failed: {str(e)}")
