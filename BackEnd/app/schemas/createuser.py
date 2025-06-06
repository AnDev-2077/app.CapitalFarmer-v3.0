from pydantic import BaseModel

class UsuarioCreate(BaseModel):
    nombre: str
    apellido: str
    telefono: str | None
    correo: str
    contrasena: str
    rol: str