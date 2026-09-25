from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from lib.utils import is_pdf, is_docx, save_temp_file
from services.document.document_service import DocumentService
from services.document.pdf_loader import PDFLoader
from services.document.docx_loader import DOCXLoader
from services.llm_module.llm_module import LLM_Module

process_query_router = APIRouter()


@process_query_router.post("/submit-query")
async def upload_deviation(
    file: UploadFile | None = File(default=None),
    query: str | None = Form(default=None),
):
    temp_path = None

    try:
        query = (query or "").strip()
        print("[API] /submit-query called | file_present=%s | query_len=%s" % (bool(file), len(query)))

        if file is None and not query:
            print("[API] validation failed: no file and no query")
            raise HTTPException(
                status_code=400,
                detail="Provide either an uploaded document or a query string.",
            )

        file_content = ""

        if file is not None:
            print("[API] file received | filename=%s" % file.filename)

            if not file.filename:
                print("[API] filename missing")
                raise HTTPException(status_code=400, detail="No filename provided")

            content = await file.read()
            if not content:
                print("[API] uploaded file is empty")
                raise HTTPException(status_code=400, detail="Uploaded file is empty")

            if is_pdf(file.filename):
                print("[API] PDF detected")
                temp_path = save_temp_file(content=content, file_type=".pdf")
                print("[API] temp pdf created | path=%s" % temp_path)
                file_content = DocumentService().load_document(
                    file_path=temp_path, document_loader=PDFLoader()
                )
            elif is_docx(file.filename):
                print("[API] DOCX detected")
                temp_path = save_temp_file(content=content, file_type=".docx")
                print("[API] temp docx created | path=%s" % temp_path)
                file_content = DocumentService().load_document(
                    file_path=temp_path, document_loader=DOCXLoader()
                )
            else:
                print("[API] unsupported file type | filename=%s" % file.filename)
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported file type. Upload PDF or DOCX only.",
                )

        print("[API] calling LLM module | query_len=%s | file_content_len=%s" % (len(query), len(file_content)))
        final_response = LLM_Module().invoke_structured_model(
            file_content=file_content,
            query=query,
        )

        print("[API] AI response completed successfully")
        return final_response

    except HTTPException:
        raise
    except Exception as e:
        print("[API] unexpected exception: %s" % str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process deviation: {str(e)}",
        )
    finally:
        if temp_path is not None and temp_path.exists():
            temp_path.unlink(missing_ok=True)
            print("[API] temp file cleaned up | path=%s" % temp_path)
