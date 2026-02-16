from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from controllers.chat_controller import (
    ChatCreateRequest,
    ChatMessageRequest,
    create_chat,
    stream_chat,
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/create")
def create_chat_route(payload: ChatCreateRequest):
    return create_chat(payload)


@router.post("/message")
def create_chat_message(payload: ChatMessageRequest):
    return StreamingResponse(stream_chat(payload), media_type="text/event-stream")
