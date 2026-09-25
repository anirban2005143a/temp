from langchain_community.document_loaders import Docx2txtLoader
from services.document.document_loader import DocumentLoader


class DOCXLoader(DocumentLoader):

    def load(self, file_path: str) -> str:
        loader = Docx2txtLoader(file_path)
        documents = loader.load()

        return "\n\n".join(
            document.page_content
            for document in documents
        )
