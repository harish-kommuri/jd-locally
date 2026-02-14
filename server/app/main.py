from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.assistant import router as assistant_router
from routes.chat import router as chat_router

app = FastAPI(title="Sample FastAPI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assistant_router)
app.include_router(chat_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/greeting")
def get_greeting(name: str = "World"):
    return {"message": f"Hello, {name}!"}
