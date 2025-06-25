"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  Download,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import html2pdf from 'html2pdf.js';
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

  const datosCotizacion = cotizacion && {
    codigoCotizacion: cotizacion.codigoCotizacion,
    nombreCliente: cotizacion.cliente.nombre,
    telefonoCliente: cotizacion.cliente.telefono,
    emailCliente: cotizacion.cliente.email,
    fechaCreacion: "25 de junio de 2025", // O usa una fecha real si la tienes
    fechaCaducidad: cotizacion.fechaVencimiento,
    servicioNombre: cotizacion.servicio,
    servicioTotal: cotizacion.precio,
    servicioDescripcion: cotizacion.queHaremos,
    noIncluye: cotizacion.queNoIncluye
  };

  const generarPdf = async () => {
    if (!datosCotizacion) return;
    const response = await fetch('/html-templates/basic-quotation-template.html');
    let plantillaHtml = await response.text();

    Object.entries(datosCotizacion).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key.toUpperCase()}}}`, "g");
      plantillaHtml = plantillaHtml.replace(regex, String(value ?? ""));
    });

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = plantillaHtml;
    document.body.appendChild(tempDiv);

    // Espera 100ms para asegurar que el DOM se renderice
    await new Promise(r => setTimeout(r, 100));

    const opciones = {
      margin: 1,
      filename: 'cotizacion-servicios-legales.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    console.log(plantillaHtml);

    await html2pdf().from(tempDiv).set(opciones).save();
    document.body.removeChild(tempDiv);

  };
  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-gray-50 overflow-y-auto">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Cotización de Servicios Legales</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={generarPdf}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Descargar
              </Button>
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