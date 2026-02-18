import os

from pymongo import MongoClient
from pymongo.database import Database

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "jd_locally")

_client: MongoClient | None = None
_db: Database | None = None


def get_client() -> MongoClient:
    global _client

    if _client is None:
        _client = MongoClient(MONGO_URI)

    return _client


def get_db() -> Database:
    global _db

    if _db is None:
        _db = get_client()[DB_NAME]

    return _db


def get_collection(name: str):
    return get_db()[name]
