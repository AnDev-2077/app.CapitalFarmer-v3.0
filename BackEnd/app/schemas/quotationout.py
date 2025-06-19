from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class QuotationOut(BaseModel):
    id: int
    codigo_cotizacion: Optional[str]
    nombre_cliente: str
    email: Optional[str]
    telefono: Optional[str]
    fecha_vencimiento: Optional[date]
    servicio: Optional[str]
    precio: Optional[float]
    comentarios: Optional[str]
    detalle_servicio: Optional[str]
    exclusiones: Optional[str]
    estado: Optional[str]
    fecha_creacion: Optional[datetime]

    class Config:
        orm_mode = True