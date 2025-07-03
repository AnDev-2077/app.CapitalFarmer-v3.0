"use client"

import type React from "react"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  Search,
  Users,
  Phone,
  Mail,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext";

export default function UserManagementPanel() {
  const [clients, setClients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipo_documento: "",
    documento: "",
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)

  const { token } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL;
  const APIPERU_TOKEN = import.meta.env.VITE_APIPERU_TOKEN;

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API_URL}/capitalfarmer.co/api/v1/clientes` , {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
      .then((res) => {
        setClients(res.data);
        console.log(res.data); // <-- Agrega esto temporalmente
      })
      .catch(() => setError("Error al cargar usuarios"))
      .finally(() => setLoading(false))
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isRUC && (name === "nombre" || name === "apellido")) {
      setFormData((prev) => ({ ...prev, [name]: capitalizeWords(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateUser = () => {
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      tipo_documento: "",
      documento: "",
    })
    setEditingUserId(null)
    setIsEditMode(false)
    setDialogOpen(true)
  }

  const handleEditUser = (client: any) => {
    setFormData({
      nombre: client.nombre,
      apellido: client.apellido,
      correo: client.correo,
      telefono: client.telefono || "",
      tipo_documento: client.tipo_documento || "",
      documento: client.documento || "",
    })
    setEditingUserId(client.id)
    setIsEditMode(true)
    setDialogOpen(true)
  }

  const handleDeleteUser = (clientId: number) => {
  axios
    .delete(`${API_URL}/capitalfarmer.co/api/v1/clientes/${clientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
    .then(() => {
      setClients((prev) => prev.filter((client) => client.id !== clientId))
      toast.success("Usuario eliminado correctamente")
    })
    .catch(() => toast.error("Error al eliminar usuario"))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nombre || !formData.apellido || !formData.correo) {
      toast.error("Por favor complete todos los campos obligatorios")
      return
    }

    const dataToSend = {
      ...formData,
      nombre: isRUC ? formData.nombre : capitalizeWords(formData.nombre),
      apellido: isRUC ? "" : capitalizeWords(formData.apellido),
    };

    console.log("JSON a enviar:", dataToSend);

    if (isEditMode && editingUserId) {
      axios
      .put(`${API_URL}/capitalfarmer.co/api/v1/clientes/${editingUserId}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
      .then((res) => {
        setClients((prev) =>
          prev.map((client) => (client.id === editingUserId ? res.data : client))
        );
        toast.success(`${formData.nombre} ${formData.apellido} ha sido actualizado exitosamente`);
      })
      .catch(() => toast.error("Error al actualizar usuario"));
    } else {
      axios
      .post(`${API_URL}/capitalfarmer.co/api/v1/clientes`, {
        ...dataToSend,
        contrasena: "123456"
      }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
      .then((res) => {
        setClients((prev) => [...prev, res.data]);
        
      })
      .catch(() => toast.error("Error al crear usuario"));
    }

    // Resetear el formulario y cerrar el diálogo
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      tipo_documento: "",
      documento: "",
    })
    setIsEditMode(false)
    setEditingUserId(null)
    setDialogOpen(false)
  }

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono?.includes(searchTerm) ||
      client.rol_nombre?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || client.rol_nombre === roleFilter

    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredClients.slice(startIndex, endIndex)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Administrador (AD)":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Asesor Legal Capital (AS)":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Asesor Legal Farmer (AS)":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Asesor Legal Trimex (AS)":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const documentos = [
    { id: 1, nombre: "DNI" },
    { id: 2, nombre: "RUC" },
    { id: 3, nombre: "CE" }
  ];

  const isRUC = formData.tipo_documento === "RUC";

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipo_documento: "",
        documento: "",
      })
      setIsEditMode(false)
      setEditingUserId(null)
    }
    setDialogOpen(open)
  }

  const uniqueRoles = Array.from(
    new Set(clients.map((u) => u.rol_nombre).filter(Boolean))
  );

  const [busquedaLoading, setBusquedaLoading] = useState(false);
    const handleBuscarDocumento = async () => {
    const tipo = formData.tipo_documento; 
    const numero = formData.documento;

    let url = "";
    let body = {};
    if (tipo === "DNI") {
      url = "https://apiperu.dev/api/dni";
      body = { dni: numero };
    } else if (tipo === "RUC") {
      url = "https://apiperu.dev/api/ruc";
      body = { ruc: numero };
    } else {
      // Si no es DNI ni RUC, no hacer nada
      return;
    }

    setBusquedaLoading(true);
    try {
      const res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${APIPERU_TOKEN}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      // Aquí puedes usar res.data para autocompletar campos, mostrar info, etc.
      console.log(res.data);

      if (tipo === "DNI" && res.data.success) {
        setFormData(prev => ({
          ...prev,
          nombre: capitalizeWords(res.data.data.nombres || ""),
          apellido: capitalizeWords(
            `${res.data.data.apellido_paterno || ""} ${res.data.data.apellido_materno || ""}`.trim()
          ),
          direccion: res.data.data.direccion || "",
        }));
      } else if (tipo === "RUC" && res.data.success) {
        setFormData(prev => ({
          ...prev,
          nombre: res.data.data.nombre_o_razon_social || "",
          direccion: res.data.data.direccion_completa || res.data.data.direccion || "",
          apellido: "", // RUC no tiene apellido
        }));
      } else {
        toast.error("No se encontraron datos para el documento ingresado");
      }
      // Ejemplo: setFormData(prev => ({ ...prev, nombre: res.data.data.nombres }));
    } catch (err) {
      alert("No se pudo consultar el documento");
    } finally {
      setBusquedaLoading(false);
    }
  };

  const handleTipoDocumentoChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tipo_documento: value,
      documento: "",
      nombre: "",
      apellido: "",
      direccion: "",
      // agrega aquí otros campos que quieras limpiar
    }));
  };

  function capitalizeWords(str: string) {
    return str
      .toLowerCase()
      .replace(/(^|\s)([a-záéíóúüñ])/giu, (match) => match.toUpperCase());
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
              <p className="text-gray-600 mt-1">Administra los clientes del sistema</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Clientes</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
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
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>Busca y gestiona todos los clientes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <div className="mb-4 text-blue-600">Cargando clientes...</div>}
              {error && <div className="mb-4 text-red-600">{error}</div>}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, apellido, documento, teléfono o correo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los roles</SelectItem>
                    {uniqueRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleCreateUser}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Cliente
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {isEditMode ? "Editar Datos" : "Crear Nuevo Cliente"}
                      </DialogTitle>
                      <DialogDescription>
                        {isEditMode
                          ? "Modifique los campos necesarios para actualizar la información del cliente."
                          : "Complete el formulario para crear un nuevo cliente en el sistema."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        {/* Columna 1: Tipo de documento */}
                        <div className="space-y-2 col-span-2" >
                          <Label htmlFor="tipo"> 
                            Tipo <span className="text-red-500">*</span> 
                          </Label>
                          <Select 
                            value={formData.tipo_documento}
                            onValueChange={handleTipoDocumentoChange}
                            required
                          >
                            <SelectTrigger id="tipo_documento" className="w-full ">
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentos.map((doc) => (
                                <SelectItem key={doc.id} value={doc.nombre}>
                                  {doc.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Columna 2: Número de documento */}
                        <div className="space-y-2 col-span-3">
                          <Label htmlFor="numero_documento">
                            Documento <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="numero_documento"
                            name="documento"
                            placeholder="Ingrese número"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2 col-span-1 flex flex-col items-end">
                          <Label className="invisible">Acción</Label>
                          <Button
                            type="button"
                            className="w-full"
                            onClick={handleBuscarDocumento}
                            disabled={busquedaLoading}
                          >
                            {busquedaLoading ? "Buscando..." : "Buscar"}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`space-y-2 ${isRUC ? "md:col-span-2" : ""}`}>
                          <Label htmlFor="nombre">
                            {isRUC ? <>Razon Social <span className="text-red-500">*</span></> : <>Nombre <span className="text-red-500">*</span></>}
                          </Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            placeholder={isRUC ? "Ingrese razón social" : "Ingrese nombre"}
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        {/* Campo Apellido, solo visible si NO es RUC */}
                        {!isRUC && (
                          <div className="space-y-2">
                            <Label htmlFor="apellido">
                              Apellido <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="apellido"
                              name="apellido"
                              placeholder="Ingrese apellido"
                              value={formData.apellido}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="direccion">Nombre corto</Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          type="text"
                          placeholder="Ingrese nombre corto"
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="correo">
                            Correo Electrónico <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="correo"
                            name="correo"
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            placeholder="987654321"
                            value={formData.telefono}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          type="text"
                          placeholder="Ingrese dirección"
                          onChange={handleChange}
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button className="bg-blue-600" type="submit">
                          {isEditMode ? "Actualizar Usuario" : "Agregar Cliente"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Tipo de documento</TableHead>
                      <TableHead>Numero de documento</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.id}</TableCell>
                        <TableCell>{client.nombre} {client.apellido}</TableCell>
                        <TableCell>{client.correo}</TableCell>
                        <TableCell>{client.telefono}</TableCell>
                        <TableCell>{client.tipo_documento}</TableCell>
                        <TableCell>{client.documento}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(client)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(client.id)}>
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredClients.length)} de {filteredClients.length}{" "}
                usuarios
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
