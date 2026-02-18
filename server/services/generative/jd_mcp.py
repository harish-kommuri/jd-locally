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
