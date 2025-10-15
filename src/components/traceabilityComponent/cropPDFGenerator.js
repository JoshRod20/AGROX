// src/components/traceabilityComponent/cropPDFGenerator.js
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const CropPDFGenerator = async (crop, activities) => {
  try {
    // --- 1. Validar y preparar la fecha de creación del CULTIVO ---
    const cropCreatedAt = crop.createdAt 
      ? (typeof crop.createdAt === 'string' 
          ? new Date(crop.createdAt) 
          : crop.createdAt instanceof Date 
            ? crop.createdAt 
            : new Date(crop.createdAt.seconds * 1000)) // Soporte para Timestamp de Firebase
      : new Date();

    const cropNameParts = crop.cropName.split(" - ");
    const cropType = cropNameParts[0] || "Sin nombre";
    const cropVariety = cropNameParts[1] || "Sin variedad";

    const startDate = cropCreatedAt.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    const endDate = new Date(cropCreatedAt);
    endDate.setMonth(endDate.getMonth() + 3);
    const endDateStr = endDate.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });

    const generationDate = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // --- 2. Ordenar actividades por fecha ---
    const sortedActivities = [...activities].sort((a, b) => {
      const dateA = getTimestampFromActivity(a);
      const dateB = getTimestampFromActivity(b);
      return dateA - dateB;
    });

    // --- 3. Generar filas de la tabla ---
    const activityRows = sortedActivities.map(act => {
      const formattedDate = formatDateFromActivity(act);
      return `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px; font-family: Arial, sans-serif;">${act.name || "Actividad"}</td>
          <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px; font-family: Arial, sans-serif;">${formattedDate}</td>
          <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px; font-family: Arial, sans-serif;">Juan Pérez</td>
          <td style="border: 1px solid #ddd; padding: 8px; font-size: 12px; font-family: Arial, sans-serif;">${act.notes || "Sin observaciones"}</td>
        </tr>
      `;
    }).join('');

    // --- 4. Crear el HTML para el PDF ---
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              padding: 40px 60px; /* Aumentamos los márgenes para que se vea más centrado */
              font-size: 12px; /* Tamaño de fuente general aumentado */
              margin: 0;
              background-color: white;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 25px; 
              align-items: center; 
            }
            .title { 
              font-size: 24px; /* Título más grande */
              color: #2E7D32; 
              font-weight: bold; 
              font-family: 'CarterOne', Arial, sans-serif;
            }
            .section { 
              margin-bottom: 25px; 
            }
            .label { 
              font-weight: bold; 
              margin-bottom: 5px; 
              font-size: 14px; /* Etiquetas más grandes */
              font-family: Arial, sans-serif;
            }
            .flow { 
              display: flex; 
              flex-wrap: wrap; 
              margin-bottom: 25px; 
              align-items: center; 
            }
            .flow span { 
              margin-right: 5px; 
              font-size: 12px; 
              font-family: Arial, sans-serif;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 25px; 
              border: 2px solid #ddd; /* Borde más grueso para la tabla */
            }
            th { 
              background-color: #2E7D32; 
              color: white; 
              padding: 10px 8px; 
              font-weight: bold; 
              font-size: 14px; /* Encabezados más grandes */
              text-align: left;
              border: 1px solid #ddd;
              font-family: Arial, sans-serif;
            }
            td { 
              padding: 10px 8px; 
              font-size: 12px; 
              border: 1px solid #ddd;
              font-family: Arial, sans-serif;
            }
            .footer { 
              position: absolute; 
              bottom: 30px; 
              left: 60px; 
              right: 60px; 
              display: flex; 
              justify-content: space-between; 
              font-size: 10px; 
              color: #666; 
              font-family: Arial, sans-serif;
            }
            /* Estilos específicos para las columnas */
            .col-etapa { width: 25%; }
            .col-fecha { width: 15%; }
            .col-responsable { width: 15%; }
            .col-detalles { width: 45%; }

            /* Logo AGROX */
            .logo-container {
              background-color: #2E7D32;
              padding: 10px 15px;
              border-radius: 5px;
              display: flex;
              align-items: center;
            }
            .logo-text {
              color: white;
              font-size: 18px;
              font-weight: bold;
              font-family: 'CarterOne', Arial, sans-serif;
            }
            .logo-icon {
              width: 20px;
              height: 20px;
              margin-right: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Trazabilidad de cultivo</div>
            <!-- Logo AGROX -->
            <div class="logo-container">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICA8cGF0aCBkPSJNMTAgMGwtNSAxMC01LTEwIDEwIDB6IiBmaWxsPSIjRkZGIi8+CiAgPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+" class="logo-icon" />
              <span class="logo-text">AGROX</span>
            </div>
          </div>

          <div class="section">
            <div class="label">Finca: La Esperanza</div>
            <div class="label">Parcela/Lote: Lote 5</div>
            <div class="label">Cultivo: ${cropType} - ${cropVariety}</div>
            <div class="label">Ciclo agrícola: ${startDate} - ${endDateStr}</div>
            <div class="label">Fecha de generación: ${generationDate}</div>
          </div>

          <div class="flow">
            <span>●</span><span>Preparación</span><span>→</span>
            <span>🌱</span><span>Siembra</span><span>→</span>
            <span>💧</span><span>Riego</span><span>→</span>
            <span>🌿</span><span>Fertilización</span><span>→</span>
            <span>🛡️</span><span>Fitosanitario</span><span>→</span>
            <span>🔍</span><span>Monitoreo</span><span>→</span>
            <span>🌾</span><span>Cosecha</span><span>→</span>
            <span>📦</span><span>Postcosecha</span>
          </div>

          <table>
            <thead>
              <tr>
                <th class="col-etapa">Etapa / Actividad</th>
                <th class="col-fecha">Fecha</th>
                <th class="col-responsable">Responsable</th>
                <th class="col-detalles">Detalles técnicos / Observaciones</th>
              </tr>
            </thead>
            <tbody>
              ${activityRows}
            </tbody>
          </table>

          <div class="footer">
            <div>Generado por AGROX - Innovación para el productor agrícola.</div>
            <div>Página 1 de 1</div>
          </div>
        </body>
      </html>
    `;

    // --- 5. Generar el PDF ---
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    // --- 6. Crear el nuevo nombre de archivo ---
    const cleanCropName = crop.cropName
      .replace(/[/\\?%*:|"<>]/g, '_')
      .substring(0, 50);
    const newFileName = `Trazabilidad del cultivo ${cleanCropName}.pdf`;
    const newFileUri = `${FileSystem.documentDirectory}${newFileName}`;

    // --- 7. Mover/renombrar el archivo ---
    await FileSystem.moveAsync({
      from: uri,
      to: newFileUri,
    });

    // --- 8. Compartir el PDF con el nombre correcto ---
    await Sharing.shareAsync(newFileUri);

    return newFileUri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('No se pudo generar el PDF.');
  }
};

// --- Funciones auxiliares para manejar fechas de Firebase ---
const getTimestampFromActivity = (activity) => {
  if (!activity.createdAt) return 0;

  // Caso 1: Es un objeto Timestamp de Firebase { seconds, nanoseconds }
  if (activity.createdAt.seconds !== undefined) {
    return activity.createdAt.seconds * 1000;
  }

  // Caso 2: Es una cadena de fecha ISO
  if (typeof activity.createdAt === 'string') {
    return new Date(activity.createdAt).getTime();
  }

  // Caso 3: Ya es un objeto Date
  if (activity.createdAt instanceof Date) {
    return activity.createdAt.getTime();
  }

  return 0;
};

const formatDateFromActivity = (activity) => {
  const timestamp = getTimestampFromActivity(activity);
  if (timestamp === 0) {
    return "Sin fecha";
  }
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return "Fecha inválida";
    }
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.warn("Error al formatear fecha:", activity.createdAt);
    return "Error en fecha";
  }
};

export default CropPDFGenerator;