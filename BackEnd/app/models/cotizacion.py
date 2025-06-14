from datetime import datetime
from sqlalchemy import Column, Integer, String, TIMESTAMP, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Cotizacion(Base):
    __tablename__ = "cotizaciones"
    id = Column(Integer, primary_key=True, index=True)
    nombre_cliente = Column(String(100), nullable=False)
    tipo_servicio = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_creacion = Column(TIMESTAMP, default=datetime.now())  # genera la fecha de forma automatica
    dias_validez = Column(Integer, nullable=False)
    servicios_adicionales = Column(Text, nullable=True)  
    estado = Column(String(50), nullable=False)
