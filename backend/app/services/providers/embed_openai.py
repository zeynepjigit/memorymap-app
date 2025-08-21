import os
from typing import List

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None  # type: ignore


class OpenAIEmbeddingsProvider:
    def __init__(self, api_key: str | None = None, model: str = "text-embedding-3-small"):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY is required for OpenAI embeddings provider")
        if OpenAI is None:
            raise RuntimeError("openai package is not available")
        self.client = OpenAI(api_key=self.api_key)
        self.model = model

    def embed(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        resp = self.client.embeddings.create(model=self.model, input=texts)
        return [d.embedding for d in resp.data]


