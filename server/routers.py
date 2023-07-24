from fastapi import APIRouter, HTTPException
import spacy
import requests
import model
import config
from bson import ObjectId
from random import randint
from pydantic import BaseModel
import os
import openai
import yake
import random

positive_prompts = ["8k", "highest quality", "masterpiece", "ultra-high resolution", "best illustration", "Highly creative"]


def extract_keywords(text: str, max_n_keywords=6):
    kw_extractor = yake.KeywordExtractor()
    keywords = kw_extractor.extract_keywords(text)
    keywords = [kw for kw, score in keywords[-max_n_keywords:]]
    
    return ', '.join(keywords)

class RatingUpdate(BaseModel):
    user_id: str
    result: str

def convert_mongo_doc(document):
    document["_id"] = str(document["_id"])
    return document

# nlp = spacy.load('en_core_web_sm')

# def extract_keywords(text: str):
#     doc = nlp(text)
#     keywords = [chunk.text for chunk in doc.noun_chunks]
#     return ', '.join(keywords)


router = APIRouter()

@router.post("/favorites/")
def add_favorite(favorite: model.Favorite):
    result = config.favorites_collection.insert_one(favorite.dict())
    if result:
        return {"message": "Favorite added successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to add favorite")

@router.delete("/favorites/")
def remove_favorite(favorite: model.Favorite):
    result = config.favorites_collection.delete_one(favorite.dict())
    if result:
        return {"message": "Favorite removed successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to remove favorite")
    

@router.get("/favorites/{user_id}")
def get_favorites(user_id: str):
    favorites = config.favorites_collection.find({"user_id": user_id})
    favorites_list = [convert_mongo_doc(favorite) for favorite in favorites]
    return favorites_list

@router.delete("/favorites/{favorite_id}")
def remove_favorite(favorite_id: str):
    result = config.favorites_collection.delete_one({"_id": ObjectId(favorite_id)})
    if result.deleted_count:
        return {"message": "Favorite removed successfully"}
    else:
        raise HTTPException(status_code=400, detail="Failed to remove favorite")
    

@router.post("/generateImage")
def generate_image(body: model.ImageRequest):
    openai.api_key = os.getenv('OPENAI_API_KEY')
    prompt = extract_keywords(body.prompt)
    prompt += ', ' + ', '.join(random.sample(positive_prompts, 6))
    print(prompt)
    

    res = openai.Image.create(
    prompt=prompt,
    n=1,
    size="512x512",
  )
    image_url = res["data"][0]["url"]
    
    return {"image_url": image_url}


@router.get("/users/ranking/{user_id}")
def get_user_ranking(user_id: str):
    users = config.users_collection.find().sort("rating", -1)
    users_list = [convert_mongo_doc(user) for user in users]
    user_ranks = {user['_id']: idx+1 for idx, user in enumerate(users_list)}
    if user_id in user_ranks:
        return {"rank": user_ranks[user_id]}
    else:
        raise HTTPException(status_code=404, detail="User not found")


