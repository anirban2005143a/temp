from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database import Base


class DeviationRecord(Base):
    __tablename__ = "deviation_records"

    id = Column(Integer, primary_key=True, index=True)
    deviation_id = Column(String(120), unique=True, index=True, nullable=True)
    product_name = Column(String(200), nullable=True)
    batch_number = Column(String(120), nullable=True)
    lot_number = Column(String(120), nullable=True)
    site = Column(String(200), nullable=True)
    deviation_title = Column(String(250), nullable=True)
    deviation_type = Column(String(120), nullable=True)
    description = Column(Text, nullable=True)
    affected_area = Column(String(200), nullable=True)
    associated_material = Column(String(200), nullable=True)
    root_cause = Column(Text, nullable=True)
    immediate_action = Column(Text, nullable=True)
    severity = Column(String(50), nullable=True)
    severity_reason = Column(Text, nullable=True)
    quality_impact = Column(String(150), nullable=True)
    reporting_date = Column(String(50), nullable=True)
    reported_by = Column(String(150), nullable=True)
    owner = Column(String(150), nullable=True)
    investigation_status = Column(String(80), default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)
