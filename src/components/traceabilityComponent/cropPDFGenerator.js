// src/components/traceabilityComponent/cropPDFGenerator.js
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";

// --- Función para obtener el logo AGROX en base64 ---
const getLogoBase64 = async () => {
  const asset = Asset.fromModule(require("../../assets/Logo-AGROX-Blanco.png"));
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
};

// --- Función para obtener la fuente CarterOne en base64 ---
const getCarterOneBase64 = async () => {
  const asset = Asset.fromModule(
    require("../../utils/fonts/CarterOne-Regular.ttf")
  );
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
};

// --- Función principal ---
const CropPDFGenerator = async (
  crop,
  activities,
  creatorName = "Usuario no registrado"
) => {
  try {
    const [logoBase64, fontBase64] = await Promise.all([
      getLogoBase64(),
      getCarterOneBase64(),
    ]);
    // ✅ CORREGIDO: añadir "data:" al inicio
    const logoSrc = `data:image/png;base64,${logoBase64}`;
    const fontSrc = `data:font/truetype;charset=utf-8;base64,${fontBase64}`;

    // --- Procesar fecha del cultivo ---
    const cropCreatedAt = crop.createdAt
      ? typeof crop.createdAt === "string"
        ? new Date(crop.createdAt)
        : crop.createdAt instanceof Date
        ? crop.createdAt
        : new Date(crop.createdAt.seconds * 1000)
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
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // --- Ordenar actividades ---
    const sortedActivities = [...activities].sort((a, b) => {
      const dateA = getTimestampFromActivity(a);
      const dateB = getTimestampFromActivity(b);
      return dateA - dateB;
    });

    // --- Obtener imagen de "Documentación adicional" ---
    const docActivity = activities.find(
      (act) => act.name === "Documentación adicional"
    );
    const docImageBase64 = docActivity?.imageBase64 || null;

    // --- Generar filas de la tabla ---
    const activityRows = sortedActivities
      .map((act) => {
        const formattedDate = formatDateFromActivity(act);
        const responsable =
          (act.responsable &&
            typeof act.responsable === "string" &&
            act.responsable.trim()) ||
          creatorName;
        const obs =
          (act.observations &&
            typeof act.observations === "string" &&
            act.observations.trim()) ||
          "Sin observaciones";

        return `
          <tr>
            <td style="border: 1px solid #ddd; padding: 12px 10px; font-size: 13px; font-family: Arial, sans-serif;">${
              act.name || "Actividad"
            }</td>
            <td style="border: 1px solid #ddd; padding: 12px 10px; font-size: 13px; font-family: Arial, sans-serif;">${formattedDate}</td>
            <td style="border: 1px solid #ddd; padding: 12px 10px; font-size: 13px; font-family: Arial, sans-serif;">${responsable}</td>
            <td style="border: 1px solid #ddd; padding: 12px 10px; font-size: 13px; font-family: Arial, sans-serif; word-wrap: break-word; white-space: normal;">${obs}</td>
          </tr>
        `;
      })
      .join("");

    // --- HTML del PDF ---
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @font-face {
              font-family: 'CarterOne-Regular';
              src: url('${fontSrc}') format('truetype');
            }

            body { 
              font-family: Arial, sans-serif; 
              padding: 40px 60px;
              font-size: 12px;
              margin: 0;
              background-color: white;
              position: relative;
            }

            .header { 
              display: flex;
              align-items: center;
              margin-bottom: 25px;
            }
            .title { 
              font-size: 24px;
              color: #2E7D32; 
              font-family: 'CarterOne-Regular', Arial, sans-serif;
              margin: 0;
            }
            .logo-container {
              background-color: #2E7D32;
              padding: 7px 11px;
              display: flex;
              align-items: center;
              min-height: 40px;
              margin-left: auto;
            }
            .logo-img {
              height: 40px;
              width: auto;
              margin-right: 5px;
            }

            .section {
              display: flex;
              gap: 20px;
              margin-bottom: 25px;
            }
            .data-col {
              flex: 1;
            }
            .image-col {
              flex: 0 0 180px;
              display: flex;
              align-items: flex-start;
              justify-content: flex-end;
            }
            .crop-image {
              width: 100%;
              height: 140px;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid #ddd;
            }
            .image-placeholder {
              width: 100%;
              height: 140px;
              background-color: #f5f5f5;
              border: 1px solid #ddd;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #888;
              font-size: 11px;
            }

            .flow { 
              display: flex; 
              flex-wrap: wrap; 
              justify-content: center; 
              gap: 8px;
              margin-bottom: 25px; 
            }
            .flow-step {
              display: flex;
              align-items: center;
              font-size: 17px;
              font-family: Arial, sans-serif;
              white-space: nowrap;
            }

            table { 
              width: 100%; 
              max-width: 900px;
              border-collapse: collapse; 
              margin: 0 auto 25px auto; /* ✅ Centrado */
              border: 2px solid #ddd;
            }
            th { 
              background-color: #2E7D32; 
              color: white; 
              padding: 12px 10px; 
              font-weight: bold; 
              font-size: 14px;
              text-align: center;
              border: 1px solid #ddd;
              font-family: Arial, sans-serif;
            }
            td { 
              padding: 12px 10px; 
              font-size: 13px; 
              border: 1px solid #ddd;
              font-family: Arial, sans-serif;
              word-wrap: break-word;
              white-space: normal;
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

            .data-row {
              margin-bottom: 6px;
              font-family: Arial, sans-serif;
              font-size: 14px;
            }
            .data-label {
              font-weight: bold;
              margin-right: 6px;
            }
            .data-value {
              font-weight: normal;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Trazabilidad de cultivo</div>
            <div class="logo-container">
              <img src="${logoSrc}" class="logo-img" alt="AGROX" />
            </div>
          </div>

          <div class="section">
            <div class="data-col">
              <div class="data-row"><span class="data-label">Finca:</span> <span class="data-value">La Esperanza</span></div>
              <div class="data-row"><span class="data-label">Parcela/Lote:</span> <span class="data-value">Lote 5</span></div>
              <div class="data-row"><span class="data-label">Cultivo:</span> <span class="data-value">${cropType} - ${cropVariety}</span></div>
              <div class="data-row"><span class="data-label">Ciclo agrícola:</span> <span class="data-value">${startDate} - ${endDateStr}</span></div>
              <div class="data-row"><span class="data-label">Fecha de generación:</span> <span class="data-value">${generationDate}</span></div>
            </div>
            <div class="image-col">
              ${
                docImageBase64
                  ? `<img src="data:image/jpeg;base64,${docImageBase64}" class="crop-image" />`
                  : `<div class="image-placeholder">Sin imagen</div>`
              }
            </div>
          </div>

          <div class="flow">
            <div class="flow-step"><span>●</span><span>Preparación</span><span>→</span></div>
            <div class="flow-step"><span>🌱</span><span>Siembra</span><span>→</span></div>
            <div class="flow-step"><span>💧</span><span>Riego</span><span>→</span></div>
            <div class="flow-step"><span>🌿</span><span>Fertilización</span><span>→</span></div>
            <div class="flow-step"><span>🛡️</span><span>Fitosanitario</span><span>→</span></div>
            <div class="flow-step"><span>🔍</span><span>Monitoreo</span><span>→</span></div>
            <div class="flow-step"><span>🌾</span><span>Cosecha</span><span>→</span></div>
            <div class="flow-step"><span>📦</span><span>Postcosecha</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Etapa / Actividad</th>
                <th style="width: 15%;">Fecha</th>
                <th style="width: 15%;">Responsable</th>
                <th style="width: 30%;">Detalles técnicos / Observaciones</th>
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

    // --- Generar y compartir PDF ---
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    const cleanCropName = crop.cropName
      .replace(/[/\\?%*:|"<>]/g, "_")
      .substring(0, 50);
    const newFileName = `Trazabilidad del cultivo ${cleanCropName}.pdf`;
    const newFileUri = `${FileSystem.documentDirectory}${newFileName}`;
    await FileSystem.moveAsync({ from: uri, to: newFileUri });
    await Sharing.shareAsync(newFileUri);
    return newFileUri;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("No se pudo generar el PDF.");
  }
};

// --- Funciones auxiliares ---
const getTimestampFromActivity = (activity) => {
  if (!activity.createdAt) return 0;
  if (activity.createdAt.seconds !== undefined)
    return activity.createdAt.seconds * 1000;
  if (typeof activity.createdAt === "string")
    return new Date(activity.createdAt).getTime();
  if (activity.createdAt instanceof Date) return activity.createdAt.getTime();
  return 0;
};

const formatDateFromActivity = (activity) => {
  const timestamp = getTimestampFromActivity(activity);
  if (timestamp === 0) return "Sin fecha";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Fecha inválida";
    const day = date.getDate();
    const month = date
      .toLocaleString("es-ES", { month: "short" })
      .replace(".", "");
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    console.warn("Error al formatear fecha:", activity.createdAt);
    return "Error en fecha";
  }
};

export default CropPDFGenerator;
