from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    id: int | None = None
    nombre: str
    apellido: str
    correo: str
    telefono: str | None
    rol_id: int
    contrasena: str