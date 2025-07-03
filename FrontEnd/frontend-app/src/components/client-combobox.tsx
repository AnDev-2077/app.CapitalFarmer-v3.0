"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/context/AuthContext";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type cliente = {
  id: number
  nombre: string
  apellido: string
  correo: string
  telefono: string
}

interface ComboboxProps {
  value?: cliente | null
  onChange?: (cliente: cliente) => void
}

export function Combobox({value, onChange }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [clientes, setClientes] = React.useState<cliente[]>([])
  const [search, setSearch] = React.useState("")
  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const { token } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  React.useEffect(() => {
    axios.get(`${API_URL}/capitalfarmer.co/api/v1/clientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })
      .then(res => setClientes(res.data))
      .catch(() => setClientes([]))
  }, [API_URL, token])

  const filtered = clientes.filter(
    c =>
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
      (c.correo || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[580px] justify-between"
        >
          {selectedId
            ? (() => {
                const cliente = clientes.find(c => c.id === selectedId)
                return cliente
                  ? `${cliente.nombre} ${cliente.apellido}`
                  : "Seleccione cliente..."
              })()
            : "Seleccione cliente..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[580px] p-0">
        <Command>
            <CommandInput
                placeholder="Buscar cliente..."
                value={search}
                onValueChange={setSearch}
            />

            <div className="max-h-72">
                <CommandList>
                    <CommandEmpty>No se encontró cliente</CommandEmpty>
                    <CommandGroup>
                    {filtered.map((cliente) => (
                        <CommandItem
                        key={cliente.id}
                        value={cliente.id.toString()}
                        onSelect={() => {
                            setSelectedId(cliente.id)
                            setOpen(false)
                            if (onChange) onChange(cliente)
                        }}
                        >
                        <CheckIcon
                            className={cn(
                            "mr-2 h-4 w-4",
                            selectedId === cliente.id ? "opacity-100" : "opacity-0"
                            )}
                        />
                        <div>
                            <div className="font-medium">{cliente.nombre} {cliente.apellido}</div>
                            <div className="text-xs text-gray-500">{cliente.correo}</div>
                        </div>
                        </CommandItem>
                    ))}
                    </CommandGroup>

                </CommandList>
            </div>
        </Command>
        <div className="border-t mt-1 sticky bottom-0">
            {/* <button
                type="button"
                className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50"
                // Aquí puedes abrir un modal para agregar cliente
                onClick={() => alert("Agregar nuevo cliente")}
            >
            + Agregar nuevo cliente
            </button> */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                  <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-name">Name</Label>
                    <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="sheet-demo-username">Username</Label>
                    <Input id="sheet-demo-username" defaultValue="@peduarte" />
                  </div>
                </div>
                <SheetFooter>
                  <Button type="submit">Save changes</Button>
                  <SheetClose asChild>
                    <Button variant="outline">Close</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
        </div>
      </PopoverContent>
    </Popover>
  )
}