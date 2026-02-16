import os

from bson import ObjectId
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "jd_locally")

_client = MongoClient(MONGO_URI)
_db = _client[DB_NAME]


def create_chat_thread(user_id: str, message: str, current_location: dict | None = None):
    chat_doc = {
        "current_location": current_location or {},
        "messages": [
            {"role": "user", "id": ObjectId(), "msg": message},
        ],
    }

    chat_result = _db.chats.insert_one(chat_doc)
    chat_id = chat_result.inserted_id

    _db.users.update_one(
        {"user_id": user_id},
        {"$addToSet": {"chats": chat_id}},
        upsert=True,
    )

    return chat_id


def append_message(chat_id: str, role: str, msg: str, message_type: str | None = None):
    message = {"role": role, "id": ObjectId(), "msg": msg}

    if message_type:
        message["type"] = message_type

    _db.chats.update_one(
        {"_id": ObjectId(chat_id)},
        {"$push": {"messages": message}},
    )

    return message


def get_chat_thread(chat_id: str):
    chat = _db.chats.find_one({"_id": ObjectId(chat_id)})

    if not chat:
        return None

    messages = []
    for message in chat.get("messages", []):
        messages.append({
            **message,
            "id": str(message.get("id")) if message.get("id") else None,
        })

    return {
        "chat_id": str(chat.get("_id")),
        "current_location": chat.get("current_location", {}),
        "messages": messages,
    }
