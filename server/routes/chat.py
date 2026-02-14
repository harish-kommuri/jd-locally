from fastapi import APIRouter

from controllers.chat_controller import ChatCreateRequest, create_chat

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/create")
def create_chat_route(payload: ChatCreateRequest):
    return create_chat(payload)
