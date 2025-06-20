"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { 
  Search, 
  Phone, 
  Mail, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Paperclip, 
  FileSpreadsheet, 
  File, 
  CalendarIcon, 
  FileText, 
  User, 
  DollarSign, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  AlignLeft,
} from 'lucide-react'
import { format, isSameDay, addDays, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

//autenticación
import { useAuth } from "@/context/AuthContext";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Page, Text, View, Document, StyleSheet, pdf } from "@react-pdf/renderer"
import {
  FullscreenDialog,
  FullscreenDialogContent,
} from "@/components/fullscreen-dialog"
import { cn } from "@/lib/utils"

const pdfStyles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.3,
  },
  header: {
    textAlign: "center",
    marginBottom: 16,
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#1f2937",
  },
  cod: {
    color: "#6b7280",
    fontSize: 9,
    marginBottom: 4,
  },
  clientInfo: {
    backgroundColor: "#f8fafc",
    padding: 8,
    marginBottom: 12,
    fontSize: 9,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1f2937",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 2,
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 9,
  },
  detailItem: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
  },
  value: {
    color: "#6b7280",
  },
  totalSection: {
    backgroundColor: "#f1f5f9",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  paymentsTable: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    padding: 6,
    fontSize: 9,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    padding: 6,
    fontSize: 9,
  },
  tableCell: {
    flex: 1,
    paddingRight: 4,
  },
  comment: {
    color: "#374151",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 4,
    fontSize: 9,
    lineHeight: 1.4,
  },
  greenBox: {
    color: "#166534",
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 4,
    borderLeft: "3px solid #22c55e",
    fontSize: 9,
    lineHeight: 1.4,
  },
  redBox: {
    color: "#b91c1c",
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 4,
    borderLeft: "3px solid #ef4444",
    fontSize: 9,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 16,
    paddingTop: 8,
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.3,
  },
})

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
  comentarios: string
  queHaremos: string
  queNoIncluye: string
}

