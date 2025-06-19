"use client"

import type React from "react"

import { useState } from "react"
import { CalendarIcon, FileText, User, DollarSign, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CotizacionData {
  cliente: {
    nombre: string
    empresa: string
    email: string
    telefono: string
  }
  fechaVencimiento: Date | undefined
  servicio: string
  precio: string
  honorarios: string
  comentarios: string
  queHaremos: string
  queNoIncluye: string
}

const servicios = [
  "Consultoría Legal",
  "Asesoría Fiscal",
  "Auditoría Contable",
  "Gestión de Nóminas",
  "Constitución de Empresas",
  "Registro de Marcas",
  "Contratos Comerciales",
  "Otros",
]

export default function CotizacionPanel({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [cotizacion, setCotizacion] = useState<CotizacionData>({
    cliente: {
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
    },
    fechaVencimiento: undefined,
    servicio: "",
    precio: "",
    honorarios: "",
    comentarios: "",
    queHaremos: "",
    queNoIncluye: "",
  })
  const [vencimientoTipo, setVencimientoTipo] = useState<string>(""); // "3", "7", "15", "otro"
  const [servicioPersonalizado, setServicioPersonalizado] = useState("");
  const [servicioSelect, setServicioSelect] = useState<string>("");

  const handleClienteChange = (field: keyof CotizacionData["cliente"], value: string) => {
    setCotizacion((prev) => ({
      ...prev,
      cliente: {
        ...prev.cliente,
        [field]: value,
      },
    }))
  }

  const handleFieldChange = (field: keyof Omit<CotizacionData, "cliente">, value: string | Date | undefined) => {
    setCotizacion((prev) => ({
      ...prev,
      [field]: value,
    }))
    simularGuardado()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const precio = parseFloat(cotizacion.precio) || 0;
    const honorarios = parseFloat(cotizacion.honorarios) || 0;
    const precio_total = precio + honorarios;
    const payload = {
      nombre_cliente: cotizacion.cliente.nombre,
      email: cotizacion.cliente.email,
      telefono: cotizacion.cliente.telefono,
      fecha_vencimiento: cotizacion.fechaVencimiento
        ? cotizacion.fechaVencimiento.toISOString().split('T')[0]
        : null,
      servicio: cotizacion.servicio,
      precio: precio,
      precio_honorarios: honorarios,
      precio_total: precio_total,
      comentarios: cotizacion.comentarios,
      detalle_servicio: cotizacion.queHaremos,
      exclusiones: cotizacion.queNoIncluye,
    };
    try {
      await axios.post("http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones", payload);
      // Puedes mostrar un mensaje de éxito aquí si quieres
      if (onClose) onClose();
      else navigate("/home/quotes");
    } catch (err) {
      // Puedes mostrar un mensaje de error aquí si quieres
      alert("Error al guardar la cotización");
    }
  }

  const simularGuardado = async () => {
    setGuardando(true)
    // Simular delay de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUltimoGuardado(new Date())
    setGuardando(false)
  }

  const handleSalir = () => {
    if (confirm("¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.")) {
      if (onClose) onClose();
      else navigate("/home/quotes");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Cotizaciones</h1>
          <p className="text-gray-600 mt-2">Crea y gestiona cotizaciones para tus clientes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Formulario de Cotización
              </CardTitle>
              <CardDescription>Completa los datos para generar una nueva cotización</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos del Cliente */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4" />
                    <h3 className="text-lg font-semibold">Datos del Cliente</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                     <Input
                        id="nombre"
                        placeholder="Juan Pérez"
                        value={cotizacion.cliente.nombre}
                        onChange={(e) => handleClienteChange("nombre", e.target.value)}
                      />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="juan@empresa.com"
                        value={cotizacion.cliente.email}
                        onChange={(e) => handleClienteChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        placeholder="+51 900 000 000"
                        value={cotizacion.cliente.telefono}
                        onChange={(e) => handleClienteChange("telefono", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />
                {/* Detalles de la Cotización */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Vencimiento</Label>
                      <Select
                        value={vencimientoTipo}
                        onValueChange={(value) => {
                          setVencimientoTipo(value);
                          if (value === "otro") {
                            handleFieldChange("fechaVencimiento", undefined);
                          } else {
                            const dias = parseInt(value, 10);
                            const nuevaFecha = addDays(new Date(), dias);
                            handleFieldChange("fechaVencimiento", nuevaFecha);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar plazo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 días</SelectItem>
                          <SelectItem value="7">7 días</SelectItem>
                          <SelectItem value="15">15 días</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      {vencimientoTipo === "otro" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !cotizacion.fechaVencimiento && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {cotizacion.fechaVencimiento ? (
                                format(cotizacion.fechaVencimiento, "PPP", { locale: es })
                              ) : (
                                <span>Seleccionar fecha</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={cotizacion.fechaVencimiento}
                              onSelect={(date) => handleFieldChange("fechaVencimiento", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servicio">Servicio</Label>
                      <Select
                        value={servicioSelect}
                        onValueChange={(value) => {
                          setServicioSelect(value);
                          if (value !== "Otros") {
                            handleFieldChange("servicio", value);
                            setServicioPersonalizado("");
                          } else {
                            handleFieldChange("servicio", "");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          {servicios.map((servicio) => (
                            <SelectItem key={servicio} value={servicio}>
                              {servicio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {servicioSelect === "Otros" && (
                        <Input
                          className="mt-2"
                          placeholder="Especifica el servicio"
                          value={servicioPersonalizado}
                          onChange={e => {
                            setServicioPersonalizado(e.target.value);
                            handleFieldChange("servicio", e.target.value);
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="honorarios" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Precio del servicio
                      </Label>
                      <Input
                        id="precio"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="S/ 1,500.00"
                        value={cotizacion.precio}
                        onChange={(e) => handleFieldChange("precio", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="honorarios" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Precio de Honorarios
                      </Label>
                      <Input
                        id="honorarios"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="S/ 1,500.00"
                        value={cotizacion.honorarios}
                        onChange={(e) => handleFieldChange("honorarios", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comentarios" className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comentarios
                    </Label>
                    <Textarea
                      id="comentarios"
                      placeholder="Comentarios adicionales sobre la cotización..."
                      rows={3}
                      value={cotizacion.comentarios}
                      onChange={(e) => handleFieldChange("comentarios", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queHaremos" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      ¿Qué haremos por usted?
                    </Label>
                    <Textarea
                      id="queHaremos"
                      placeholder="Describe los servicios y beneficios que se incluyen..."
                      rows={4}
                      value={cotizacion.queHaremos}
                      onChange={(e) => handleFieldChange("queHaremos", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queNoIncluye" className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      ¿Qué no incluye la cotización?
                    </Label>
                    <Textarea
                      id="queNoIncluye"
                      placeholder="Especifica las limitaciones y exclusiones..."
                      rows={4}
                      value={cotizacion.queNoIncluye}
                      onChange={(e) => handleFieldChange("queNoIncluye", e.target.value)}
                    />
                  </div>
                </div>

                {/* Barra inferior fija */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Button
                      variant="ghost"
                      onClick={handleSalir}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Salir
                    </Button>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        {guardando ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Guardando...
                          </span>
                        ) : ultimoGuardado ? (
                          `Guardado por última vez ${format(ultimoGuardado, "dd 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}`
                        ) : (
                          "Sin guardar"
                        )}
                      </div>
                      <Button type="submit" disabled={guardando} className="bg-blue-600 hover:bg-blue-700">
                        {guardando ? "Guardando..." : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Previsualización */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Previsualización de la Cotización</CardTitle>
              <CardDescription>Vista previa del documento PDF que se generará</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white border rounded-lg p-6 shadow-sm min-h-[600px]">
                {/* Header del PDF */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">COTIZACIÓN</h2>
                  <p className="text-gray-600">Cod.</p>
                </div>

                {/* Información del Cliente */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Datos del Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Nombre:</strong> {cotizacion.cliente.nombre || "Por completar"}
                    </p>
                    <p>
                      <strong>Email:</strong> {cotizacion.cliente.email || "Por completar"}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {cotizacion.cliente.telefono || "Por completar"}
                    </p>
                  </div>
                </div>

                {/* Detalles de la Cotización */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Detalles de la Cotización</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        <strong>Servicio:</strong>
                      </span>
                      <span>{cotizacion.servicio || "Por seleccionar"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <strong>Fecha de Emision:</strong>
                      </span>
                      <span>
                        {format(new Date(), "dd/MM/yyyy", { locale: es })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <strong>Fecha de Vencimiento:</strong>
                      </span>
                      <span>
                        {cotizacion.fechaVencimiento
                          ? format(cotizacion.fechaVencimiento, "dd/MM/yyyy", { locale: es })
                          : "Por seleccionar"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <strong>Precio:</strong>
                      </span>
                      <span>S/ {cotizacion.precio || "Por completar"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <strong>Honorarios:</strong>
                      </span>
                      <span>S/ {cotizacion.honorarios || "Por completar"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        <strong>Precio Total:</strong>
                      </span>
                      <span>S/
                        {cotizacion.precio && cotizacion.honorarios
                        ? (parseFloat(cotizacion.precio) + parseFloat(cotizacion.honorarios)).toFixed(2)
                        : "Autogenerado"}
                      </span>
                    </div>
                  </div>
                </div>

                {cotizacion.comentarios && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Comentarios</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{cotizacion.comentarios}</p>
                  </div>
                )}

                {cotizacion.queHaremos && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      ¿Qué haremos por usted?
                    </h3>
                    <p className="text-gray-700 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      {cotizacion.queHaremos}
                    </p>
                  </div>
                )}

                {cotizacion.queNoIncluye && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      ¿Qué no incluye la cotización?
                    </h3>
                    <p className="text-gray-700 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      {cotizacion.queNoIncluye}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                  <p>Esta cotización es válida hasta la fecha de vencimiento especificada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}