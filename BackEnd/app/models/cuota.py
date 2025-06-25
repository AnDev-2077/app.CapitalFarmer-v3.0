from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DECIMAL, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Cuota(Base):
    __tablename__ = "cuotas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    cotizacion_id = Column(Integer, ForeignKey("cotizaciones.id"), nullable=False)
    nombre_cuota = Column(String(50), nullable=True)
    porcentaje = Column(DECIMAL(5,2), nullable=True)
    monto = Column(DECIMAL(10,2), nullable=True)
    fecha_vencimiento = Column(Date, nullable=True)
    estado_pago = Column(String(20), nullable=False, default='Pendiente')
    fecha_creacion = Column(TIMESTAMP, default=datetime.now)

    cotizacion = relationship("Cotizacion", back_populates="cuotas")
