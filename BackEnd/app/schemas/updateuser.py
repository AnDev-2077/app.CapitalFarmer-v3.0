from pydantic import BaseModel
from typing import Optional

class UsuarioUpdate(BaseModel):
    nombre: str
    apellido: str
    correo: str
    telefono: Optional[str] = None
    rol_id: int
    # No incluye contraseña
