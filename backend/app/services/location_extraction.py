import spacy
from functools import lru_cache
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

@lru_cache(maxsize=1)
def get_spacy_model():
    return spacy.load("en_core_web_sm")

def extract_locations(text: str):
    nlp = get_spacy_model()
    doc = nlp(text)
    locations = [ent.text for ent in doc.ents if ent.label_ in ("GPE", "LOC")]
    return locations

def get_coordinates(location_name: str):
    geolocator = Nominatim(user_agent="memorymap-app")
    try:
        location = geolocator.geocode(location_name, timeout=10)
        if location:
            return {"lat": location.latitude, "lon": location.longitude}
        else:
            return None
    except GeocoderTimedOut:
        return None 