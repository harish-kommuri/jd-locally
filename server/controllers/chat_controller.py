import json
from typing import Generator

from pydantic import BaseModel

from services.chat_service import (
    append_message,
    create_chat_thread,
    get_chat_messages_for_llm,
    get_chat_thread,
)
from services.generative_ai_service import generate_response


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
    chat_id = create_chat_thread(payload.user_id, payload.message)
    return {"chat_id": str(chat_id)}


def stream_chat(payload: ChatMessageRequest) -> Generator[str, None, None]:
    user_message = append_message(payload.chat_id, "user", payload.message)

    yield f"data: {json.dumps({**user_message, 'id': str(user_message['id'])})}\n\n"

    for status in [
        "Thinking",
        "Fetching data",
        "Rendering View",
    ]:
        update = {
            "role": "system",
            "id": "update",
            "msg": status,
            "type": "update",
        }
        yield f"data: {json.dumps(update)}\n\n"

    chat_messages = get_chat_messages_for_llm(payload.chat_id)
    response_text = generate_response(chat_messages)
    system_message = append_message(payload.chat_id, "system", response_text)

    yield f"data: {json.dumps({**system_message, 'id': str(system_message['id'])})}\n\n"


def stream_chat_response(payload: ChatRespondRequest) -> Generator[str, None, None]:
    for status in [
        "Thinking",
        "Fetching data",
        "Rendering View",
    ]:
        update = {
            "role": "system",
            "id": "update",
            "msg": status,
            "type": "update",
        }
        yield f"data: {json.dumps(update)}\n\n"

    chat_messages = get_chat_messages_for_llm(payload.chat_id)
    response_text = generate_response(chat_messages)
    system_message = append_message(payload.chat_id, "system", response_text)

    yield f"data: {json.dumps({**system_message, 'id': str(system_message['id'])})}\n\n"


def fetch_chat(chat_id: str):
    chat = get_chat_thread(chat_id)

    if not chat:
        return {"chat_id": chat_id, "messages": []}

    return chat
