from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, Text, DECIMAL, TIMESTAMP, ForeignKey, BigInteger, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

usuario_cotizacion = Table(
    'usuario_cotizacion', Base.metadata,
    Column('usuario_id', Integer, ForeignKey('usuarios.id'), primary_key=True),
    Column('cotizacion_id', Integer, ForeignKey('cotizaciones.id'), primary_key=True)
)

class Cotizacion(Base):
    __tablename__ = "cotizaciones"
    id = Column(Integer, primary_key=True, index=True)
    codigo_cotizacion = Column(String(50), nullable=True)
    nombre_cliente = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    telefono = Column(String(20), nullable=True)
    fecha_vencimiento = Column(Date, nullable=True)
    servicio = Column(String(100), nullable=True)
    precio = Column(DECIMAL(10,2), nullable=True)
    comentarios = Column(Text, nullable=True)
    detalle_servicio = Column(Text, nullable=True)
    exclusiones = Column(Text, nullable=True)
    estado = Column(String(50), nullable=False, default='Pendiente')
    fecha_creacion = Column(TIMESTAMP, nullable=True, server_default=func.current_timestamp())
    usuarios = relationship('Usuario', secondary=usuario_cotizacion, back_populates='cotizaciones')
