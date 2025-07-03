from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentoBase(BaseModel):
    cliente_id: Optional[int] = None
    nombre_archivo: Optional[str] = None
    ruta_archivo: Optional[str] = None
    tipo: Optional[str] = None
    fecha_subida: Optional[datetime] = None

class DocumentoCreate(DocumentoBase):
    pass

class DocumentoOut(DocumentoBase):
    id: int
    class Config:
        from_attributes = True
