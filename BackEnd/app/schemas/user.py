from pydantic import BaseModel

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    telefono: str | None
    correo: str
    rol_id: int
    rol_nombre: str  

    class Config:
        orm_mode = True