from __future__ import annotations

from typing import BinaryIO

from pypdf import PdfReader
from docx import Document


def _normalize_text(text: str) -> str:
    return " ".join(text.replace("\r", "\n").split())


async def extract_text_from_upload(file: BinaryIO, filename: str) -> str:
    lower_name = (filename or "").lower()

    if lower_name.endswith(".pdf"):
        reader = PdfReader(file)
        pages = []
        for page in reader.pages:
            page_text = page.extract_text() or ""
            pages.append(page_text)
        return _normalize_text("\n".join(pages))

    if lower_name.endswith(".docx"):
        doc = Document(file)
        paragraphs = [p.text for p in doc.paragraphs]
        return _normalize_text("\n".join(paragraphs))

    if lower_name.endswith(".txt"):
        content = file.read().decode("utf-8", errors="replace")
        return _normalize_text(content)

    if hasattr(file, "read"):
        raw = file.read()
        if isinstance(raw, bytes):
            try:
                return _normalize_text(raw.decode("utf-8", errors="replace"))
            except Exception:
                return _normalize_text(str(raw))

    return ""
