import os

import requests

MCP_HOST = os.getenv("MCP_HOST", "http://localhost:4545")


def get_tools():
    response = requests.get(f"{MCP_HOST}/tools")
    response.raise_for_status()
    return response.json()


def call_tool(tool_name: str, arguments: dict | None = None):
    response = requests.post(
        f"{MCP_HOST}/tools/{tool_name}",
        json=arguments or {},
    )
    response.raise_for_status()
    return response.json()


def ollama_tools(tools_response: dict | list | None):
    if not tools_response:
        return []

    tools = tools_response
    if isinstance(tools_response, dict):
        tools = tools_response.get("tools", [])

    normalized = []
    progress_texts = {}
    fe_binders = {}

    for tool in tools:
        if not isinstance(tool, dict):
            continue

        name = tool.get("name")
        if not name:
            continue

        description = tool.get("description") or tool.get("title") or ""
        parameters = tool.get("inputSchema") or {"type": "object", "properties": {}}
        progess_text = tool.get("progressText", "Getting Data")
        fe_binder = tool.get("feBinder", "others")
        progress_texts[name] = progess_text
        fe_binders[name] = fe_binder


        if isinstance(parameters, dict) and "type" not in parameters:
            parameters = {"type": "object", **parameters}

        normalized.append(
            {
                "type": "function",
                "function": {
                    "name": name,
                    "description": description,
                    "parameters": parameters,
                },
            }
        )

    return normalized, progress_texts, fe_binders
