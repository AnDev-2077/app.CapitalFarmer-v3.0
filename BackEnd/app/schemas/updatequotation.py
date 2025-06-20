from pydantic import BaseModel
from typing import Optional
from datetime import date

class CotizacionUpdate(BaseModel):
    codigo_cotizacion: Optional[str] = None
    nombre_cliente: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    servicio: Optional[str] = None
    precio: Optional[float] = None
    comentarios: Optional[str] = None
    detalle_servicio: Optional[str] = None
    exclusiones: Optional[str] = None