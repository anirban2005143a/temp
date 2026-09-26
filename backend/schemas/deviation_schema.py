from datetime import date

from pydantic import BaseModel, ConfigDict


class DeviationPayload(BaseModel):
    site: str | None = None
    occurrence_date: date | None = None
    deviation_title: str | None = None
    source: str | None = None
    related_product_material: str | None = None
    batch_lot_number: str | None = None
    description: str | None = None
    severity: str | None = None
    risk_assessment: str | None = None
    suggested_next_step: str | None = None

    model_config = ConfigDict(extra="ignore")
