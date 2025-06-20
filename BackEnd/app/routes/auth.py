from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.user import Usuario
from ..schemas.user import UsuarioOut
from ..schemas.createuser import UsuarioCreate
from pydantic import BaseModel

from ..utils.jwt import crear_token
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..utils.jwt import verificar_token


router = APIRouter()

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioOut


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

@router.post("/registro", response_model=UsuarioOut)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    nuevo_usuario = Usuario(**usuario.dict())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return UsuarioOut(
        id=nuevo_usuario.id,
        nombre=nuevo_usuario.nombre,
        apellido=nuevo_usuario.apellido,
        telefono=nuevo_usuario.telefono,
        correo=nuevo_usuario.correo,
        rol_id=nuevo_usuario.rol_id,
        rol_nombre=nuevo_usuario.rol.nombre if nuevo_usuario.rol else ""
    )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == request.correo).first()
    if not usuario or usuario.contrasena != request.contrasena:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    # Generar token
    token = crear_token({"sub": usuario.correo})
    return TokenResponse(
        access_token=token,
        usuario=UsuarioOut(
            id=usuario.id,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            telefono=usuario.telefono,
            correo=usuario.correo,
            rol_id=usuario.rol_id,
            rol_nombre=usuario.rol.nombre if usuario.rol else ""
        )
    )