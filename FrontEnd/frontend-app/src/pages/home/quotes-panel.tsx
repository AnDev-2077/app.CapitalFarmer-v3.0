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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"


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
                      <TableHead>Cliente</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha de vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentQuotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell>{quotation.id}</TableCell>
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
                                <File className="mr-2 h-4 w-4 " />
                                Pdf
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
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
