from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.user import Usuario
from ..schemas.user import UsuarioOut
from ..schemas.createuser import UsuarioCreate
from pydantic import BaseModel

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LoginRequest(BaseModel):
    correo: str
    contrasena: str

@router.get("/usuarios", response_model=list[UsuarioCreate])
def leer_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    nuevo_usuario = Usuario(**usuario.dict())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@router.post("/login", response_model=UsuarioOut)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == request.correo).first()
    if not usuario or usuario.contrasena != request.contrasena:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    return usuario