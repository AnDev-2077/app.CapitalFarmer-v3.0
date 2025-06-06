from pydantic import BaseModel

class UsuarioOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    telefono: str | None
    correo: str

    class Config:
        orm_mode = True