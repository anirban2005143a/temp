from typing import Optional

from pydantic import BaseModel, Field


class DeviationInput(BaseModel):
    text: str = Field(..., min_length=10)
    source: str = "manual"
    document_name: Optional[str] = None


class DeviationFormData(BaseModel):
    deviation_id: Optional[str] = None
    product_name: Optional[str] = None
    batch_number: Optional[str] = None
    lot_number: Optional[str] = None
    site: Optional[str] = None
    deviation_title: Optional[str] = None
    deviation_type: Optional[str] = None
    description: Optional[str] = None
    affected_area: Optional[str] = None
    associated_material: Optional[str] = None
    impact_summary: Optional[str] = None
    severity: Optional[str] = None
    severity_reason: Optional[str] = None
    root_cause: Optional[str] = None
    immediate_action: Optional[str] = None
    owner: Optional[str] = None
    investigation_status: Optional[str] = "Open"
    quality_impact: Optional[str] = None
    reported_by: Optional[str] = None
    reporting_date: Optional[str] = None


class ImpactAssessment(BaseModel):
    severity: str
    risk_level: str
    score: int
    reason: str
    recommendations: list[str]


class ProcessResponse(BaseModel):
    success: bool
    extracted_data: DeviationFormData
    impact_assessment: ImpactAssessment
