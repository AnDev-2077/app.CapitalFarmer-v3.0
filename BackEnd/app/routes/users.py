from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import SessionLocal
from ..models.user import Usuario, Rol
from ..schemas.user import UsuarioOut
from ..schemas.createuser import UsuarioCreate
from ..schemas.roleout import RolOut
from ..schemas.updateuser import UsuarioUpdate
from ..schemas.cotizacion import CotizacionCreate
from ..models.cotizacion import Cotizacion
from ..schemas.quotationout import QuotationOut
from ..schemas.updatequotation import CotizacionUpdate
from ..routes.auth import get_current_user
from ..schemas.cotizacionconcuotas import CotizacionConCuotasCreate
from ..models.cliente import Cliente
from ..schemas.cliente import ClienteCreate, ClienteOut

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/usuarios", response_model=list[UsuarioOut])
def leer_usuarios(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
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
def desactivar_usuario(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
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

@router.post("/cotizaciones", response_model=CotizacionCreate)
def crear_cotizacion(cotizacion: CotizacionCreate, db: Session = Depends(get_db)):
    data = cotizacion.dict()
    nueva_cotizacion = Cotizacion(**data)
    db.add(nueva_cotizacion)
    db.commit()
    db.refresh(nueva_cotizacion)
    response = CotizacionCreate(
        codigo_cotizacion=nueva_cotizacion.codigo_cotizacion,
        nombre_cliente=nueva_cotizacion.nombre_cliente,
        email=nueva_cotizacion.email,
        telefono=nueva_cotizacion.telefono,
        fecha_vencimiento=nueva_cotizacion.fecha_vencimiento,
        servicio=nueva_cotizacion.servicio,
        precio=float(nueva_cotizacion.precio) if nueva_cotizacion.precio is not None else None,
        comentarios=nueva_cotizacion.comentarios,
        detalle_servicio=nueva_cotizacion.detalle_servicio,
        exclusiones=nueva_cotizacion.exclusiones,
        estado=nueva_cotizacion.estado
    )
    return response

@router.get("/cotizaciones", response_model=list[QuotationOut])
def leer_cotizaciones(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    cotizaciones = db.query(Cotizacion).all()
    cotizaciones_out = []
    for cotizacion in cotizaciones:
        cotizaciones_out.append(QuotationOut(
            id=cotizacion.id,
            codigo_cotizacion=cotizacion.codigo_cotizacion,
            nombre_cliente=cotizacion.nombre_cliente,
            email=cotizacion.email,
            telefono=cotizacion.telefono,
            fecha_vencimiento=cotizacion.fecha_vencimiento,
            servicio=cotizacion.servicio,
            precio=float(cotizacion.precio) if cotizacion.precio is not None else None,
            comentarios=cotizacion.comentarios,
            detalle_servicio=cotizacion.detalle_servicio,
            exclusiones=cotizacion.exclusiones,
            estado=cotizacion.estado,
            fecha_creacion=cotizacion.fecha_creacion
        ))
    return cotizaciones_out

#/cotizaciones/{cotizacion_id} ruta solo para prueba - 
#reemplasar cunado se implemeten funciones de (contexto de reload - o la ruta para consultar con cuotas)

@router.get("/cotizaciones/{cotizacion_id}", response_model=QuotationOut)
def obtener_cotizacion_por_id(cotizacion_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    cotizacion = db.query(Cotizacion).filter(Cotizacion.id == cotizacion_id).first()
    if not cotizacion:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    return QuotationOut(
        id=cotizacion.id,
        codigo_cotizacion=cotizacion.codigo_cotizacion,
        nombre_cliente=cotizacion.nombre_cliente,
        email=cotizacion.email,
        telefono=cotizacion.telefono,
        fecha_vencimiento=cotizacion.fecha_vencimiento,
        servicio=cotizacion.servicio,
        precio=float(cotizacion.precio) if cotizacion.precio is not None else None,
        comentarios=cotizacion.comentarios,
        detalle_servicio=cotizacion.detalle_servicio,
        exclusiones=cotizacion.exclusiones,
        estado=cotizacion.estado,
        fecha_creacion=cotizacion.fecha_creacion
    )

@router.put("/cotizaciones/{cotizacion_id}", response_model=QuotationOut)
def actualizar_cotizacion(
    cotizacion_id: int,
    cotizacion_update: CotizacionUpdate,
    db: Session = Depends(get_db)
):
    cotizacion = db.query(Cotizacion).filter(Cotizacion.id == cotizacion_id).first()
    if not cotizacion:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    for field, value in cotizacion_update.dict(exclude_unset=True).items():
        setattr(cotizacion, field, value)
    db.commit()
    db.refresh(cotizacion)
    return QuotationOut(
        id=cotizacion.id,
        codigo_cotizacion=cotizacion.codigo_cotizacion,
        nombre_cliente=cotizacion.nombre_cliente,
        email=cotizacion.email,
        telefono=cotizacion.telefono,
        fecha_vencimiento=cotizacion.fecha_vencimiento,
        servicio=cotizacion.servicio,
        precio=float(cotizacion.precio) if cotizacion.precio is not None else None,
        comentarios=cotizacion.comentarios,
        detalle_servicio=cotizacion.detalle_servicio,
        exclusiones=cotizacion.exclusiones,
        estado=cotizacion.estado,
        fecha_creacion=cotizacion.fecha_creacion
    )

@router.get("/usuarios/me", response_model=UsuarioOut)
def leer_usuario_actual(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.correo == current_user.get("sub")).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return UsuarioOut(
        id=usuario.id,
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        telefono=usuario.telefono,
        correo=usuario.correo,
        rol_id=usuario.rol_id,
        rol_nombre=usuario.rol.nombre if usuario.rol else ""
    )

@router.post("/clientes", response_model=ClienteOut)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    nuevo_cliente = Cliente(**cliente.dict())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

@router.get("/clientes", response_model=list[ClienteOut])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Cliente).all()

@router.get("/clientes/{cliente_id}", response_model=ClienteOut)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.put("/clientes/{cliente_id}", response_model=ClienteOut)
def actualizar_cliente(cliente_id: int, cliente_update: ClienteCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for field, value in cliente_update.dict(exclude_unset=True).items():
        setattr(cliente, field, value)
    db.commit()
    db.refresh(cliente)
    return cliente

@router.delete("/clientes/{cliente_id}", response_model=ClienteOut)
def eliminar_cliente(cliente_id: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
    return cliente
