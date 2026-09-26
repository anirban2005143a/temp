import json

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
    current_form: str | None = Form(default=None),
):
    temp_path = None

    try:
        query = (query or "").strip()
        current_form_data = None

        if current_form:
            try:
                current_form_data = json.loads(current_form)
            except json.JSONDecodeError as exc:
                raise HTTPException(
                    status_code=400,
                    detail="current_form must be valid JSON.",
                ) from exc

        print(
            "[API] /submit-query called | file_present=%s | query_len=%s | form_present=%s"
            % (bool(file), len(query), bool(current_form_data))
        )

        if file is None and not query and not current_form_data:
            print("[API] validation failed: no file, no query, and no current form")
            raise HTTPException(
                status_code=400,
                detail="Provide either an uploaded document, a query string, or the current form data.",
            )

        file_content = ""

        if file is not None and file.filename:
            print("[API] file received | filename=%s" % file.filename)

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

        print(
            "[API] calling LLM module | query_len=%s | file_content_len=%s | current_form_present=%s"
            % (len(query), len(file_content), bool(current_form_data))
        )
        # final_response = LLM_Module().invoke_structured_model(
        #     file_content=file_content,
        #     query=query,
        #     current_form=current_form_data,
        # )

        final_response = {
            "chat_response": "Deviation form updated successfully.",
            # "site": None,
            "site": "Manufacturing Site - Unit 1",
            "occurrence_date": "2026-09-26",
            "deviation_title": "Temperature Excursion During Storage",
            "source": "Production",
            "related_product_material": "Paracetamol 500mg Tablets",
            "batch_lot_number": "PCM2026B001",
            "description": "The storage temperature exceeded the specified limit during routine monitoring. The temperature was recorded at 28°C for approximately 45 minutes against the specified range of 20°C to 25°C.",
            "severity": "High",
            "risk_assessment": "Potential risk to product quality due to elevated storage temperature, but the exposure duration was limited and the affected material has been placed on hold pending review.",
            "suggested_next_step": "Review the warehouse temperature records and perform a quality impact assessment before release disposition.",
        }

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
