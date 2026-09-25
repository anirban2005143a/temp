from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import DeviationRecord
from app.schemas import DeviationFormData, DeviationInput, ImpactAssessment, ProcessResponse
from app.services.ai_service import assess_impact, extract_deviation_data
from app.services.document_service import extract_text_from_upload

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok", "service": "AI Deviation Intake Module"}


@router.post("/upload")
async def upload_deviation(
    file: UploadFile = File(...),
    source: Annotated[str, Form()] = "upload",
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="A file is required for upload.")

    file_content = await file.read()
    document = file.file if hasattr(file, "file") else None
    if document is None:
        raise HTTPException(status_code=400, detail="Unable to read uploaded file.")
    document.seek(0)

    extracted_text = await extract_text_from_upload(document, file.filename)
    if not extracted_text:
        raise HTTPException(status_code=400, detail="No text could be extracted from the uploaded document.")

    return {
        "success": True,
        "source": source,
        "document_name": file.filename,
        "text": extracted_text,
        "message": "Document text extracted successfully.",
    }


@router.post("/process")
async def process_deviation(input_data: DeviationInput):
    try:
        extracted = extract_deviation_data(input_data.text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    recommended = assess_impact(extracted)

    return {
        "success": True,
        "source": input_data.source,
        "document_name": input_data.document_name,
        "extracted_data": extracted,
        "impact_assessment": recommended,
    }


@router.post("/extract")
async def extract_deviation(input_data: DeviationInput):
    try:
        extracted = extract_deviation_data(input_data.text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {"success": True, "extracted_data": extracted}


@router.post("/assess-impact")
async def assess_deviation_impact(extracted_data: DeviationFormData):
    assessment = assess_impact(extracted_data.model_dump())
    return {"success": True, "impact_assessment": assessment}


@router.post("/save", response_model=dict)
async def save_deviation(payload: DeviationFormData, db: Session = Depends(get_db)):
    record = DeviationRecord(**payload.model_dump(exclude_none=True))
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "success": True,
        "message": "Deviation saved successfully.",
        "deviation_id": record.deviation_id,
        "db_record_id": record.id,
    }
