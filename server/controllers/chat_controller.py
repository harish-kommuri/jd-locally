import json
from typing import Generator
from pydantic import BaseModel
import time

from services.chat_service import (
    append_message,
    create_chat_thread,
    get_chat_messages_for_llm,
    get_chat_thread,
    get_user_chats,
)
from services.generative.llm import generate_response
from services.generative.jd_mcp import call_tool


class ChatCreateRequest(BaseModel):
    user_id: str
    message: str

class ChatMessageRequest(BaseModel):
    chat_id: str
    user_id: str  
    message: str


class ChatRespondRequest(BaseModel):
    chat_id: str


def create_chat(payload: ChatCreateRequest):
    chat_id = create_chat_thread(payload["user_id"], payload["message"])
    return {"chat_id": str(chat_id)}


def stream_chat(payload: ChatMessageRequest) -> Generator[str, None, None]:
    chatid = payload.chat_id
    user_message = None
    mcp_data = {}

    if chatid == "new":
        new_chat = create_chat({"user_id": payload.user_id, "message": payload.message})
        chatid = new_chat["chat_id"]
        user_message = { "role": "user", "chat_id": chatid, "id": "", "new_chat": True }
    else:
        user_message = append_message(chatid, "user", payload.message)
    
    yield f"data: {json.dumps({**user_message, 'chat_id': chatid, 'id': str(user_message['id'])})}\n\n"

    chat_messages = get_chat_messages_for_llm(chatid)
    yield f"data: {json.dumps({'chatId': chatid, 'data': { 'role': 'system', 'type': 'update', 'content': 'Thinking' }})}\n\n"

    response_text, tool_calls, status_texts, fe_binders = generate_response(chat_messages)

    if isinstance(tool_calls, list) and len(tool_calls) > 0:
        for call_info in tool_calls:
            tool_name = call_info.function.name
            payload = call_info.function.arguments

            if tool_name in status_texts:
                yield f"data: {json.dumps({'chatId': chatid, 'data': { 'role': 'system', 'type': 'update', 'content': status_texts[tool_name] or 'Fetching data' }})}\n\n"
                resp = call_tool(tool_name, payload)
                mcp_data = { "fe_binder": fe_binders.get(tool_name, "others"), "data": resp }
                time.sleep(4)

    system_message = append_message(chatid, "system", response_text, mcp_data)

    yield f"data: {json.dumps({**system_message, 'chat_id': chatid, 'id': str(system_message['id'])})}\n\n"

def fetch_chat(chat_id: str, user_id: str):
    chat = get_chat_thread(chat_id)

    if not chat:
        return {"chat_id": chat_id, "messages": [], "error": "Chat not found"}

    # Verify user owns this chat
    if chat.get("user_id") != user_id:
        return {"chat_id": chat_id, "messages": [], "error": "Unauthorized"}

    return chat


def fetch_user_chats(user_id: str):
    chats = get_user_chats(user_id)
    return {"chats": chats}
