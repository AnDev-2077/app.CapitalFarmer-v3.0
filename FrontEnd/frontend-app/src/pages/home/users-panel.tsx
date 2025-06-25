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
import { Badge } from "@/components/ui/badge"
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
  const [users, setUsers] = useState<any[]>([])
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
    rol_id: "",
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [roles, setRoles] = useState<{ id: number; nombre: string }[]>([])

  const { token } = useAuth();

  useEffect(() => {
    setLoading(true)
    axios
      .get("http://127.0.0.1:8000/capitalfarmer.co/api/v1/usuarios" , {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      .then((res) => setUsers(res.data))
      .catch(() => setError("Error al cargar usuarios"))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/capitalfarmer.co/api/v1/roles", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      .then((res) => setRoles(res.data))
      .catch(() => setRoles([]))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRolChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rol_id: value }))
  }

  const handleCreateUser = () => {
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      rol_id: "",
    })
    setEditingUserId(null)
    setIsEditMode(false)
    setDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      telefono: user.telefono || "",
      rol_id: user.rol_id?.toString() || "",
    })
    setEditingUserId(user.id)
    setIsEditMode(true)
    setDialogOpen(true)
  }

  const handleDeleteUser = (userId: number) => {
  axios
    .delete(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/usuarios/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
    .then(() => {
      setUsers((prev) => prev.filter((user) => user.id !== userId))
      toast.success("Usuario eliminado correctamente")
    })
    .catch(() => toast.error("Error al eliminar usuario"))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.rol_id) {
      toast.error("Por favor complete todos los campos obligatorios")
      return
    }

    if (isEditMode && editingUserId) {
      axios
      .put(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/usuarios/${editingUserId}`, { ...formData }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      .then((res) => {
        setUsers((prev) =>
          prev.map((user) => (user.id === editingUserId ? res.data : user))
        );
        toast.success(`${formData.nombre} ${formData.apellido} ha sido actualizado exitosamente`);
      })
      .catch(() => toast.error("Error al actualizar usuario"));
    } else {
      axios
      .post("http://127.0.0.1:8000/capitalfarmer.co/api/v1/registro", {
        ...formData,
        contrasena: "123456"
      }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      .then((res) => {
        setUsers((prev) => [...prev, res.data]);
        toast.success(`${formData.nombre} ${formData.apellido} ha sido creado exitosamente como ${formData.rol_id}`);
      })
      .catch(() => toast.error("Error al crear usuario"));
    }

    // Resetear el formulario y cerrar el diálogo
    setFormData({
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      rol_id: "",
    })
    setIsEditMode(false)
    setEditingUserId(null)
    setDialogOpen(false)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.telefono?.includes(searchTerm) ||
      user.rol_nombre?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.rol_nombre === roleFilter

    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

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

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        rol_id: "",
      })
      setIsEditMode(false)
      setEditingUserId(null)
    }
    setDialogOpen(open)
  }

  const uniqueRoles = Array.from(
    new Set(users.map((u) => u.rol_nombre).filter(Boolean))
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
              <p className="text-gray-600 mt-1">Administra los usuarios del sistema jurídico</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
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
              <CardTitle>Lista de Usuarios</CardTitle>
              <CardDescription>Busca y gestiona todos los usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {loading && <div className="mb-4 text-blue-600">Cargando usuarios...</div>}
              {error && <div className="mb-4 text-red-600">{error}</div>}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, apellido, correo, teléfono o rol..."
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
                      Agregar Usuario
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {isEditMode ? "Editar Datos" : "Crear Nuevo Usuario"}
                      </DialogTitle>
                      <DialogDescription>
                        {isEditMode
                          ? "Modifique los campos necesarios para actualizar la información del usuario."
                          : "Complete el formulario para crear un nuevo usuario en el sistema."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">
                            Nombre <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            placeholder="Ingrese nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </div>
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
                      </div>

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

                      <div className="space-y-2">
                        <Label htmlFor="rol">
                          Rol <span className="text-red-500">*</span>
                        </Label>
                        <Select value={formData.rol_id} onValueChange={handleRolChange} required>
                          <SelectTrigger id="rol">
                            <SelectValue placeholder="Seleccione un rol" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((rol) => (
                              <SelectItem key={rol.id} value={rol.id.toString()}>
                                {rol.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button className="bg-blue-600" type="submit">
                          {isEditMode ? "Actualizar Usuario" : "Crear Usuario"}
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
                      <TableHead>Apellido</TableHead>
                      <TableHead>Correo</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.nombre}</TableCell>
                        <TableCell>{user.apellido}</TableCell>
                        <TableCell>{user.correo}</TableCell>
                        <TableCell>{user.telefono}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.rol_nombre)}>{user.rol_nombre}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length}{" "}
                usuarios
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
