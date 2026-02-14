from pydantic import BaseModel

from services.chat_service import create_chat_thread


class ChatCreateRequest(BaseModel):
    user_id: str
    message: str


def create_chat(payload: ChatCreateRequest):
    chat_id = create_chat_thread(payload.user_id, payload.message)
    return {"chat_id": str(chat_id)}
