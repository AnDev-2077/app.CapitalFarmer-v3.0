import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from "date-fns";
import { es } from "date-fns/locale";

// --- Registrar fuentes (opcional, pero recomendado para máxima fidelidad) ---
// Para este ejemplo, usaremos fuentes estándar como Helvetica.
// Si quisieras usar una fuente específica como "Roboto" o "Lato", descomenta lo siguiente:
// Font.register({
//   family: 'Roboto',
//   fonts: [
//     { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
//     { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
//   ],
// });


// --- Definición de Estilos ---
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
  },
  header: {
    textAlign: 'right',
    color: '#a0a0a0',
    fontSize: 9,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50', // Un azul oscuro casi negro
    marginBottom: 25,
  },
  clientInfoContainer: {
    marginBottom: 30,
  },
  clientInfoText: {
    marginBottom: 4,
    fontSize: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3498db', // Azul brillante para los títulos de sección
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 10,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 3,
  },
  // Estilos de la tabla
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  tableColHeaderService: {
    width: "60%",
    borderStyle: "solid",
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  tableColHeaderTotal: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  tableHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#555555',
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 8,
  },
  tableColService: {
    width: "60%",
    borderStyle: "solid",
    borderColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#555',
  },
  footerText: {
    fontSize: 9,
    marginBottom: 3,
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  }
});

function formateaFecha(fecha: Date | undefined) {
  return fecha ? format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es }) : "Fecha no seleccionada";
}
// --- Componente del Documento PDF ---
const QuotePDF = ({ cotizacion }: { cotizacion: any }) => {
    console.log("basic template recibe cotizacion:", cotizacion);
return (     
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabecera */}
      <Text style={styles.header}>{cotizacion.codigoCotizacion}</Text>
      
      {/* Título Principal */}
      <Text style={styles.title}>Cotización de servicios legales</Text>
      
      {/* Información del Cliente */}
      <View style={styles.clientInfoContainer}>
        <Text style={styles.clientInfoText}>Cliente: {cotizacion.cliente.nombre}</Text>
        <Text style={styles.clientInfoText}>{cotizacion.cliente.telefono}</Text>
        <Text style={styles.clientInfoText}>{cotizacion.cliente.email}</Text>
        <Text style={{ ...styles.clientInfoText, marginTop: 10, fontSize: 9, color: '#888' }}>
          Creación del presupuesto:
        </Text>
        <Text style={{ ...styles.clientInfoText, fontSize: 9, color: '#888' }}>
          Caducidad del presupuesto: {formateaFecha(cotizacion.fechaVencimiento)}
        </Text>
      </View>
      
      {/* Sección: Servicios Incluidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Que incluye el servicio?</Text>
        <Text style={{ fontSize: 11, marginBottom: 10 }}>Servicios incluidos</Text>
        
        {/* Tabla de Servicios */}
        <View style={styles.table}>
          {/* Cabecera de la tabla */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableHeader}>N°</Text>
            </View>
            <View style={styles.tableColHeaderService}>
              <Text style={styles.tableHeader}>Servicio</Text>
            </View>
            <View style={styles.tableColHeaderTotal}>
              <Text style={styles.tableHeader}>Total</Text>
            </View>
          </View>
          {/* Fila de datos */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>1</Text>
            </View>
            <View style={styles.tableColService}>
              <Text style={styles.tableCell}>{cotizacion.servicio}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>S/{cotizacion.precio}</Text>
            </View>
          </View>
        </View>
      </View>

      
      {cotizacion.pagosDivididos && cotizacion.pagosDivididos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calendario de pagos</Text>
          <View style={styles.table}>
            {/* Cabecera de la tabla */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}><Text style={styles.tableHeader}>Nombre</Text></View>
              <View style={styles.tableColHeaderService}><Text style={styles.tableHeader}>Pendiente</Text></View>
              <View style={styles.tableColHeaderTotal}><Text style={styles.tableHeader}>Importe</Text></View>
            </View>
            {/* Filas de pagos */}
            {cotizacion.pagosDivididos.map((pago: any, idx: number) => (
              <View style={styles.tableRow} key={idx}>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{pago.nombre}</Text></View>
                <View style={styles.tableColService}><Text style={styles.tableCell}>{pago.fechaVencimiento || "Sin fecha"}</Text></View>
                <View style={styles.tableCol}><Text style={styles.tableCell}>{pago.cantidad || "$0.00"}</Text></View>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Sección: ¿Qué haremos por usted? */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Qué haremos por usted?</Text>
        <View style={styles.sectionContent}>
          <Text>{cotizacion.queHaremos}</Text>
        </View>
      </View>
      
      {/* Sección: ¿Qué no incluye la cotización? */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Qué no icluye la cotización?</Text>
        <View style={styles.sectionContent}>
          <Text>{cotizacion.queNoIncluye}</Text>
        </View>
      </View>
      
      {/* Pie de Página */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>Atentamente:</Text>
        <Text style={styles.footerBrand}>FARMER & CAPITAL ABOGADOS</Text>
      </View>
    </Page>
  </Document>
  );

};

export default QuotePDF;