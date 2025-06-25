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

  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/capitalfarmer.co/api/v1/cotizaciones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          const data = res.data
          const fechaVencimiento = data.fecha_vencimiento
            ? parseDateAsLocal(data.fecha_vencimiento)
            : undefined
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
            pagosDivididos: data.pagos_divididos || [
              { nombre: "Pago 1", porcentaje: 50, cantidad: "", fechaVencimiento: "Al recibir" },
              { nombre: "Pago 2", porcentaje: 50, cantidad: "", fechaVencimiento: "" },
            ],
          })
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
              pagosDivididos={cotizacion.pagosDivididos && cotizacion.pagosDivididos.length > 0}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">Cargando cotización...</div>
        )}
      </div>
    </div>
  )
}