from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from ..database import Base
from datetime import datetime

class Documento(Base):
    __tablename__ = "documentos"
    id = Column(Integer, primary_key=True, autoincrement=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)
    nombre_archivo = Column(String(255), nullable=True)
    ruta_archivo = Column(String(255), nullable=True)
    tipo = Column(String(50), nullable=True)
    fecha_subida = Column(TIMESTAMP, default=datetime.now)

    cliente = relationship("Cliente", back_populates="documentos")
