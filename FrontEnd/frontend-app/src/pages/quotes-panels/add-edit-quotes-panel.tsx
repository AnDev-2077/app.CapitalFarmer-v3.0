"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CalendarIcon, FileText, User, DollarSign, Trash2, CheckCircle, XCircle, Plus } from "lucide-react"
import { format, addDays, isSameDay, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import QuoteSchema from "@/pages/quotes-panels/quote-template"
import { useAuth } from "@/context/AuthContext";

export interface CotizacionData {
  id?: number;
  codigoCotizacion?: string;
  cliente: {
    nombre: string
    email: string
    telefono: string
  }
  fechaVencimiento: Date | undefined
  servicio: string
  precio: string
  comentarios: string
  queHaremos: string
  queNoIncluye: string
  pagosDivididos: Array<{
    nombre: string
    porcentaje: number
    cantidad: string
    fechaVencimiento: string
  }>
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

export default function CotizacionPanel(
  {
  onClose,
  initialData,
}: {
  onClose?: () => void,
  initialData?: Partial<CotizacionData> & { id?: number },
}
) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [cotizacion, setCotizacion] = useState<CotizacionData>({
    cliente: {
      nombre: "",
      email: "",
      telefono: "",
    },
    fechaVencimiento: undefined, 
    servicio: "",
    precio: "",
    comentarios: "",
    queHaremos: "",
    queNoIncluye: "",
    pagosDivididos: [
      { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
      { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
    ],
  })
  const [vencimientoTipo, setVencimientoTipo] = useState<string>(""); // "3", "7", "15", "otro"
  const [servicioPersonalizado, setServicioPersonalizado] = useState("");
  const [servicioSelect, setServicioSelect] = useState<string>("");
  const [mode, setMode] = useState<"crear" | "editar">("crear");

  const [pagosDivididos, setPagosDivididos] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  

  const agregarPago = () => {
    setTablaPagos((prev) => [
      ...prev,
      {
        nombre: `Pago ${prev.length + 1}`,
        porcentaje: 0,
        cantidad: "",
        fechaVencimiento: "",
      },
    ]);
  };

  const eliminarPago = (index: number) => {
    if (tablaPagos.length > 1) {
      setTablaPagos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // --- FUNCIONES DE PAGO DIVIDIDO ---
  const calcularCantidadPago = (precio: string, porcentaje: number) => {
    const precioNum = parseFloat(precio) || 0;
    return ((precioNum * porcentaje) / 100).toFixed(2);
  };

  const calcularPorcentajePago = (precio: string, cantidad: string) => {
    const precioNum = parseFloat(precio) || 0;
    const cantidadNum = parseFloat(cantidad) || 0;
    if (precioNum === 0) return 0;
    return ((cantidadNum / precioNum) * 100).toFixed(2);
  };

  const handlePagoChange = (index: number, field: string, value: string | number) => {
    setTablaPagos((prev) => {
      let pagos = [...prev];
      if (field === "porcentaje") {
        const nuevoPorcentaje = Number(value);
        pagos[index].porcentaje = nuevoPorcentaje;
        pagos[index].cantidad = calcularCantidadPago(cotizacion.precio, nuevoPorcentaje);
        if (pagos.length === 2) {
          const otroIndex = index === 0 ? 1 : 0;
          pagos[otroIndex].porcentaje = 100 - nuevoPorcentaje;
          pagos[otroIndex].cantidad = calcularCantidadPago(cotizacion.precio, pagos[otroIndex].porcentaje);
        }
      } else if (field === "cantidad") {
        const nuevaCantidad = value.toString();
        pagos[index].cantidad = nuevaCantidad;
        pagos[index].porcentaje = Number(calcularPorcentajePago(cotizacion.precio, nuevaCantidad));
        if (pagos.length === 2) {
          const otroIndex = index === 0 ? 1 : 0;
          pagos[otroIndex].porcentaje = 100 - pagos[index].porcentaje;
          pagos[otroIndex].cantidad = calcularCantidadPago(cotizacion.precio, pagos[otroIndex].porcentaje);
        }
      } else {
        pagos[index][field] = value;
      }
      return pagos;
    });
  };

  const [tablaPagos, setTablaPagos] = useState([
    { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
    { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
  ]);

  const { token } = useAuth();
  const [codigoCotizacion, setCodigoCotizacion] = useState<string>("COT-XXXXXXFCT");
  
  function parseDateAsLocal(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0); // 12:00 para evitar desfase
  }

  useEffect(() => {
    if (id) {
      setMode("editar");
      (async () => {
        try {
          const res = await axios.get(`${API_URL}/capitalfarmer.co/api/v1/cotizaciones/${id}/con-cuotas`, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'ngrok-skip-browser-warning': 'true'
            }
          });
          const data = res.data;
          setCodigoCotizacion(data.codigo_cotizacion || "COT-XXXXXXFCT");
          const fechaVencimiento = data.fecha_vencimiento
            ? parseDateAsLocal(data.fecha_vencimiento)
            : undefined;
          // Obtener cuotas asociadas
          console.log("Cuotas recibidas del backend:", data.cuotas);
          // --- Lógica de sincronización como el primer código ---
          // Servicio
          let servicioSelectValue = "";
          let servicioPersonalizadoValue = "";
          if (!servicios.includes(data.servicio)) {
            servicioSelectValue = "Otros";
            servicioPersonalizadoValue = data.servicio || "";
          } else {
            servicioSelectValue = data.servicio || "";
            servicioPersonalizadoValue = "";
          }
          setServicioSelect(servicioSelectValue);
          setServicioPersonalizado(servicioPersonalizadoValue);

          // Vencimiento
          let vencimientoTipoValue = "otro";
          if (fechaVencimiento) {
            const fecha = new Date(fechaVencimiento);
            fecha.setHours(12, 0, 0, 0);
            if (isSameDay(fecha, addDays(new Date(), 3))) {
              vencimientoTipoValue = "3";
            } else if (isSameDay(fecha, addDays(new Date(), 7))) {
              vencimientoTipoValue = "7";
            } else if (isSameDay(fecha, addDays(new Date(), 15))) {
              vencimientoTipoValue = "15";
            }
          }
          setVencimientoTipo(vencimientoTipoValue);

          // Pagos divididos
          const cuotas = (data.cuotas || []).map((cuota: any) => ({
            nombre: cuota.nombre_cuota,
            porcentaje: cuota.porcentaje,
            cantidad: cuota.monto.toString(),
            fechaVencimiento: cuota.fecha_vencimiento || "",
          }));
          if (cuotas.length > 0) {
            setPagosDivididos(true);
            setTablaPagos(cuotas);
          } else {
            setPagosDivididos(false);
            setTablaPagos([
              { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
              { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
            ]);
          }

          setCotizacion({
            id: data.id,
            codigoCotizacion: data.codigo_cotizacion || "COT-XXXXXXFCT",
            cliente: {
              nombre: data.nombre_cliente || "",
              email: data.email || "",
              telefono: data.telefono || "",
            },
            fechaVencimiento,
            servicio: data.servicio || "",
            precio: data.precio?.toString() || "",
            comentarios: data.comentarios || "",
            queHaremos: data.detalle_servicio || "",
            queNoIncluye: data.exclusiones || "",
            pagosDivididos: cuotas,
          });
        } catch {
          alert("Error al cargar la cotización");
        }
      })();
    } else if (initialData) {
      setCotizacion({
        cliente: {
          nombre: initialData.cliente?.nombre || "",
          email: initialData.cliente?.email || "",
          telefono: initialData.cliente?.telefono || "",
        },
        fechaVencimiento: initialData.fechaVencimiento ? new Date(initialData.fechaVencimiento) : undefined,
        servicio: initialData.servicio || "",
        precio: initialData.precio || "",
        comentarios: initialData.comentarios || "",
        queHaremos: initialData.queHaremos || "",
        queNoIncluye: initialData.queNoIncluye || "",
        pagosDivididos: initialData.pagosDivididos || [
          { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
          { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
        ],
      });
      setServicioSelect(initialData.servicio || "");
    }
  }, [id, initialData, token]);

  useEffect(() => {
    if (pagosDivididos) {
      setTablaPagos([
        { nombre: "Pago 1", porcentaje: 50, cantidad: calcularCantidadPago(cotizacion.precio, 50), fechaVencimiento: "" },
        { nombre: "Pago 2", porcentaje: 50, cantidad: calcularCantidadPago(cotizacion.precio, 50), fechaVencimiento: "" },
      ]);
    }
  }, [pagosDivididos, cotizacion.precio]);

  useEffect(() => {
    setTablaPagos((prev) =>
      prev.map((pago) => ({
        ...pago,
        cantidad: calcularCantidadPago(cotizacion.precio, pago.porcentaje),
      }))
    );
  }, [cotizacion.precio, tablaPagos.length]);

  useEffect(() => {
    setCotizacion((prev) => ({
      ...prev,
      pagosDivididos: tablaPagos,
    }));
  }, [tablaPagos]);

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

  useEffect(() => {
  // Sincroniza el select de servicio
    if (cotizacion.servicio && servicios.includes(cotizacion.servicio)) {
      setServicioSelect(cotizacion.servicio);
      setServicioPersonalizado("");
    } else if (cotizacion.servicio && !servicios.includes(cotizacion.servicio)) {
      setServicioSelect("Otros");
      setServicioPersonalizado(cotizacion.servicio);
    } else {
      setServicioSelect("");
      setServicioPersonalizado("");
    }

    // Sincroniza el select de vencimiento
    if (cotizacion.fechaVencimiento) {
    const fecha = new Date(cotizacion.fechaVencimiento);
    fecha.setHours(12, 0, 0, 0); 

    let vencimientoTipoValue = "otro";
    if (isSameDay(fecha, addDays(new Date(), 3))) {
      vencimientoTipoValue = "3";
    } else if (isSameDay(fecha, addDays(new Date(), 7))) {
      vencimientoTipoValue = "7";
    } else if (isSameDay(fecha, addDays(new Date(), 15))) {
      vencimientoTipoValue = "15";
    }
    setVencimientoTipo(vencimientoTipoValue);
  } else {
    setVencimientoTipo("");
  }
  }, [cotizacion.servicio, cotizacion.fechaVencimiento, servicioSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      cotizacion: {
        nombre_cliente: cotizacion.cliente.nombre,
        email: cotizacion.cliente.email,
        telefono: cotizacion.cliente.telefono,
        fecha_vencimiento: cotizacion.fechaVencimiento
          ? cotizacion.fechaVencimiento.toISOString().split('T')[0]
          : null,
        servicio: cotizacion.servicio,
        precio: parseFloat(cotizacion.precio) || 0,
        comentarios: cotizacion.comentarios,
        detalle_servicio: cotizacion.queHaremos,
        exclusiones: cotizacion.queNoIncluye,
      },
      cuotas: pagosDivididos
        ? tablaPagos.map((pago) => ({
            nombre_cuota: pago.nombre,
            porcentaje: Number(pago.porcentaje),
            monto: Number(pago.cantidad),
            fecha_vencimiento: pago.fechaVencimiento || null,
          }))
        : [],
    };
    try {
      if (mode === "editar" && id) {
        await axios.put(`${API_URL}/capitalfarmer.co/api/v1/cotizaciones/${id}/con-cuotas`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });
      } else {
        await axios.post(`${API_URL}/capitalfarmer.co/api/v1/cotizaciones-con-cuotas`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
      }
      if (onClose) onClose();
      else navigate("/home/quotes");
    } catch {

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
      navigate("/home/quotes");
    }
  }

  function sanitizeTextInput(input: string) {
    // Solo permite letras, números, espacios, comas, puntos, guiones y saltos de línea
    return input.replace(/[^a-zA-Z0-9 ,.\-\n]/g, "");
  }

  console.log("Servicio para previsualización:", cotizacion.servicio);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 p-4 pb-20 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "editar" ? "Editar Cotización" : "Crear Cotización"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card className="flex-1 h-fit">
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
                    <Label htmlFor="nombre">Cliente | Empresa</Label>
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Dividir pagos
                      </Label>
                      <Switch checked={pagosDivididos} onCheckedChange={setPagosDivididos} />
                    </div>

                    {pagosDivididos && (
                      <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Calendario de Pagos</h4>
                          <Button type="button" variant="outline" size="sm" onClick={agregarPago}>
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar Pago
                          </Button>
                        </div>
                        <div className="space-y-3">
                          {tablaPagos.map((pago, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded border"
                            >
                              <div className="col-span-3">
                                <Input
                                  placeholder="Nombre del pago"
                                  value={pago.nombre}
                                  onChange={(e) => handlePagoChange(index, "nombre", e.target.value)}
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  placeholder="%"
                                  value={pago.porcentaje}
                                  onChange={(e) => {
                                    const porcentaje = Number.parseFloat(e.target.value) || 0;
                                    handlePagoChange(index, "porcentaje", porcentaje);
                                  }}
                                />
                              </div>
                              <div className="col-span-2">
                                <Input
                                  placeholder="S/ 0.00"
                                  value={pago.cantidad || calcularCantidadPago(cotizacion.precio, pago.porcentaje)}
                                  onChange={(e) => handlePagoChange(index, "cantidad", e.target.value)}
                                />
                              </div>
                              <div className="col-span-4">
                                <Input
                                  type="date"
                                  placeholder="Fecha de vencimiento"
                                  value={pago.fechaVencimiento}
                                  onChange={(e) => handlePagoChange(index, "fechaVencimiento", e.target.value)}
                                />
                              </div>
                              <div className="col-span-1">
                                {tablaPagos.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => eliminarPago(index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <strong>Total porcentajes:</strong>{" "}
                          {tablaPagos.reduce((sum, pago) => sum + (pago.porcentaje || 0), 0)}%
                          {tablaPagos.reduce((sum, pago) => sum + (pago.porcentaje || 0), 0) !== 100 && (
                            <span className="text-orange-600 ml-2">⚠️ Los porcentajes deben sumar 100%</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="queHaremos" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      ¿Qué haremos por usted?
                    </Label>
                    <Textarea
                      placeholder="Ingrese comentarios adicionales aquí..."
                      rows={4}
                      value={cotizacion.queHaremos}
                      onChange={(e) => handleFieldChange("queHaremos", sanitizeTextInput(e.target.value))}
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
                      onChange={(e) => handleFieldChange("queNoIncluye", sanitizeTextInput(e.target.value))}
                    />
                  </div>
                </div>

                {/* Barra inferior fija */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Button
                      type="button"
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
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Vista previa de la Cotización</CardTitle>
            </CardHeader>
            <CardContent  className="p-0 bg-white overflow-y-auto">
                <QuoteSchema quotation={cotizacion} pagosDivididos={pagosDivididos}/>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}