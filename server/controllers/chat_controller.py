import json
from typing import Generator, Optional
from pydantic import BaseModel

from services.chat_service import (
    append_message,
    create_chat_thread,
    get_chat_messages_for_llm,
    get_chat_thread,
    get_user_chats,
)
from services.generative.llm import generate_response


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

    if chatid == "new":
        new_chat = create_chat({"user_id": payload.user_id, "message": payload.message})
        chatid = new_chat["chat_id"]
        user_message = { "role": "user", "chat_id": chatid, "id": "", "new_chat": True }
    else:
        user_message = append_message(chatid, "user", payload.message)
    
    yield f"data: {json.dumps({**user_message, 'chat_id': chatid, 'id': str(user_message['id'])})}\n\n"

    chat_messages = get_chat_messages_for_llm(chatid)
    yield f"data: {json.dumps({'chatId': chatid, 'data': { 'role': 'system', 'type': 'update', 'content': 'Thinking' }})}\n\n"

    response_text = generate_response(chat_messages)
    system_message = append_message(chatid, "system", response_text)

    yield f"data: {json.dumps({**system_message, 'chat_id': chatid, 'id': str(system_message['id'])})}\n\n"

def fetch_chat(chat_id: str):
    chat = get_chat_thread(chat_id)

    if not chat:
        return {"chat_id": chat_id, "messages": []}

    return chat


def fetch_user_chats(user_id: str):
    chats = get_user_chats(user_id)
    return {"chats": chats}
