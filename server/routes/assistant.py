from fastapi import APIRouter

from controllers.assistant_controller import assistant_status

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.get("")
def get_assistant():
    return assistant_status()
