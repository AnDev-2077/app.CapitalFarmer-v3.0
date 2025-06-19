from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, TIMESTAMP, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Rol(Base):
    __tablename__ = "roles"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False, unique=True)
    usuarios = relationship("Usuario", back_populates="rol")

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    telefono = Column(String(20))
    correo = Column(String(100), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    fecha_registro = Column(TIMESTAMP, default=datetime.now())
    rol_id = Column(BigInteger, ForeignKey("roles.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    rol = relationship("Rol", back_populates="usuarios")
    cotizaciones = relationship('Cotizacion', secondary='usuario_cotizacion', back_populates='usuarios')