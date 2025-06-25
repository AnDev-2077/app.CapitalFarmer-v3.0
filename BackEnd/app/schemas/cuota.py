from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class CuotaBase(BaseModel):
    nombre_cuota: Optional[str] = None
    porcentaje: Optional[float] = None
    monto: Optional[float] = None
    fecha_vencimiento: Optional[date] = None
    estado_pago: Optional[str] = None

class CuotaCreate(CuotaBase):
    cotizacion_id: int

class CuotaOut(CuotaBase):
    id: int
    cotizacion_id: int
    fecha_creacion: Optional[datetime] = None

    class Config:
        from_attributes = True
