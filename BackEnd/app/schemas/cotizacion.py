from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class CotizacionCreate(BaseModel):
    nombre_cliente: str
    tipo_servicio: str
    descripcion: Optional[str] = None
    fecha_creacion: date
    dias_validez: int
    servicios_adicionales: Optional[List[str]] = None
    estado: str
