from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from models.deviation_record import DeviationRecord
from schemas.deviation_schema import DeviationPayload

router = APIRouter()


class SaveResponse(BaseModel):
    message: str


@router.post("/save", response_model=SaveResponse)
def save_deviation(
    payload: DeviationPayload,
    db: Session = Depends(get_db),
):
    try:
        persisted_data = payload.model_dump(exclude_none=True, exclude={"chat_response"})
        record = DeviationRecord(**persisted_data)
        db.add(record)
        db.commit()
        db.refresh(record)
        return {"message": "Deviation saved successfully."}
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save deviation: {str(exc)}",
        ) from exc
