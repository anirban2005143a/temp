from typing import Optional

from pydantic import BaseModel, Field


class DeviationFormData(BaseModel):

    chat_response: str = Field(
        description=(
            "A concise, professional, user-friendly message explaining that "
            "the deviation information has been extracted from the provided source. "
            "Briefly mention important findings or uncertainties when relevant, "
            "and tell the user to review the generated form before saving. "
            "Do not include information that is not supported by the source."
        )
    )

    product_name: Optional[str] = Field(
        default=None,
        description=(
            "Name of the pharmaceutical product associated with the deviation. "
            "Return null if the product name is not present or cannot be determined "
            "reliably from the source."
        )
    )

    batch_number: Optional[str] = Field(
        default=None,
        description=(
            "Batch number of the product affected by the deviation. "
            "Preserve the batch number exactly as stated in the source."
        )
    )

    site: Optional[str] = Field(
        default=None,
        description=(
            "Manufacturing site or facility where the deviation occurred."
        )
    )

    deviation_title: Optional[str] = Field(
        default=None,
        description=(
            "Short, concise title summarizing the deviation event. "
            "The title should describe the actual abnormal event."
        )
    )

    deviation_type: Optional[str] = Field(
        default=None,
        description=(
            "Type or category of deviation, such as process deviation, "
            "equipment deviation, material deviation, documentation deviation, "
            "or environmental deviation. Infer the category only when it is "
            "strongly supported by the documented event."
        )
    )

    description: Optional[str] = Field(
        default=None,
        description=(
            "Clear description of what happened. Include the observed condition, "
            "the expected or approved condition when available, and how the "
            "actual condition deviated from it. Preserve important measurements, "
            "values, ranges, and durations from the source."
        )
    )

    affected_area: Optional[str] = Field(
        default=None,
        description=(
            "Process, department, equipment, system, or manufacturing area "
            "affected by the deviation."
        )
    )

    immediate_action: Optional[str] = Field(
        default=None,
        description=(
            "Immediate corrective, containment, or response action that was "
            "actually taken after the deviation was identified. Do not invent "
            "actions that are not described in the source."
        )
    )

    root_cause: Optional[str] = Field(
        default=None,
        description=(
            "Identified or suspected root cause of the deviation. Extract it "
            "only when the source provides sufficient information. Preserve "
            "uncertainty such as 'suspected', 'preliminary', or 'under investigation' "
            "and do not convert a suspected cause into a confirmed root cause."
        )
    )

    quality_impact: Optional[str] = Field(
        default=None,
        description=(
            "Potential or confirmed impact of the deviation on product quality, "
            "safety, efficacy, identity, strength, purity, or regulatory compliance. "
            "Clearly distinguish potential impact from confirmed impact."
        )
    )

    impact_summary: Optional[str] = Field(
        default=None,
        description=(
            "Brief summary of the overall quality impact of the deviation based "
            "on the documented facts. Include important mitigating information "
            "when available."
        )
    )

    severity: Optional[str] = Field(
        default=None,
        description=(
            "Initial AI-assessed severity of the deviation. This is an assessment "
            "based on the documented facts and potential quality impact, not a value "
            "that must be explicitly stated in the source document. Consider the "
            "magnitude and duration of the deviation, potential quality impact, "
            "and documented mitigating factors. Return null if there is insufficient "
            "information to make a meaningful assessment."
        )
    )

    severity_reason: Optional[str] = Field(
        default=None,
        description=(
            "Concise factual justification for the AI severity assessment. Explain "
            "the relevant deviation magnitude, duration, potential quality impact, "
            "and mitigating factors documented in the source. Do not merely repeat "
            "the suspected root cause."
        )
    )