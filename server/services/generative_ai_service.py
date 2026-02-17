import ollama

from app.constants import SYSTEM_CONTEXT

MODEL_NAME = "mistral:22b"
TEMPERATURE = 0.4
TOP_P = 0.9


def generate_response(messages: list[dict], system: str | None = None) -> str:
    payload = [{"role": "system", "content": system or SYSTEM_CONTEXT}]
    payload.extend(messages)

    result = ollama.chat(
        model=MODEL_NAME,
        messages=payload,
        options={
            "temperature": TEMPERATURE,
            "top_p": TOP_P,
        },
    )

    return result["message"]["content"]
