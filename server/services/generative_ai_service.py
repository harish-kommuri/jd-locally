import ollama

MODEL_NAME = "mistral:22b"
TEMPERATURE = 0.4
TOP_P = 0.9


def generate_response(prompt: str, system: str | None = None) -> str:
    messages = []
    if system:
        messages.append({"role": "system", "content": system})

    messages.append({"role": "user", "content": prompt})

    result = ollama.chat(
        model=MODEL_NAME,
        messages=messages,
        options={
            "temperature": TEMPERATURE,
            "top_p": TOP_P,
        },
    )

    return result["message"]["content"]
