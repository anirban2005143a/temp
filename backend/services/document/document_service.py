from pathlib import Path
from services.document.document_loader import DocumentLoader

class DocumentService():
    def __init__(self):
        pass

    def load_document(self, file_path:Path, document_loader:DocumentLoader) -> str :
        return document_loader.load(file_path=file_path)