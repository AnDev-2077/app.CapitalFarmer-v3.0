"use client"

import { useState } from "react"
import {
  CalendarIcon,
  FileText,
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  Search,
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Cliente {
  id: string
  nombre: string
  empresa: string
  email: string
  telefono: string
}

interface CotizacionData {
  clienteId: string | null
  cliente: Cliente
  fechaVencimiento: Date | undefined
  servicio: string
  honorarios: string
  comentarios: string
  queHaremos: string
  queNoIncluye: string
}

const clientesExistentes: Cliente[] = [
  {
    id: "1",
    nombre: "Juan Pérez",
    empresa: "Funeraria San José",
    email: "juan@funerariasanjose.com",
    telefono: "+34 600 123 456",
  },
  {
    id: "2",
    nombre: "María García",
    empresa: "Constructora García",
    email: "maria@constructoragarcia.com",
    telefono: "+34 600 789 012",
  },
  {
    id: "3",
    nombre: "Carlos López",
    empresa: "Restaurante El Buen Sabor",
    email: "carlos@elbuensabor.com",
    telefono: "+34 600 345 678",
  },
]

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

const steps = [
  { id: 1, title: "Seleccionar Cliente", description: "Elige un cliente existente o crea uno nuevo" },
  { id: 2, title: "Verificar Datos", description: "Revisa y confirma los datos del cliente" },
  { id: 3, title: "Detalles de Cotización", description: "Precio, fecha y servicio" },
  { id: 4, title: "Información Adicional", description: "Comentarios y detalles finales" },
]

export default function CotizacionStepper() {
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null)
  const [guardando, setGuardando] = useState(false)

  const [cotizacion, setCotizacion] = useState<CotizacionData>({
    clienteId: null,
    cliente: {
      id: "",
      nombre: "",
      empresa: "",
      email: "",
      telefono: "",
    },
    fechaVencimiento: undefined,
    servicio: "",
    honorarios: "",
    comentarios: "",
    queHaremos: "",
    queNoIncluye: "",
  })

  const filteredClientes = clientesExistentes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleClienteSelect = (cliente: Cliente) => {
    setCotizacion((prev) => ({
      ...prev,
      clienteId: cliente.id,
      cliente: cliente,
    }))
    setCurrentStep(2)
  }

  const handleNewClient = () => {
    setShowNewClientForm(true)
    setCotizacion((prev) => ({
      ...prev,
      clienteId: null,
      cliente: {
        id: "",
        nombre: "",
        empresa: "",
        email: "",
        telefono: "",
      },
    }))
  }

  const handleClienteChange = (field: keyof Cliente, value: string) => {
    setCotizacion((prev) => ({
      ...prev,
      cliente: {
        ...prev.cliente,
        [field]: value,
      },
    }))
  }

  const handleFieldChange = (
    field: keyof Omit<CotizacionData, "cliente" | "clienteId">,
    value: string | Date | undefined,
  ) => {
    setCotizacion((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return cotizacion.clienteId !== null || (cotizacion.cliente.nombre && cotizacion.cliente.empresa)
      case 2:
        return cotizacion.cliente.nombre && cotizacion.cliente.empresa && cotizacion.cliente.email
      case 3:
        return cotizacion.servicio && cotizacion.honorarios && cotizacion.fechaVencimiento
      case 4:
        return true
      default:
        return false
    }
  }

  const simularGuardado = async () => {
    setGuardando(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUltimoGuardado(new Date())
    setGuardando(false)
  }

  const handleSalir = () => {
    if (confirm("¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.")) {
      console.log("Saliendo del panel...")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Cliente</h3>
              <p className="text-gray-600 mb-4">Asociar con un cliente</p>
              <p className="text-sm text-gray-500 mb-6">
                Una vez que se asocie un cliente con una cotización en este asistente, cualquier cambio que realices
                afectará las propiedades del cliente seleccionado.
              </p>
            </div>

            {!showNewClientForm ? (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                <div className="border rounded-lg max-h-60 overflow-y-auto">
                  {filteredClientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleClienteSelect(cliente)}
                    >
                      <div className="font-medium">{cliente.empresa}</div>
                      <div className="text-sm text-gray-600">{cliente.nombre}</div>
                    </div>
                  ))}

                  <div
                    className="p-3 hover:bg-blue-50 cursor-pointer text-blue-600 font-medium flex items-center gap-2"
                    onClick={handleNewClient}
                  >
                    <Plus className="h-4 w-4" />
                    Nuevo cliente
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Crear nuevo cliente</h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowNewClientForm(false)}>
                    Volver a la lista
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo *</Label>
                    <Input
                      id="nombre"
                      placeholder="Juan Pérez"
                      value={cotizacion.cliente.nombre}
                      onChange={(e) => handleClienteChange("nombre", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa *</Label>
                    <Input
                      id="empresa"
                      placeholder="Empresa S.A."
                      value={cotizacion.cliente.empresa}
                      onChange={(e) => handleClienteChange("empresa", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
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
                      placeholder="+34 600 000 000"
                      value={cotizacion.cliente.telefono}
                      onChange={(e) => handleClienteChange("telefono", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Verificar Datos del Cliente</h3>
              <p className="text-gray-600 mb-6">Revisa y confirma que los datos del cliente son correctos</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Nombre completo</Label>
                      <p className="text-lg">{cotizacion.cliente.nombre || "No especificado"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Empresa</Label>
                      <p className="text-lg">{cotizacion.cliente.empresa || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="text-lg">{cotizacion.cliente.email || "No especificado"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Teléfono</Label>
                      <p className="text-lg">{cotizacion.cliente.telefono || "No especificado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                Si necesitas modificar algún dato, puedes volver al paso anterior o continuar y editarlo más tarde.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Detalles de la Cotización</h3>
              <p className="text-gray-600 mb-6">Configura el servicio, precio y fecha de vencimiento</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Vencimiento *</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servicio">Servicio *</Label>
                  <Select value={cotizacion.servicio} onValueChange={(value) => handleFieldChange("servicio", value)}>
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="honorarios" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Precio de Honorarios *
                </Label>
                <Input
                  id="honorarios"
                  placeholder="€ 1,500.00"
                  value={cotizacion.honorarios}
                  onChange={(e) => handleFieldChange("honorarios", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Información Adicional</h3>
              <p className="text-gray-600 mb-6">Agrega comentarios y detalles específicos de la cotización</p>
            </div>

            <div className="space-y-4">
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
          </div>
        )

      default:
        return null
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
          {/* Formulario con Stepper */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Formulario de Cotización
              </CardTitle>
              <CardDescription>Completa los datos paso a paso</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stepper */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                            currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {step.id}
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xs font-medium">{step.title}</div>
                          <div className="text-xs text-gray-500 hidden sm:block">{step.description}</div>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 mx-4 mt-[-20px]",
                            currentStep > step.id ? "bg-blue-600" : "bg-gray-200",
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contenido del paso actual */}
              <div className="min-h-[400px]">{renderStepContent()}</div>

              {/* Navegación */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex gap-2">
                  {currentStep < steps.length ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceedFromStep(currentStep)}
                      className="flex items-center gap-2"
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={simularGuardado} disabled={guardando} className="flex items-center gap-2">
                      {guardando ? "Guardando..." : "Finalizar Cotización"}
                    </Button>
                  )}
                </div>
              </div>
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
                  <p className="text-gray-600">Documento de cotización profesional</p>
                </div>

                {/* Información del Cliente */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Datos del Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p>
                      <strong>Nombre:</strong> {cotizacion.cliente.nombre || "Por completar"}
                    </p>
                    <p>
                      <strong>Empresa:</strong> {cotizacion.cliente.empresa || "Por completar"}
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
                        <strong>Fecha de Vencimiento:</strong>
                      </span>
                      <span>
                        {cotizacion.fechaVencimiento
                          ? format(cotizacion.fechaVencimiento, "dd/MM/yyyy", { locale: es })
                          : "Por seleccionar"}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>
                        <strong>Honorarios:</strong>
                      </span>
                      <span>{cotizacion.honorarios || "Por completar"}</span>
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
              <Button onClick={simularGuardado} disabled={guardando} className="bg-blue-600 hover:bg-blue-700">
                {guardando ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
