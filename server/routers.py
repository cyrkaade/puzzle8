from fastapi import APIRouter, HTTPException
import model
import config
from bson import ObjectId

def convert_mongo_doc(document):
    document["_id"] = str(document["_id"])
    return document

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

