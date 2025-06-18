from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class QuotationOut(BaseModel):
    id: int
    nombre_cliente: str
    email: Optional[str]
    telefono: Optional[str]
    fecha_vencimiento: Optional[date]
    servicio: Optional[str]
    precio: Optional[float]
    precio_honorarios: Optional[float]
    precio_total: Optional[float]
    comentarios: Optional[str]
    detalle_servicio: Optional[str]
    exclusiones: Optional[str]
    estado: Optional[str]
    fecha_creacion: datetime

    class Config:
        orm_mode = True