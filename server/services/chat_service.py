from bson import ObjectId
import json
import re

from services.database_service import get_collection


def _strip_code_block(text: str) -> str:
    """Remove ```json ... ``` or ``` ... ``` wrapper from text."""
    if not isinstance(text, str):
        return text

    pattern = r"^```(?:json)?\s*\n?([\s\S]*?)\n?```$"
    match = re.match(pattern, text.strip())

    return match.group(1).strip() if match else text


def _parse_json_message(content: str) -> dict | None:
    """Try to parse content as JSON, returns parsed dict or None."""
    if not isinstance(content, str):
        return None

    stripped = _strip_code_block(content.strip())

    if stripped.startswith("{"):
        try:
            return json.loads(stripped)
        except json.JSONDecodeError:
            pass

    return None


def create_chat_thread(user_id: str, message: str):
    chat_doc = {
        "messages": [
            {"role": "user", "id": ObjectId(), "content": message},
        ],
    }

    print(chat_doc)

    chat_result = get_collection("chats").insert_one(chat_doc)
    chat_id = chat_result.inserted_id

    get_collection("users").update_one(
        {"user_id": user_id},
        {"$addToSet": {"chats": chat_id}},
        upsert=True,
    )

    return chat_id


def append_message(chat_id: str, role: str, content: str, message_type: str | None = None):
    message = {"role": role, "id": ObjectId()}

    # Try to parse content as JSON
    parsed = _parse_json_message(content)

    if parsed:
        message["content"] = parsed.get("content", content)
        if parsed.get("type"):
            message["type"] = parsed["type"]
        if parsed.get("data"):
            message["data"] = parsed["data"]
    else:
        message["content"] = content

    if message_type and "type" not in message:
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
        if message.get("content"):
            llm_messages.append({
                "role": message.get("role", "user"),
                "content": message["content"],
            })

    return llm_messages


def get_user_chats(user_id: str):
    user = get_collection("users").find_one({"user_id": user_id})

    if not user or not user.get("chats"):
        return []

    chat_ids = user.get("chats", [])
    chats = []

    for idx, chat_id in enumerate(chat_ids):
        chat = get_collection("chats").find_one({"_id": chat_id})
        if chat:
            # Extract date from ObjectId (creation timestamp)
            created_at = chat["_id"].generation_time
            chats.append({
                "id": str(chat["_id"]),
                "title": f"Chat - {idx + 1}",
                "date": created_at.strftime("%b %d"),
            })

    return chats
