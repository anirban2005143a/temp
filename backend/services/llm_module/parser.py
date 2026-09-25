from typing import Optional

from pydantic import BaseModel, Field


class DeviationFormData(BaseModel):
    chat_response: str = Field(
        description=(
            "A concise, user-friendly message explaining that the deviation "
            "information has been extracted from the provided source. Mention "
            "important extracted information or uncertainties when relevant, "
            "and tell the user to review the generated form before saving. "
            "Do not include information that was not supported by the source."
        )
    )

    product_name: Optional[str] = Field(
        default=None,
        description="Name of the pharmaceutical product associated with the deviation."
    )

    batch_number: Optional[str] = Field(
        default=None,
        description="Batch number of the product affected by the deviation."
    )

    site: Optional[str] = Field(
        default=None,
        description="Manufacturing site or facility where the deviation occurred."
    )

    deviation_title: Optional[str] = Field(
        default=None,
        description="Short, concise title summarizing the deviation event."
    )

    deviation_type: Optional[str] = Field(
        default=None,
        description="Type or category of deviation, such as process deviation, equipment deviation, material deviation, documentation deviation, or environmental deviation."
    )

    description: Optional[str] = Field(
        default=None,
        description="Clear description of what happened, including the observed event, the expected condition or requirement, and how the actual condition deviated from it."
    )

    affected_area: Optional[str] = Field(
        default=None,
        description="Process, department, equipment, system, or manufacturing area affected by the deviation."
    )

    immediate_action: Optional[str] = Field(
        default=None,
        description="Immediate corrective or containment action taken in response to the deviation."
    )

    root_cause: Optional[str] = Field(
        default=None,
        description="Identified or suspected root cause of the deviation. Only extract this if the source provides sufficient information."
    )

    quality_impact: Optional[str] = Field(
        default=None,
        description="Potential or identified impact of the deviation on product quality, safety, efficacy, identity, strength, purity, or regulatory compliance."
    )

    impact_summary: Optional[str] = Field(
        default=None,
        description="Brief summary of the overall impact of the deviation based on the information provided in the source."
    )

    severity: Optional[str] = Field(
        default=None,
        description="AI-assessed severity of the deviation based on its potential impact. Use the severity categories defined by the application."
    )

    severity_reason: Optional[str] = Field(
        default=None,
        description="Short explanation supporting the assigned severity, based only on the facts and potential quality impact described in the source."
    )