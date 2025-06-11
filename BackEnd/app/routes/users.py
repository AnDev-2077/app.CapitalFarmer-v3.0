from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import SessionLocal
from ..models.user import Usuario, Rol
from ..schemas.user import UsuarioOut
from ..schemas.createuser import UsuarioCreate
from ..schemas.roleout import RolOut
from ..schemas.updateuser import UsuarioUpdate

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
    usuarios = db.query(Usuario).options(joinedload(Usuario.rol)).filter(Usuario.is_active == True).all()
    usuarios_out = []
    for usuario in usuarios:
        usuarios_out.append(UsuarioOut(
            id=usuario.id,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            telefono=usuario.telefono,
            correo=usuario.correo,
            rol_id=usuario.rol_id,
            rol_nombre=usuario.rol.nombre if usuario.rol else ""
        ))
    return usuarios_out

@router.put("/usuarios/{user_id}", response_model=UsuarioOut)
def actualizar_usuario(user_id: int, usuario_update: UsuarioUpdate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id, Usuario.is_active == True).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.nombre = usuario_update.nombre
    usuario.apellido = usuario_update.apellido
    usuario.correo = usuario_update.correo
    usuario.telefono = usuario_update.telefono
    usuario.rol_id = usuario_update.rol_id 
    db.commit()
    db.refresh(usuario)
    return UsuarioOut(
        id=usuario.id,
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        telefono=usuario.telefono,
        correo=usuario.correo,
        rol_id=usuario.rol_id,
        rol_nombre=usuario.rol.nombre if usuario.rol else ""
    )

@router.delete("/usuarios/{user_id}", response_model=UsuarioOut)
def desactivar_usuario(user_id: int, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    usuario.is_active = False
    db.commit()
    db.refresh(usuario)
    return usuario

@router.get("/roles", response_model=list[RolOut])
def listar_roles(db: Session = Depends(get_db)):
    return db.query(Rol).all()