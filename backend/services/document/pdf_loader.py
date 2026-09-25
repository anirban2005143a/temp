from pathlib import Path

from langchain_community.document_loaders import UnstructuredPDFLoader

from services.document.document_loader import DocumentLoader


class PDFLoader(DocumentLoader):
    def load(self, file_path: Path) -> str:
        print("[PDF Loader] starting PDF extraction | path=%s" % file_path)
        loader = UnstructuredPDFLoader(
            file_path,
            strategy="hi_res",
        )

        documents = loader.load()
        print("[PDF Loader] extracted blocks=%s" % len(documents))

        content = "\n\n".join(document.page_content for document in documents)
        print("[PDF Loader] final content length=%s" % len(content))
        return content

