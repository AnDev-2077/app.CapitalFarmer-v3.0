"use client"

import { ChevronLeft, ExternalLink, MoreHorizontal, Copy, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"


export default function QuotationDetailPanel() {
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false)
  
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/home/quotes" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-4 h-4" />
              Cotizaciones
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Funeraria</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              Propietario: <span className="font-medium text-gray-900">Carlos ICE</span>
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Acciones
                  <MoreHorizontal className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Vista previa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copiar enlace
            </Button>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Ver cotización
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-2">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow">
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <Button variant="secondary" size="sm">
                    Ver cotización
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Codigo de cotización</h3>
                      <p className="text-sm font-mono text-gray-900">COT-51415KFCT</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-500 text-white text-xs">CJ</AvatarFallback>
                        </Avatar>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Carlos Jeff
                          <ExternalLink className="w-3 h-3 ml-1 inline" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Valor de la cotización</h3>
                      <p className="text-sm font-semibold text-gray-900">S/2000,00</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Empresa</h3>
                      <p className="text-sm text-gray-900">-</p>
                    </div>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de vencimiento</h3>
                      <p className="text-sm text-gray-900">15/09/2025</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Negocio</h3>
                      <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Funeraria
                        <ExternalLink className="w-3 h-3 ml-1 inline" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={() => setIsDetailsPanelOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Details Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white border-l shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isDetailsPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Detalles</h2>
          <button
            onClick={() => setIsDetailsPanelOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-6 h-full overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Título</h3>
              <p className="text-gray-900 font-medium">Funeraria</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Estado</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-900">Publicados</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Propietario</h3>
              <p className="text-gray-900">Carlos ICE</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Número de cotización</h3>
              <p className="text-gray-900 font-mono text-sm">#20250617-004214283</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Valor de la cotización</h3>
              <p className="text-gray-900 font-semibold">2000,00 US$</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de creación</h3>
              <p className="text-gray-900">17/06/2025</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de publicación</h3>
              <p className="text-gray-900">17/06/2025</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha de vencimiento</h3>
              <p className="text-gray-900">15/09/2025</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Cliente</h3>
              <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium">
                Carlos Jeff
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </a>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Empresa</h3>
              <p className="text-gray-900">-</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Negocio</h3>
              <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium">
                Funeraria
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </a>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Plantilla</h3>
              <a href="#" className="text-blue-600 hover:text-blue-800 underline font-medium">
                Default Basic
                <ExternalLink className="w-3 h-3 ml-1 inline" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isDetailsPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsDetailsPanelOpen(false)} />
      )}
    </div>
  )
}
