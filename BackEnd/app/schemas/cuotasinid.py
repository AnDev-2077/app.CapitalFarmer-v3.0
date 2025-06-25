from pydantic import BaseModel
from typing import Optional
from datetime import date

class CuotaSinId(BaseModel):
    nombre_cuota: Optional[str] = None
    porcentaje: Optional[float] = None
    monto: Optional[float] = None
    fecha_vencimiento: Optional[date] = None
    estado_pago: Optional[str] = None