from bson import ObjectId

from services.database_service import get_collection


def create_chat_thread(user_id: str, message: str, current_location: dict | None = None):
    chat_doc = {
        "current_location": current_location or {},
        "messages": [
            {"role": "user", "id": ObjectId(), "msg": message},
        ],
    }

    chat_result = get_collection("chats").insert_one(chat_doc)
    chat_id = chat_result.inserted_id

    get_collection("users").update_one(
        {"user_id": user_id},
        {"$addToSet": {"chats": chat_id}},
        upsert=True,
    )

    return chat_id


def append_message(chat_id: str, role: str, msg: str, message_type: str | None = None):
    message = {"role": role, "id": ObjectId(), "msg": msg}

    if message_type:
        message["type"] = message_type

    get_collection("chats").update_one(
        {"_id": ObjectId(chat_id)},
        {"$push": {"messages": message}},
    )

    return message


def get_chat_thread(chat_id: str):
    chat = get_collection("chats").find_one({"_id": ObjectId(chat_id)})

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


def get_chat_messages_for_llm(chat_id: str):
    chat = get_collection("chats").find_one({"_id": ObjectId(chat_id)})

    if not chat:
        return []

    llm_messages = []
    for message in chat.get("messages", []):
        if message.get("msg"):
            llm_messages.append({
                "role": message.get("role", "user"),
                "content": message["msg"],
            })

    return llm_messages
