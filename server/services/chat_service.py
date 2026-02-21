from bson import ObjectId
from datetime import datetime
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
    # Truncate message for chat name (max 50 chars)
    chat_name = message[:50] + "..." if len(message) > 50 else message
    now = datetime.utcnow()
    
    chat_doc = {
        "user_id": user_id,
        "chat_name": chat_name,
        "chat_created_on": now,
        "chat_last_updated_on": now,
        "messages": [
            {"role": "user", "id": ObjectId(), "content": message},
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


def append_message(chat_id: str, role: str, content: str, mcp_data = {}, message_type: str | None = None):
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
    
    message['mcp_data'] = mcp_data

    get_collection("chats").update_one(
        {"_id": ObjectId(chat_id)},
        {
            "$push": {"messages": message},
            "$set": {"chat_last_updated_on": datetime.utcnow()}
        },
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
        "user_id": chat.get("user_id"),
        "chat_name": chat.get("chat_name"),
        "chat_created_on": chat.get("chat_created_on").isoformat() if chat.get("chat_created_on") else None,
        "chat_last_updated_on": chat.get("chat_last_updated_on").isoformat() if chat.get("chat_last_updated_on") else None,
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
    # Get all chats directly by user_id from chats collection
    chat_cursor = get_collection("chats").find({"user_id": user_id}).sort("chat_last_updated_on", -1)
    
    chats = []
    for idx, chat in enumerate(chat_cursor):
        # Extract date from ObjectId (creation timestamp)
        created_at = chat.get("chat_created_on") or chat["_id"].generation_time
        updated_at = chat.get("chat_last_updated_on")
        chat_name = chat.get("chat_name") or f"Chat - {idx + 1}"
        chats.append({
            "id": str(chat["_id"]),
            "user_id": chat.get("user_id"),
            "chat_name": chat_name,
            "title": chat_name,
            "chat_created_on": created_at.isoformat() if created_at else None,
            "chat_last_updated_on": updated_at.isoformat() if updated_at else None,
            "date": created_at.strftime("%b %d") if created_at else None,
        })

    return chats

def get_llm_hidden_context(user_name: str | None, location_info: dict | None) -> str | None:
    context_parts = []

    if user_name:
        context_parts.append(f"- User's name is {user_name}.")
    if location_info:
        loc = location_info
        location_str = ", ".join(filter(None, [loc["area"], loc["city"], loc["state"], loc["pincode"]]))
        if location_str:
            context_parts.append(f"- User's current location is {location_str}.")
        if loc.get("lat") and loc.get("long"):
            context_parts.append(f"- Coordinates: lat {loc['lat']}, long {loc['long']}.")

    content = "\n".join(context_parts)
    if content.strip() == "":
        return None
    else:
        return f"""
Hidden Context:
{content}
"""
