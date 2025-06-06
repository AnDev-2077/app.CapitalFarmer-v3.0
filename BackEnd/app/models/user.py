from sqlalchemy import Column, Integer, String, TIMESTAMP
from ..database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    apellido = Column(String(50), nullable=False)
    telefono = Column(String(20))
    correo = Column(String(100), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    fecha_registro = Column(TIMESTAMP)