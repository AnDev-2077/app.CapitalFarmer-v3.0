"use client"

import type React from "react"
import { useNavigate } from "react-router-dom";
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
  FileScan,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, pdf } from "@react-pdf/renderer";


const pdfStyles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Helvetica" },
  header: { textAlign: "center", marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  cod: { color: "#6b7280", fontSize: 12 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#1f2937" },
  box: { backgroundColor: "#f9fafb", padding: 12, borderRadius: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontWeight: "bold" },
  comment: { color: "#374151", backgroundColor: "#f9fafb", padding: 12, borderRadius: 8 },
  greenBox: { color: "#166534", backgroundColor: "#dcfce7", padding: 12, borderRadius: 8, borderLeft: "4px solid #22c55e" },
  redBox: { color: "#b91c1c", backgroundColor: "#fee2e2", padding: 12, borderRadius: 8, borderLeft: "4px solid #ef4444" },
  footer: { marginTop: 32, paddingTop: 12, borderTop: "1px solid #e5e7eb", textAlign: "center", fontSize: 12, color: "#6b7280" }
});

const CotizacionPDF = ({ quotation }: { quotation: any }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>COTIZACIÓN</Text>
        <Text style={pdfStyles.cod}>Cod. {quotation.codigo_cotizacion || ""}</Text>
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Datos del Cliente</Text>
        <View style={pdfStyles.box}>
          <Text><Text style={pdfStyles.label}>Nombre:</Text> {quotation.nombre_cliente || "Por completar"}</Text>
          <Text><Text style={pdfStyles.label}>Email:</Text> {quotation.email || "Por completar"}</Text>
          <Text><Text style={pdfStyles.label}>Teléfono:</Text> {quotation.telefono || "Por completar"}</Text>
        </View>
      </View>
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Detalles de la Cotización</Text>
        <View>
          <View style={pdfStyles.row}><Text style={pdfStyles.label}>Servicio:</Text><Text>{quotation.servicio || "Por seleccionar"}</Text></View>
          <View style={pdfStyles.row}><Text style={pdfStyles.label}>Fecha de Emisión:</Text><Text>{quotation.fecha_creacion?.slice(0, 10) || ""}</Text></View>
          <View style={pdfStyles.row}><Text style={pdfStyles.label}>Fecha de Vencimiento:</Text><Text>{quotation.fecha_vencimiento || "Por seleccionar"}</Text></View>
          <View style={pdfStyles.row}><Text style={pdfStyles.label}>Precio:</Text><Text>S/ {quotation.precio || "Por completar"}</Text></View>
        </View>
      </View>
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
        <Text>Nota: Este precio incluye la emisión de un Recibo por Honorarios de un 
          abogado del estudio, pero si desea boleta o factura del estudio deberá añadir el 18% de IGV</Text>
      </View>
    </Page>
  </Document>
);

export default function UserManagementPanel() {
  const [quotation, setQuotation] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
 
  useEffect(() => {
    setLoading(true)
    axios
      .get("http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones")
      .then((res) => setQuotation(res.data))
      .catch(() => setError("Error al cargar cotizaciones"))
      .finally(() => setLoading(false))
  }, [])

  const navigate = useNavigate();

  const handleGoToCreateQuotation = () => {
    navigate("/home/quotes/add");
  };

  const handleDeleteQuotation = (quotationId: number) => {
  axios
    .delete(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones/${quotationId}`)
    .then(() => {
      setQuotation((prev) => prev.filter((user) => user.id !== quotationId))
      toast.success("Cotización eliminada correctamente")
    })
    .catch(() => toast.error("Error al eliminar cotización"))
  }

  const handleExportPDF = async (quotation: any) => {
    const blob = await pdf(<CotizacionPDF quotation={quotation} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

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

  const uniqueRoles = Array.from(
    new Set(quotation.map((u) => u.rol_nombre).filter(Boolean))
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cotizacines</h1>
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
                    <SelectValue placeholder="Filtrar por rol" />
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
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleGoToCreateQuotation}>
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
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileScan className="mr-2 h-4 w-4" />
                                Detalles
                              </DropdownMenuItem>
                              <PDFDownloadLink
                                  document={<CotizacionPDF quotation={quotation} />}
                                  fileName={`cotizacion_${quotation.codigo_cotizacion || "sin_codigo"}_${(quotation.nombre_cliente || "sin_cliente").replace(/ /g, "_")}.pdf`}
                                >
                                  {({ loading }) =>
                                    loading ? "Generando PDF..." : (
                                      <DropdownMenuItem onClick={() => handleExportPDF(quotation)}>
                                        <File className="mr-2 h-4 w-4 text-red-600" />
                                        Pdf
                                      </DropdownMenuItem>
                                    )
                                  }
                                </PDFDownloadLink>
                              <DropdownMenuItem>
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                Excel
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteQuotation(quotation.id)}>
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredQuotations.length)} de {filteredQuotations.length}{" "}
                usuarios
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
