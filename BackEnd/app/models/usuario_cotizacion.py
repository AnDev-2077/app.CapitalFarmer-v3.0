from sqlalchemy import Table, Column, Integer, ForeignKey
from ..database import Base

usuario_cotizacion = Table(
    "usuario_cotizacion",
    Base.metadata,
    Column("usuario_id", Integer, ForeignKey("usuarios.id"), primary_key=True),
    Column("cotizacion_id", Integer, ForeignKey("cotizaciones.id"), primary_key=True)
)
