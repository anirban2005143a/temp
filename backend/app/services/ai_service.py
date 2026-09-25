from __future__ import annotations

import json
import re
from datetime import datetime
from typing import Any

from app.config import settings


def _pick_value(mapping: dict[str, Any], *keys: str, default: Any = None) -> Any:
    for key in keys:
        if key in mapping and mapping.get(key) not in (None, ""):
            return mapping.get(key)
    return default


def _safe_parse_json(raw: str) -> dict[str, Any]:
    cleaned = raw.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", cleaned, flags=re.IGNORECASE | re.MULTILINE)
    try:
        parsed = json.loads(cleaned)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, flags=re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        return {}


def _heuristic_extract(text: str) -> dict[str, Any]:
    text_lower = text.lower()
    product_name = _pick_value({"product_name": re.search(r"product(?: name)?\s*[:\-]?\s*([A-Za-z0-9 /-]+)", text, flags=re.IGNORECASE)}, "product_name")
    product_name = product_name.group(1).strip() if product_name else None

    batch_match = re.search(r"batch(?:\s+no\.?|\s+number)?\s*[:\-]?\s*([A-Za-z0-9\-]+)", text, flags=re.IGNORECASE)
    lot_match = re.search(r"lot(?:\s+no\.?|\s+number)?\s*[:\-]?\s*([A-Za-z0-9\-]+)", text, flags=re.IGNORECASE)
    site_match = re.search(r"site\s*[:\-]?\s*([A-Za-z0-9 .\-/]+)", text, flags=re.IGNORECASE)
    title_match = re.search(r"deviation\s+(?:title|summary|description)?\s*[:\-]?\s*([A-Za-z0-9 .\-/]+)", text, flags=re.IGNORECASE)

    deviation_title = title_match.group(1).strip() if title_match else "Deviation investigation"
    product_name = product_name or "Product not specified"

    description = text[:800] if text else "No description provided"
    impact_summary = "Potential impact to product quality and regulatory compliance requires assessment."

    return {
        "deviation_id": f"DEV-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
        "product_name": product_name,
        "batch_number": batch_match.group(1).strip() if batch_match else None,
        "lot_number": lot_match.group(1).strip() if lot_match else None,
        "site": site_match.group(1).strip() if site_match else "Primary manufacturing site",
        "deviation_title": deviation_title,
        "deviation_type": "Process deviation" if "process" in text_lower else "Quality deviation",
        "description": description,
        "affected_area": "Manufacturing area" if "manufacturing" in text_lower else "Quality operations",
        "associated_material": "Not specified",
        "impact_summary": impact_summary,
        "severity": "Moderate",
        "severity_reason": "The deviation contains a product or process quality concern that requires formal investigation and containment review.",
        "root_cause": "To be confirmed during investigation.",
        "immediate_action": "Containment, assessment, and quality investigation are required.",
        "owner": "QA / Manufacturing",
        "quality_impact": "Potential product quality impact",
        "reported_by": "AI-assisted intake",
        "reporting_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "investigation_status": "Open",
    }


def _llm_extract(text: str) -> dict[str, Any]:
    if not settings.huggingface_api_token:
        return {}

    try:
        from langchain_huggingface import HuggingFaceEndpoint

        llm = HuggingFaceEndpoint(
            model=settings.model_name,
            huggingfacehub_api_token=settings.huggingface_api_token,
            temperature=0.1,
            max_new_tokens=700,
        )

        prompt = f"""
        Extract the deviation information from the pharmaceutical manufacturing deviation text below.
        Return ONLY a valid JSON object with these exact keys:
        - deviation_id
        - product_name
        - batch_number
        - lot_number
        - site
        - deviation_title
        - deviation_type
        - description
        - affected_area
        - associated_material
        - impact_summary
        - severity
        - severity_reason
        - root_cause
        - immediate_action
        - owner
        - quality_impact
        - reported_by
        - reporting_date
        - investigation_status

        Use concise values. If information is unavailable, use null or a reasonable default.

        DEVIATION TEXT:
        {text[:12000]}
        """
        response = llm.invoke(prompt)
        parsed = _safe_parse_json(str(response))
        if parsed:
            return parsed
    except Exception as exc:
        print(f"LLM extraction failed: {exc}")

    return {}


def extract_deviation_data(text: str) -> dict[str, Any]:
    if not text or not text.strip():
        raise ValueError("Deviation text is required for extraction.")

    parsed = _llm_extract(text)
    if parsed:
        merged = _heuristic_extract(text)
        for key, value in parsed.items():
            if value not in (None, ""):
                merged[key] = value
        if "deviation_id" not in parsed or not parsed.get("deviation_id"):
            merged["deviation_id"] = f"DEV-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        return merged

    return _heuristic_extract(text)


def assess_impact(extracted_data: dict[str, Any]) -> dict[str, Any]:
    severity_key = (extracted_data.get("severity") or "Moderate").lower()
    risk_signals = [
        "patient safety",
        "batch release",
        "market action",
        "critical",
        "sterility",
        "contamination",
        "recall",
    ]
    description = (extracted_data.get("description") or "").lower()
    impact = (extracted_data.get("impact_summary") or "").lower()

    if any(term in description or term in impact for term in risk_signals):
        severity = "Critical"
        score = 5
        reason = "The deviation indicates a direct quality or patient-safety risk with a likely impact to batch disposition or compliance obligations."
    elif severity_key in {"critical", "high"} or "sterility" in description or "contamination" in description:
        severity = "Major"
        score = 4
        reason = "The issue appears to carry significant product quality impact and should trigger immediate investigation and containment."
    elif severity_key in {"major", "high"} or "investigation" in description:
        severity = "Moderate"
        score = 3
        reason = "The deviation is quality-relevant and warrants structured investigation, but the current information does not suggest immediate patient harm."
    else:
        severity = "Minor"
        score = 2
        reason = "The issue is documentation or process-level in nature with limited product impact based on the available information."

    recommendations = [
        "Initiate containment and quality impact assessment.",
        "Document the deviation with supporting evidence and dates.",
        "Escalate to QA leadership for investigation planning."
    ]

    if severity in {"Critical", "Major"}:
        recommendations.insert(0, "Perform immediate batch disposition evaluation and escalate to quality leadership.")

    return {
        "severity": severity,
        "risk_level": "High" if severity in {"Critical", "Major"} else "Moderate" if severity == "Moderate" else "Low",
        "score": score,
        "reason": reason,
        "recommendations": recommendations,
    }
