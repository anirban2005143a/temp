from datetime import date, datetime

from sqlalchemy import Date, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class DeviationRecord(Base):
    __tablename__ = "deviation_records"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    site: Mapped[str | None] = mapped_column(String(255), nullable=True)
    occurrence_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    deviation_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source: Mapped[str | None] = mapped_column(String(255), nullable=True)
    related_product_material: Mapped[str | None] = mapped_column(String(255), nullable=True)
    batch_lot_number: Mapped[str | None] = mapped_column(String(120), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    severity: Mapped[str | None] = mapped_column(String(20), nullable=True)
    risk_assessment: Mapped[str | None] = mapped_column(Text, nullable=True)
    suggested_next_step: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "site": self.site,
            "occurrence_date": self.occurrence_date,
            "deviation_title": self.deviation_title,
            "source": self.source,
            "related_product_material": self.related_product_material,
            "batch_lot_number": self.batch_lot_number,
            "description": self.description,
            "severity": self.severity,
            "risk_assessment": self.risk_assessment,
            "suggested_next_step": self.suggested_next_step,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