const CotizacionPDF = ({
  quotation,
  pagosDivididos,
  tablaPagos,
}: { quotation: any; pagosDivididos: boolean; tablaPagos: any[] }) => {
  const calcularCantidadPago = (porcentaje: number) => {
    const precio = Number.parseFloat(quotation.precio) || 0
    return ((precio * porcentaje) / 100).toFixed(2)
  }

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>COTIZACIÓN</Text>
          <Text style={pdfStyles.cod}>Referencia: {quotation.codigo_cotizacion || ""}</Text>
          <Text style={pdfStyles.cod}>
            Creación: {quotation.fecha_creacion?.slice(0, 10) || format(new Date(), "dd/MM/yyyy")}
          </Text>
          <Text style={pdfStyles.cod}>Caducidad: {quotation.fecha_vencimiento || "Por definir"}</Text>
        </View>

        {/* Client Info */}
        <View style={pdfStyles.clientInfo}>
          <Text style={pdfStyles.label}>Cliente: {quotation.nombre_cliente || "Por completar"}</Text>
          <Text>Email: {quotation.email || "Por completar"}</Text>
          <Text>Teléfono: {quotation.telefono || "Por completar"}</Text>
        </View>

        {/* Service Details */}
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>PRODUCTOS Y SERVICIOS</Text>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.tableCell, { flex: 3 }]}>DESCRIPCIÓN</Text>
            <Text style={pdfStyles.tableCell}>CANTIDAD</Text>
            <Text style={pdfStyles.tableCell}>PRECIO</Text>
          </View>
          <View style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 3 }]}>{quotation.servicio || "Por seleccionar"}</Text>
            <Text style={pdfStyles.tableCell}>1</Text>
            <Text style={pdfStyles.tableCell}>S/ {quotation.precio || "0.00"}</Text>
          </View>
        </View>

        {/* Total Section */}
        <View style={pdfStyles.totalSection}>
          <Text style={pdfStyles.sectionTitle}>RESUMEN</Text>
          <View style={pdfStyles.totalRow}>
            <Text style={pdfStyles.totalLabel}>Subtotal:</Text>
            <Text style={pdfStyles.totalValue}>S/ {quotation.precio || "0.00"}</Text>
          </View>
          <View style={pdfStyles.totalRow}>
            <Text style={[pdfStyles.totalLabel, { fontSize: 12 }]}>Total:</Text>
            <Text style={[pdfStyles.totalValue, { fontSize: 14 }]}>S/ {quotation.precio || "0.00"}</Text>
          </View>
        </View>

        {/* Payment Schedule */}
        {pagosDivididos && tablaPagos.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>CALENDARIO DE PAGOS</Text>
            <View style={pdfStyles.tableHeader}>
              <Text style={[pdfStyles.tableCell, { flex: 2 }]}>NOMBRE</Text>
              <Text style={pdfStyles.tableCell}>PENDIENTE</Text>
              <Text style={pdfStyles.tableCell}>IMPORTE</Text>
              <Text style={[pdfStyles.tableCell, { flex: 2 }]}>VENCIMIENTO</Text>
            </View>
            {tablaPagos.map((pago, index) => (
              <View key={index} style={pdfStyles.tableRow}>
                <Text style={[pdfStyles.tableCell, { flex: 2 }]}>{pago.nombre}</Text>
                <Text style={pdfStyles.tableCell}>{pago.porcentaje}%</Text>
                <Text style={pdfStyles.tableCell}>S/ {pago.cantidad || calcularCantidadPago(pago.porcentaje)}</Text>
                <Text style={[pdfStyles.tableCell, { flex: 2 }]}>{pago.fechaVencimiento}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Comments and Details */}
        {quotation.comentarios && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Comentarios</Text>
            <Text style={pdfStyles.comment}>{quotation.comentarios}</Text>
          </View>
        )}

        {quotation.detalle_servicio && (
          <View style={pdfStyles.section}>
            <Text style={[pdfStyles.sectionTitle, { color: "#166534" }]}>¿Qué haremos por usted?</Text>
            <Text style={pdfStyles.greenBox}>{quotation.detalle_servicio}</Text>
          </View>
        )}

        {quotation.exclusiones && (
          <View style={pdfStyles.section}>
            <Text style={[pdfStyles.sectionTitle, { color: "#b91c1c" }]}>¿Qué no incluye la cotización?</Text>
            <Text style={pdfStyles.redBox}>{quotation.exclusiones}</Text>
          </View>
        )}

        <View style={pdfStyles.footer}>
          <Text>
            Nota: Este precio incluye la emisión de un Recibo por Honorarios de un abogado del estudio, pero si desea
            boleta o factura del estudio deberá añadir el 18% de IGV
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default function QuotesManagementPanel() {
  const [quotation, setQuotation] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [quotationForm, setQuotationForm] = useState<CotizacionData>({
    cliente: { nombre: "", empresa: "", email: "", telefono: "" },
    fechaVencimiento: undefined,
    servicio: "",
    precio: "",
    comentarios: "",
    queHaremos: "",
    queNoIncluye: "",
  })
  const [vencimientoType, setVencimientoType] = useState("")
  const [serviceSelect, setServiceSelect] = useState("")
  const [customService, setCustomService] = useState("")

  const [pagosDivididos, setPagosDivididos] = useState(false)
  const [tablaPagos, setTablaPagos] = useState([
    { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "Al recibir" },
    { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
  ])

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setQuotation(res.data))
      .catch(() => setError("Error al cargar cotizaciones"))
      .finally(() => setLoading(false))
  }, [])

  const handleExportPDF = async (quotation: any) => {
    const blob = await pdf(
      <CotizacionPDF quotation={quotation} pagosDivididos={pagosDivididos} tablaPagos={tablaPagos} />,
    ).toBlob()
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  }
  // Abrir modal en modo agregar
  const openAddQuotationModal = () => {
    setModalMode("add")
    setEditingId(null)
    setQuotationForm({
      cliente: { nombre: "", empresa: "", email: "", telefono: "" },
      fechaVencimiento: undefined,
      servicio: "",
      precio: "",
      comentarios: "",
      queHaremos: "",
      queNoIncluye: "",
    })
    setVencimientoType("")
    setServiceSelect("")
    setCustomService("")
    setPagosDivididos(false)
    setTablaPagos([
      { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "Al recibir" },
      { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
    ])
    setModalOpen(true)
  }

  // Abrir modal en modo editar
  const openEditQuotationModal = async (quotation: any) => {
    setModalMode("edit")
    setEditingId(quotation.id)
    try {
      const res = await axios.get(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones/${quotation.id}`)
      const freshQuotation = res.data
      // Calcular vencimientoType
      let vencimientoTypeValue = "other"
      if (freshQuotation.fecha_vencimiento) {
        const fechaVencimiento = parseISO(freshQuotation.fecha_vencimiento)
        if (isSameDay(fechaVencimiento, addDays(new Date(), 3))) vencimientoTypeValue = "3"
        else if (isSameDay(fechaVencimiento, addDays(new Date(), 7))) vencimientoTypeValue = "7"
        else if (isSameDay(fechaVencimiento, addDays(new Date(), 15))) vencimientoTypeValue = "15"
        else vencimientoTypeValue = "other"
      }
      setVencimientoType(vencimientoTypeValue)
      // Servicio
      if (!servicios.includes(freshQuotation.servicio)) {
        setServiceSelect("Otros")
        setCustomService(freshQuotation.servicio)
      } else {
        setServiceSelect(freshQuotation.servicio || "")
        setCustomService("")
      }
      setQuotationForm({
        cliente: {
          nombre: freshQuotation.nombre_cliente || "",
          empresa: "",
          email: freshQuotation.email || "",
          telefono: freshQuotation.telefono || "",
        },
        fechaVencimiento: freshQuotation.fecha_vencimiento ? parseISO(freshQuotation.fecha_vencimiento) : undefined,
        servicio: freshQuotation.servicio || "",
        precio: freshQuotation.precio?.toString() || "",
        comentarios: freshQuotation.comentarios || "",
        queHaremos: freshQuotation.detalle_servicio || "",
        queNoIncluye: freshQuotation.exclusiones || "",
      })
      setModalOpen(true)
    } catch {
      toast.error("Error al obtener datos actualizados de la cotización")
    }
  }

  // Cambios en los campos del formulario
  const handleClientChange = (field: keyof CotizacionData["cliente"], value: string) => {
    setQuotationForm((prev) => ({
      ...prev,
      cliente: {
        ...prev.cliente,
        [field]: value,
      },
    }))
  }
  const handleFieldChange = (field: keyof Omit<CotizacionData, "cliente">, value: string | Date | undefined) => {
    setQuotationForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePagoChange = (index: number, field: string, value: string | number) => {
    setTablaPagos((prev) => prev.map((pago, i) => (i === index ? { ...pago, [field]: value } : pago)))
  }

  const agregarPago = () => {
    setTablaPagos((prev) => [
      ...prev,
      {
        nombre: `Pago ${prev.length + 1}`,
        porcentaje: 0,
        cantidad: "",
        fechaVencimiento: "",
      },
    ])
  }

  const eliminarPago = (index: number) => {
    if (tablaPagos.length > 1) {
      setTablaPagos((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const calcularCantidadPago = (porcentaje: number) => {
    const precio = Number.parseFloat(quotationForm.precio) || 0
    return ((precio * porcentaje) / 100).toFixed(2)
  }

  // Guardar/agregar cotización
  const handleQuotationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      nombre_cliente: quotationForm.cliente.nombre,
      email: quotationForm.cliente.email,
      telefono: quotationForm.cliente.telefono,
      fecha_vencimiento: quotationForm.fechaVencimiento
        ? quotationForm.fechaVencimiento.toISOString().split("T")[0]
        : null,
      servicio: quotationForm.servicio,
      precio: parseFloat(quotationForm.precio) || 0,
      comentarios: quotationForm.comentarios,
      detalle_servicio: quotationForm.queHaremos,
      exclusiones: quotationForm.queNoIncluye,
    }
    if (modalMode === "add") {
      try {
        const res = await axios.post("http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones", payload)
        setQuotation((prev) => [...prev, res.data])
        toast.success("Cotización agregada correctamente")
        setModalOpen(false)
      } catch {
        toast.error("Error al agregar cotización")
      }
    } else if (modalMode === "edit" && editingId) {
      try {
        await axios.put(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones/${editingId}`, payload)
        setQuotation((prev) =>
          prev.map((q) => (q.id === editingId ? { ...q, ...payload } : q))
        )
        toast.success("Cotización actualizada correctamente")
        setModalOpen(false)
      } catch {
        toast.error("Error al actualizar cotización")
      }
    }
  }

  const filteredQuotations = quotation.filter((quotation) => {
    const matchesSearch =
      quotation.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.servicio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.fecha_vencimiento?.toString().includes(searchTerm) ||
      quotation.estado?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || quotation.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQuotations = filteredQuotations.slice(startIndex, endIndex)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Cancelado":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Aprobado":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const uniqueRoles = Array.from(new Set(quotation.map((u) => u.estado).filter(Boolean)))

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
              <p className="text-gray-600 mt-1">Administra las cotizaciones y su estado</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Cotizaciones</CardTitle>
                <Paperclip className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quotation.length}</div>
                <p className="text-xs text-gray-500">+2 desde el mes pasado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Usuarios Activos</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-gray-500">87.5% del total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Abogados</CardTitle>
                <Mail className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-500">Personal legal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Administradores</CardTitle>
                <Phone className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-gray-500">Acceso completo</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Lista de Cotizaciones</CardTitle>
              <CardDescription>Busca y gestiona todas las cotizaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <div className="mb-4 text-blue-600">Cargando cotizaciones...</div>}
              {error && <div className="mb-4 text-red-600">{error}</div>}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente, tipo de servicio, dias de validez, estado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos estados</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={openAddQuotationModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Cotización
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha de vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentQuotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell>{quotation.id}</TableCell>
                        <TableCell>{quotation.codigo_cotizacion}</TableCell>
                        <TableCell>{quotation.nombre_cliente}</TableCell>
                        <TableCell>{quotation.telefono}</TableCell>
                        <TableCell>{quotation.servicio}</TableCell>
                        <TableCell>{quotation.fecha_vencimiento}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(quotation.estado)}>{quotation.estado}</Badge>
                        </TableCell>
                        <TableCell>{quotation.responsable || "Sin asignar"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditQuotationModal(quotation)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlignLeft className="mr-2 h-4 w-4" />
                                Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExportPDF(quotation)}>
                                <File className="mr-2 h-4 w-4 text-red-600" />
                                PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                Excel
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Filas por página</p>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value))
                      setCurrentPage(1)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="top">
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredQuotations.length)} de{" "}
                {filteredQuotations.length} cotizaciones
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal único para agregar/editar */}
      <FullscreenDialog open={modalOpen} onOpenChange={setModalOpen}>
        <FullscreenDialogContent>
          <div className="bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {modalMode === "add" ? "Agregar Cotización" : "Editar Cotización"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {modalMode === "add"
                    ? "Completa los campos para crear una nueva cotización"
                    : `Modifica los campos necesarios para actualizar la cotización "${quotationForm.cliente.nombre}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulario */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Formulario de Cotización
                    </CardTitle>
                    <CardDescription>Completa los datos para actualizar la cotización</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleQuotationSubmit} className="space-y-6">
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
                            value={quotationForm.cliente.nombre}
                            onChange={(e) => handleClientChange("nombre", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="juan@empresa.com"
                              value={quotationForm.cliente.email}
                              onChange={(e) => handleClientChange("email", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input
                              id="telefono"
                              placeholder="+51 900 000 000"
                              value={quotationForm.cliente.telefono}
                              onChange={(e) => handleClientChange("telefono", e.target.value)}
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
                              value={vencimientoType}
                              onValueChange={(value) => {
                                setVencimientoType(value)
                                if (value === "otro") {
                                  handleFieldChange("fechaVencimiento", undefined)
                                } else {
                                  const dias = parseInt(value, 10)
                                  const nuevaFecha = addDays(new Date(), dias)
                                  handleFieldChange("fechaVencimiento", nuevaFecha)
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
                            {vencimientoType === "otro" && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !quotationForm.fechaVencimiento && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {quotationForm.fechaVencimiento ? (
                                      format(quotationForm.fechaVencimiento, "PPP", { locale: es })
                                    ) : (
                                      <span>Seleccionar fecha</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={quotationForm.fechaVencimiento}
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
                              value={serviceSelect}
                              onValueChange={(value) => {
                                setServiceSelect(value)
                                if (value !== "Otros") {
                                  handleFieldChange("servicio", value)
                                  setCustomService("")
                                } else {
                                  handleFieldChange("servicio", "")
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
                            {serviceSelect === "Otros" && (
                              <Input
                                className="mt-2"
                                placeholder="Especifica el servicio"
                                value={customService}
                                onChange={(e) => {
                                  setCustomService(e.target.value)
                                  handleFieldChange("servicio", e.target.value)
                                }}
                              />
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="precio" className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Precio del servicio
                          </Label>
                          <Input
                            id="precio"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="S/ 1,500.00"
                            value={quotationForm.precio}
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
                                          const porcentaje = Number.parseFloat(e.target.value) || 0
                                          handlePagoChange(index, "porcentaje", porcentaje)
                                          handlePagoChange(index, "cantidad", calcularCantidadPago(porcentaje))
                                        }}
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <Input
                                        placeholder="S/ 0.00"
                                        value={pago.cantidad || calcularCantidadPago(pago.porcentaje)}
                                        onChange={(e) => handlePagoChange(index, "cantidad", e.target.value)}
                                      />
                                    </div>
                                    <div className="col-span-4">
                                      <Input
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
                          <Label htmlFor="comentarios" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Comentarios
                          </Label>
                          <Textarea
                            id="comentarios"
                            placeholder="Comentarios adicionales sobre la cotización..."
                            rows={3}
                            value={quotationForm.comentarios}
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
                            value={quotationForm.queHaremos}
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
                            value={quotationForm.queNoIncluye}
                            onChange={(e) => handleFieldChange("queNoIncluye", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
                        <div className="max-w-7xl mx-auto flex justify-between items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setModalOpen(false)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            Salir
                          </Button>
                          <div className="flex items-center gap-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                              {modalMode === "add" ? "Agregar" : "Guardar"}
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
                        <p className="text-gray-600">Cod. {quotationForm.codigo_cotizacion || ""}</p>
                      </div>

                      {/* Información del Cliente */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Datos del Cliente</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p>
                            <strong>Nombre:</strong> {quotationForm.cliente.nombre || "Por completar"}
                          </p>
                          <p>
                            <strong>Email:</strong> {quotationForm.cliente.email || "Por completar"}
                          </p>
                          <p>
                            <strong>Teléfono:</strong> {quotationForm.cliente.telefono || "Por completar"}
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
                            <span>{quotationForm.servicio || "Por seleccionar"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              <strong>Fecha de Emisión:</strong>
                            </span>
                            <span>{format(new Date(), "dd/MM/yyyy", { locale: es })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              <strong>Fecha de Vencimiento:</strong>
                            </span>
                            <span>
                              {quotationForm.fechaVencimiento
                                ? format(quotationForm.fechaVencimiento, "dd/MM/yyyy", { locale: es })
                                : "Por seleccionar"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>
                              <strong>Precio:</strong>
                            </span>
                            <span>S/ {quotationForm.precio || "Por completar"}</span>
                          </div>
                        </div>
                      </div>

                      {pagosDivididos && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 text-gray-800">Calendario de Pagos</h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse border border-gray-300">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Nombre</th>
                                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                                    Pendiente
                                  </th>
                                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Importe</th>
                                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">
                                    Vencimiento
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {tablaPagos.map((pago, index) => (
                                  <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-3 py-2">{pago.nombre}</td>
                                    <td className="border border-gray-300 px-3 py-2">{pago.porcentaje}%</td>
                                    <td className="border border-gray-300 px-3 py-2">
                                      S/ {pago.cantidad || calcularCantidadPago(pago.porcentaje)}
                                    </td>
                                    <td className="border border-gray-300 px-3 py-2">{pago.fechaVencimiento}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {quotationForm.comentarios && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 text-gray-800">Comentarios</h3>
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{quotationForm.comentarios}</p>
                        </div>
                      )}

                      {quotationForm.queHaremos && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            ¿Qué haremos por usted?
                          </h3>
                          <p className="text-gray-700 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                            {quotationForm.queHaremos}
                          </p>
                        </div>
                      )}

                      {quotationForm.queNoIncluye && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-3 text-red-800 flex items-center gap-2">
                            <XCircle className="h-5 w-5" />
                            ¿Qué no incluye la cotización?
                          </h3>
                          <p className="text-gray-700 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                            {quotationForm.queNoIncluye}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
                        <p>
                          Nota: Este precio incluye la emisión de un Recibo por Honorarios de un abogado del estudio,
                          pero si desea boleta o factura del estudio deberá añadir el 18% de IGV
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </FullscreenDialogContent>
      </FullscreenDialog>

      {/* Modal de confirmación de eliminación */}
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar la cotización ""? Esta acción no
              se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button>
              Cancelar
            </Button>
            <Button variant="destructive">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
