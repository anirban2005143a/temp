from datetime import date
from typing import Optional, Literal
from pydantic import BaseModel, Field


class DeviationFormData(BaseModel):

    chat_response: str = Field(
        description=(
            "Very short status message confirming that the deviation form "
            "was created or updated. Do not include deviation details, "
            "field values, reasoning, risk assessment, severity, or "
            "suggested actions."
        )
    )

    site: Optional[str] = Field(
        default=None,
        description=(
            "Site or plant where the deviation occurred. "
            "Extract only when supported by the provided source. "
            "Never invent or guess the site."
        )
    )

    occurrence_date: Optional[date] = Field(
        default=None,
        description=(
            "Date on which the deviation occurred. "
            "Preserve the value as supported by the source. "
            "Do not invent or infer a value. Use ISO format YYYY-MM-DD."
        )
    )

    deviation_title: Optional[str] = Field(
        default=None,
        description=(
            "Short factual title or description of the documented deviation. "
            "It may be generated from supported facts but must not introduce "
            "unsupported information."
        )
    )

    source: Optional[str] = Field(
        default=None,
        description=(
            "Source from which the deviation was identified or reported. "
            "Extract only when supported by the provided source. "
            "Do not invent or guess the source."
        )
    )

    related_product_material: Optional[str] = Field(
        default=None,
        description=(
            "Product or material related to the deviation. "
            "Extract only when supported by the provided source. "
            "Never invent, guess, or infer the product or material."
        )
    )

    batch_lot_number: Optional[str] = Field(
        default=None,
        description=(
            "Batch or lot number associated with the deviation. "
            "Preserve exactly as stated in the source. "
            "Never invent, modify, or infer the batch or lot number."
        )
    )

    description: Optional[str] = Field(
        default=None,
        description=(
            "Detailed factual description of what happened, where it "
            "happened, when it happened, and how it was detected, based "
            "only on the provided source. Preserve important measurements, "
            "dates, ranges, and durations when available."
        )
    )

    severity: Optional[Literal["Low", "Moderate", "High"]] = Field(
        default=None,
        description=(
            "Initial AI-assessed severity. This is an AI assessment and does "
            "not need to be explicitly stated in the source. The LLM may "
            "assign Low, Moderate, or High based only on documented facts, "
            "including deviation magnitude, duration, affected process, "
            "documented or potential quality impact, mitigating actions, "
            "and material or batch status. Never assign severity solely "
            "because of the deviation type. Return null when there is "
            "insufficient evidence for a meaningful assessment."
        )
    )

    risk_assessment: Optional[str] = Field(
        default=None,
        description=(
            "AI-generated assessment of the risk associated with the "
            "documented deviation. Assess only from facts supported by "
            "the provided source and current form state. Consider potential "
            "impact to product quality, patient safety, compliance, process "
            "control, or batch/material status when supported by evidence. "
            "Clearly distinguish confirmed risk, potential risk, no "
            "documented risk, and undetermined risk. Do not invent risks, "
            "hazards, contamination, patient impact, regulatory impact, or "
            "other consequences that are not supported by the available "
            "information."
        )
    )

    suggested_next_step: Optional[str] = Field(
        default=None,
        description=(
            "AI-generated suggested next step based on the documented "
            "deviation and available evidence. Suggestions should be "
            "appropriate for further investigation, assessment, containment, "
            "documentation, or review as applicable. Do not state that an "
            "action has already been performed unless supported by the "
            "source. Clearly frame this field as a suggested or recommended "
            "next step, not a completed action. Do not invent specific "
            "procedures, test results, approvals, or actions that are not "
            "supported by the available information."
        )
    )
