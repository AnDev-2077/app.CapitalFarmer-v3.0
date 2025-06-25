from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import SessionLocal
from ..models.cotizacion import Cotizacion
from ..models.cuota import Cuota
from ..schemas.cuota import CuotaCreate, CuotaOut
from ..schemas.cotizacionconcuotas import CotizacionConCuotasCreate

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

@router.post("/cotizaciones-con-cuotas")
def crear_cotizacion_con_cuotas(data: CotizacionConCuotasCreate, db: Session = Depends(get_db)):
    cotizacion_data = data.cotizacion.dict()
    nueva_cotizacion = Cotizacion(**cotizacion_data)
    db.add(nueva_cotizacion)
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