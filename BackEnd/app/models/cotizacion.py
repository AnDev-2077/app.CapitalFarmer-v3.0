from sqlalchemy import Column, Integer, String, Date, Text
from sqlalchemy.orm import relationship
from ..database import Base

class Cotizacion(Base):
    __tablename__ = "cotizaciones"
    id = Column(Integer, primary_key=True, index=True)
    nombre_cliente = Column(String(100), nullable=False)
    tipo_servicio = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_creacion = Column(Date, nullable=False)
    dias_validez = Column(Integer, nullable=False)
    servicios_adicionales = Column(Text, nullable=True)  # Puede ser JSON o texto separado por comas
    estado = Column(String(50), nullable=False)
