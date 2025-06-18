from pydantic import BaseModel
from typing import Optional
from datetime import date

class CotizacionCreate(BaseModel):
    nombre_cliente: str
    email: Optional[str] = None
    telefono: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    servicio: Optional[str] = None
    precio: Optional[float] = None
    precio_honorarios: Optional[float] = None
    precio_total: Optional[float] = None
    comentarios: Optional[str] = None
    detalle_servicio: Optional[str] = None
    exclusiones: Optional[str] = None
    estado: Optional[str] = None
    # fecha_creacion se genera automáticamente
