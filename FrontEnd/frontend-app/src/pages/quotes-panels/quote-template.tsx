"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface QuotationData {
  codigoCotizacion?: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
  };
  fechaVencimiento: Date | undefined;
  servicio: string;
  precio: string;
  comentarios: string;
  queHaremos: string;
  queNoIncluye: string;
  pagosDivididos: Array<{
    nombre: string;
    porcentaje: number;
    cantidad: string;
    fechaVencimiento: string;
  }>;
}

export default function QuotesTemplate({ quotation, pagosDivididos }: { quotation: QuotationData, pagosDivididos: boolean }) {
  
  const fechaActual = new Date();
  const fechaActualFormateada = format(fechaActual, "d 'de' MMMM 'de' yyyy", { locale: es });
  
  const fechaVencimientoFormateada = quotation.fechaVencimiento
    ? format(new Date(quotation.fechaVencimiento), "d 'de' MMMM 'de' yyyy", { locale: es })
    : "Fecha no seleccionada";
  
  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white rounded-none ">
          <CardContent className="p-6 sm:p-8 md:p-12">
            <p className="text-sm text-blue-600 mb-2 text-center">
              {quotation.codigoCotizacion || "COT-XXXXXXFCT"}
            </p>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Cotización de servicios legales
              </h1>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8">
              <div className="space-y-2">
                <h2 className="font-semibold text-gray-800 mb-4">
                  Cliente: {quotation.cliente.nombre} 
                </h2>
                <p className="text-sm text-blue-600">{quotation.cliente.telefono}</p>
                <p className="text-sm text-blue-600">{quotation.cliente.email}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Creación del presupuesto: {fechaActualFormateada}</p>
                  <p>Caducidad del presupuesto: {fechaVencimientoFormateada}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">
                ¿Que Incluye el servicio?
              </h2>
            </div>

            {/* Services Table */}
            <div className="mb-8 overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4">Servicios incluidos</h3>
              <Table className="table-auto border-collapse border border-gray-300">
                {/* Encabezado de la tabla */}
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="text-left">N°</TableHead>
                    <TableHead className="text-center">Servicio</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                {/* Cuerpo de la tabla */}
                <TableBody>
                  <TableRow>
                    <TableCell className="text-left">1</TableCell>
                    <TableCell className="text-center">{quotation.servicio}</TableCell>
                    <TableCell className="text-right">S/{quotation.precio}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Payment Schedule */}
            {pagosDivididos && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Calendario de pagos</h3>
                <div className="overflow-x-auto">
                  <Table className="table-auto border-collapse border border-gray-300">
                    {/* Encabezado de la tabla */}
                    <TableHeader>
                      <TableRow className="bg-gray-100">
                        <TableHead className="text-left">Nombre</TableHead>
                        <TableHead className="text-left">Pendiente</TableHead>
                        <TableHead className="text-right">Importe</TableHead>
                      </TableRow>
                    </TableHeader>
                    {/* Cuerpo de la tabla */}
                    <TableBody>
                      {quotation.pagosDivididos.map((pago, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-left">{pago.nombre}</TableCell>
                          <TableCell className="text-left">{pago.fechaVencimiento || "Sin fecha"}</TableCell>
                          <TableCell className="text-right">{pago.cantidad || "$0.00"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-6">
              <div className="border rounded-md p-4">
                <h4 className="font-semibold text-blue-600 mb-2">¿Qué haremos por usted?</h4>
                <Textarea
                  className="min-h-[80px] resize-none border-0 p-0 text-sm"
                  value={quotation.queHaremos}
                  readOnly
                />
              </div>
            </div>

            {/* Purchase Conditions */}
            <div className="mb-8">
              <div className="border rounded-md p-4">
                <h4 className="font-semibold text-blue-600 mb-2">¿Qué no icluye la cotización?</h4>
                <Textarea
                  className="min-h-[80px] resize-none border-0 p-0 text-sm"
                  value={quotation.queNoIncluye}
                  readOnly
                />
              </div>
            </div>

            {/* Signatures Section */}
            {/* <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Firma</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="border-b border-gray-300 pb-8 mb-2"></div>
                  <p className="text-sm text-center">Firma</p>
                </div>
                <div className="space-y-2">
                  <div className="border-b border-gray-300 pb-8 mb-2"></div>
                  <p className="text-sm text-center">Fecha</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="border-b border-gray-300 pb-8 mb-2"></div>
                <p className="text-sm text-center">Nombre impreso</p>
              </div>
            </div> */}
            <div className="mb-8">
              <p className="text-sm text-center">Atentamente:</p>
              <h3 className="text-lg font-semibold text-center mb-4">FARMER & CAPITAL ABOGADOS</h3>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
