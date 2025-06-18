from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, Text, DECIMAL, TIMESTAMP
from sqlalchemy.sql import func
from ..database import Base

class Cotizacion(Base):
    __tablename__ = "cotizaciones"
    id = Column(Integer, primary_key=True, index=True)
    nombre_cliente = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    telefono = Column(String(20), nullable=True)
    fecha_vencimiento = Column(Date, nullable=True)
    servicio = Column(String(100), nullable=True)
    precio = Column(DECIMAL(10,2), nullable=True)
    precio_honorarios = Column(DECIMAL(10,2), nullable=True)
    precio_total = Column(DECIMAL(10,2), nullable=True)
    comentarios = Column(Text, nullable=True)
    detalle_servicio = Column(Text, nullable=True)
    exclusiones = Column(Text, nullable=True)
    estado = Column(String(50), nullable=False, default='Pendiente')
    fecha_creacion = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
