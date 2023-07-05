from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Favorite(BaseModel):
    user_id: str
    puzzle: str
    created_at: Optional[datetime]
