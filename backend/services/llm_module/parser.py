from typing import Optional, Literal
from pydantic import BaseModel, Field


class DeviationFormData(BaseModel):

    chat_response: str = Field(
        description=(
            "Very short status message confirming that the deviation form "
            "was created or updated. Do not include deviation details, "
            "field values, reasoning, severity, root cause, or impact."
        )
    )

    product_name: Optional[str] = Field(
        default=None,
        description=(
            "Pharmaceutical product associated with the deviation. "
            "Extract only when supported by the provided source. "
            "Never invent, guess, or infer the product name."
        )
    )

    batch_number: Optional[str] = Field(
        default=None,
        description=(
            "Batch number affected by the deviation. Preserve exactly as "
            "stated in the source. Never invent or modify the batch number."
        )
    )

    site: Optional[str] = Field(
        default=None,
        description=(
            "Manufacturing site or facility where the deviation occurred. "
            "Return null when not reliably supported by the source."
        )
    )

    deviation_title: Optional[str] = Field(
        default=None,
        description=(
            "Short factual title describing the documented deviation event. "
            "It may be generated from supported facts but must not introduce "
            "unsupported information."
        )
    )

    deviation_type: Optional[str] = Field(
        default=None,
        description=(
            "Deviation category such as process, equipment, material, "
            "documentation, or environmental deviation. Classification is "
            "allowed when strongly supported by the documented event. "
            "Do not invent facts while classifying the event."
        )
    )

    description: Optional[str] = Field(
        default=None,
        description=(
            "Concise factual description of the deviation, including the "
            "actual condition and expected condition when available. "
            "Preserve important measurements, ranges, dates, and durations. "
            "Do not add information that is not supported by the source."
        )
    )

    affected_area: Optional[str] = Field(
        default=None,
        description=(
            "Process, department, equipment, system, or manufacturing area "
            "affected by the deviation. Return null when not supported."
        )
    )

    immediate_action: Optional[str] = Field(
        default=None,
        description=(
            "Immediate action actually performed in response to the deviation. "
            "Do not include proposed, recommended, or planned actions. "
            "Do not invent actions."
        )
    )

    root_cause: Optional[str] = Field(
        default=None,
        description=(
            "Identified or suspected root cause when supported by the source. "
            "Preserve uncertainty such as suspected, preliminary, or under "
            "investigation. Never convert a suspected cause into a confirmed "
            "cause and never invent a root cause."
        )
    )

    # ============================================================
    # AI-ASSESSED IMPACT AND SEVERITY
    # ============================================================

    quality_impact: Optional[str] = Field(
        default=None,
        description=(
            "AI-generated assessment of the documented quality impact. "
            "The LLM may synthesize or assess the impact from facts explicitly "
            "supported by the provided source and current form state. "
            "It must NOT invent contamination, safety risk, efficacy loss, "
            "patient risk, regulatory impact, or other consequences without "
            "supporting evidence. Clearly distinguish confirmed impact, "
            "potential impact, no documented impact, and undetermined impact."
        )
    )

    impact_summary: Optional[str] = Field(
        default=None,
        description=(
            "AI-generated concise summary of the quality impact based only "
            "on documented facts and supported assessment. It may synthesize "
            "information but must not introduce unsupported risks, causes, "
            "or consequences."
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

    severity_reason: Optional[str] = Field(
        default=None,
        description=(
            "AI-generated concise factual justification for the assigned "
            "severity. It may synthesize the documented evidence into a "
            "reasoned assessment, but must not introduce unsupported risks "
            "or consequences. Must be null when severity is null."
        )
    )