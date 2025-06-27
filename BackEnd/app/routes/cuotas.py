from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.cotizacion import Cotizacion
from ..models.cuota import Cuota
from ..schemas.cuota import CuotaCreate, CuotaOut
from ..schemas.cotizacionconcuotas import CotizacionConCuotasCreate
from ..schemas.quotationout import QuotationOut
from ..schemas.updatequotation import CotizacionUpdate
from datetime import datetime
from app.routes.auth import get_current_user
from app.models.user import Usuario
from typing import Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/cuotas", response_model=CuotaOut)
def crear_cuota(cuota: CuotaCreate, db: Session = Depends(get_db)):
    cotizacion = db.query(Cotizacion).filter(Cotizacion.id == cuota.cotizacion_id).first()
    if not cotizacion:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    nueva_cuota = Cuota(**cuota.dict())
    db.add(nueva_cuota)
    db.commit()
    db.refresh(nueva_cuota)
    return nueva_cuota

@router.get("/cuotas/{cuota_id}", response_model=CuotaOut)
def obtener_cuota(cuota_id: int, db: Session = Depends(get_db)):
    cuota = db.query(Cuota).filter(Cuota.id == cuota_id).first()
    if not cuota:
        raise HTTPException(status_code=404, detail="Cuota no encontrada")
    return cuota

@router.get("/cuotas", response_model=list[CuotaOut])
def listar_cuotas(db: Session = Depends(get_db)):
    return db.query(Cuota).all()

def generar_codigo_cotizacion(id_cotizacion: int, nombre_usuario: str, fecha: datetime = None) -> str:
    now = fecha or datetime.now()
    mes = now.month
    dia = now.day
    inicial = nombre_usuario[0].upper() if nombre_usuario else "X"
    return f"COT-{mes}{dia}{id_cotizacion}{inicial}FCT"

@router.post("/cotizaciones-con-cuotas")
def crear_cotizacion_con_cuotas(data: CotizacionConCuotasCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    usuario = db.query(Usuario).filter(Usuario.correo == current_user.get("sub")).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    cotizacion_data = data.cotizacion.dict()
    nueva_cotizacion = Cotizacion(**cotizacion_data)
    db.add(nueva_cotizacion)
    db.commit()
    db.refresh(nueva_cotizacion)

    codigo = generar_codigo_cotizacion(nueva_cotizacion.id, usuario.nombre)
    nueva_cotizacion.codigo_cotizacion = codigo
    db.commit()
    db.refresh(nueva_cotizacion)

    if data.cuotas:
        for cuota in data.cuotas:
            cuota_data = cuota.dict()
            cuota_data["cotizacion_id"] = nueva_cotizacion.id
            nueva_cuota = Cuota(**cuota_data)
            db.add(nueva_cuota)
        db.commit()
    return {"cotizacion_id": nueva_cotizacion.id}

@router.get("/cotizaciones/{cotizacion_id}/con-cuotas", response_model=QuotationOut)
def obtener_cotizacion_con_cuotas(
    cotizacion_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    cotizacion = db.query(Cotizacion).filter(Cotizacion.id == cotizacion_id).first()
    if not cotizacion:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    # Las cuotas ya están incluidas por la relación en el modelo y el esquema QuotationOut
    return cotizacion

@router.put("/cotizaciones/{cotizacion_id}/con-cuotas", response_model=QuotationOut)
def actualizar_cotizacion(
    cotizacion_id: int,
    data: dict,  # Espera un JSON con campos de cotizacion y opcionalmente 'cuotas'
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    usuario = db.query(Usuario).filter(Usuario.correo == current_user.get("sub")).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    cotizacion_update = data.get("cotizacion", {})
    cuotas_update = data.get("cuotas", None)
    cotizacion = db.query(Cotizacion).filter(Cotizacion.id == cotizacion_id).first()
    if not cotizacion:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    # Actualizar campos de la cotización
    for field, value in cotizacion_update.items():
        setattr(cotizacion, field, value)
    cotizacion.codigo_cotizacion = generar_codigo_cotizacion(
        cotizacion.id,
        usuario.nombre
    )
    db.commit()
    db.refresh(cotizacion)
    # Lógica avanzada para cuotas
    if cuotas_update is not None:
        cuotas_existentes = {c.id: c for c in db.query(Cuota).filter(Cuota.cotizacion_id == cotizacion_id).all()}
        ids_recibidos = set()
        for cuota in cuotas_update:
            cuota_id = cuota.get("id")
            if cuota_id and cuota_id in cuotas_existentes:
                # Actualizar cuota existente
                cuota_obj = cuotas_existentes[cuota_id]
                for field, value in cuota.items():
                    if field != "id":
                        setattr(cuota_obj, field, value)
                ids_recibidos.add(cuota_id)
            else:
                # Crear nueva cuota
                cuota_data = cuota.copy()
                cuota_data["cotizacion_id"] = cotizacion_id
                cuota_data.pop("id", None)
                nueva_cuota = Cuota(**cuota_data)
                db.add(nueva_cuota)
        # Eliminar cuotas que no están en la lista recibida
        for cuota_id, cuota_obj in cuotas_existentes.items():
            if cuota_id not in ids_recibidos:
                db.delete(cuota_obj)
        db.commit()
    return cotizacion