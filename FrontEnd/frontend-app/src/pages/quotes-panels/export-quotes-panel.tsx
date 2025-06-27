"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import {
  Download,
  SquarePen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import QuoteTemplate from "@/pages/quotes-panels/quote-template"
import { useAuth } from "@/context/AuthContext"
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePDF from '@/pages/quotes-panels/templates/basic-pdf-template';
function parseDateAsLocal(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

export default function ExportQuotesPanel() {
  const { token } = useAuth()
  const { id } = useParams()
  const [cotizacion, setCotizacion] = useState<any>(null)
  const [pagosDivididos, setPagosDivididos] = useState(false)
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (id) {
      axios.get(`${API_URL}/capitalfarmer.co/api/v1/cotizaciones/${id}/con-cuotas`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })
        .then(res => {
          const data = res.data
          const fechaVencimiento = data.fecha_vencimiento
            ? parseDateAsLocal(data.fecha_vencimiento)
            : undefined
          // Mapear cuotas si existen
          const cuotas = (data.cuotas || []).map((cuota: any) => ({
            id: cuota.id,
            nombre: cuota.nombre_cuota,
            porcentaje: cuota.porcentaje,
            cantidad: cuota.monto.toString(),
            fechaVencimiento: cuota.fecha_vencimiento || "",
          }))
          setCotizacion({
            id: data.id,
            codigoCotizacion: data.codigo_cotizacion || "",
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
          })
          setPagosDivididos(cuotas.length > 0)
        })
        .catch(() => alert("Error al cargar la cotización"))
    }
  }, [id, token])

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 overflow-y-auto">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Cotización de Servicios Legales</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/home/quotes/edit/${cotizacion.id}`)}>
                <SquarePen className="h-4 w-4 mr-2"/>
                Editar
              </Button>
              {cotizacion && cotizacion.cliente && cotizacion.servicio && (
                <PDFDownloadLink
                  document={<QuotePDF cotizacion={cotizacion} />}
                  fileName={`${cotizacion.codigoCotizacion}_${cotizacion.cliente.nombre}.pdf`}
                  style={{ textDecoration: 'none' }}
                >
                  {({ loading, error }) => (
                    <Button variant="outline" size="sm" disabled={loading || !!error}>
                      <Download className="h-4 w-4 mr-2" />
                      {loading
                        ? 'Generando PDF...'
                        : error
                          ? 'Error al generar PDF'
                          : 'Descargar'}
                    </Button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div >
        {cotizacion ? (
          <div id="quotation-pdf">
            <QuoteTemplate
              quotation={cotizacion}
              pagosDivididos={pagosDivididos}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">Cargando cotización...</div>
        )}
      </div>
    </div>
  )
}