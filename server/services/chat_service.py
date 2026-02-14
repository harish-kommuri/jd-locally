import os

from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "jd_locally")

_client = MongoClient(MONGO_URI)
_db = _client[DB_NAME]


def create_chat_thread(user_id: str, message: str, current_location: dict | None = None):
    chat_doc = {
        "current_location": current_location or {},
        "messages": [{"role": "user", "message": message}],
    }

    chat_result = _db.chats.insert_one(chat_doc)
    chat_id = chat_result.inserted_id

    _db.users.update_one(
        {"user_id": user_id},
        {"$addToSet": {"chats": chat_id}},
        upsert=True,
    )

    return chat_id
