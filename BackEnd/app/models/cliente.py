from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from ..database import Base
from .documento import Documento

class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100))
    apellido = Column(String(100))
    identificacion = Column(String(20))
    direccion = Column(Text)
    telefono = Column(String(15))
    correo = Column(String(100))
    nikname = Column(String(255))
    cotizaciones = relationship("Cotizacion", back_populates="cliente")
    documentos = relationship("Documento", back_populates="cliente")
