from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.user import Usuario
from ..schemas.user import UsuarioOut

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/usuarios", response_model=list[UsuarioOut])
def leer_usuarios(db: Session = Depends(get_db)):
    return db.query(Usuario).all()