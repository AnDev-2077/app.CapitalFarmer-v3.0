from pydantic import BaseModel
from typing import List, Optional
from .cotizacion import CotizacionCreate
from .cuotasinid import CuotaSinId

class CotizacionConCuotasCreate(BaseModel):
    cotizacion: CotizacionCreate
    cuotas: Optional[List[CuotaSinId]] = None