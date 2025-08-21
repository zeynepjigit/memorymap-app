import os


def get_env(name: str, default: str = "") -> str:
    """Small helper to read environment variables safely."""
    return os.getenv(name, default)


class ProviderError(Exception):
    pass


