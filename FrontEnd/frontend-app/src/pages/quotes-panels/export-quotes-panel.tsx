"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import QuoteTemplate from "@/pages/quotes-panels/quote-template"
import { useAuth } from "@/context/AuthContext"
// Función para parsear fecha como local (igual que en edición)
function parseDateAsLocal(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

export default function ExportQuotesPanel() {
  const { token } = useAuth()
  const { id } = useParams()
  const [cotizacion, setCotizacion] = useState<any>(null)
  const [pagosDivididos, setPagosDivididos] = useState(false)

    useEffect(() => {
      if (id) {
        axios.get(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones/${id}/con-cuotas`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
          .then(res => {
            const data = res.data
            const fechaVencimiento = data.fecha_vencimiento
              ? parseDateAsLocal(data.fecha_vencimiento)
              : undefined
            // Mapear cuotas si existen
            const cuotas = (data.cuotas || []).map((cuota: any) => ({
              nombre: cuota.nombre_cuota,
              porcentaje: cuota.porcentaje,
              cantidad: cuota.monto.toString(),
              fechaVencimiento: cuota.fecha_vencimiento || "",
            }))
            setCotizacion({
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