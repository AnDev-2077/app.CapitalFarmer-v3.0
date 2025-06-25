from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth
from .routes import users
from .routes import cuotas
from .database import Base, engine

from fastapi.middleware.cors import CORSMiddleware


# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Server ready"}

# Registrar rutas
app.include_router(auth.router, prefix="/capitalfarmer.co/api/v1")
app.include_router(users.router, prefix="/capitalfarmer.co/api/v1")
app.include_router(cuotas.router, prefix="/capitalfarmer.co/api/v1")