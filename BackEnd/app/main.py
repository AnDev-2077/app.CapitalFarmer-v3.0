from fastapi import FastAPI
from .routes import auth
from .database import Base, engine

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Registrar rutas
app.include_router(auth.router, prefix="/auth")