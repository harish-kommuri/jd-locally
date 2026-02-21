from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from controllers.chat_controller import (
    ChatMessageRequest,
    fetch_chat,
    fetch_user_chats,
    stream_chat
)

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/message")
def create_chat_message(payload: ChatMessageRequest):
    return StreamingResponse(stream_chat(payload), media_type="text/event-stream")


@router.get("/user/{user_id}")
def get_user_chats_route(user_id: str):
    return fetch_user_chats(user_id)


@router.get("/{chat_id}")
def get_chat(chat_id: str, user_id: str):
    return fetch_chat(chat_id, user_id)
