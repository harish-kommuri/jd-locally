import ollama

from constants.llm import SYSTEM_CONTEXT
from services.generative.jd_mcp import get_tools, ollama_tools

MODEL_NAME = "ministral-3:14b"
TEMPERATURE = 0.4
TOP_P = 0.9

tools = get_tools()

llm_tools = ollama_tools(tools)

print(llm_tools)


def generate_response(messages: list[dict], system: str | None = None) -> str:
    payload = [{"role": "system", "content": system or SYSTEM_CONTEXT}]
    payload.extend(messages)

    result = ollama.chat(
        model=MODEL_NAME,
        messages=payload,
        tools=tools,
        options={
            "temperature": TEMPERATURE,
            "top_p": TOP_P,
        },
    )

    tool_calls = result["message"].get("tool_calls")
    if tool_calls:
        print("Tool calls:", tool_calls)

    return result["message"]["content"]
