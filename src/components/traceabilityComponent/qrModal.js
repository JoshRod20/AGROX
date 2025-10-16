// src/components/traceabilityComponent/QRModal.js

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import qrModalStyle from "../../styles/traceabilityStyle/qrModalStyle";

// Servicios
import { storage } from "../../services/database"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CropPDFGenerator from "../../components/traceabilityComponent/cropPDFGenerator";
import * as FileSystem from "expo-file-system";
import { getCropActivities } from "../../services/activitiesService";

const { width } = Dimensions.get("window");

const QRModal = ({ visible, onClose, crop }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para subir PDF a Storage y obtener URL pública
  const uploadPDFToStorage = async (localUri, cropId) => {
    try {
      const response = await fetch(localUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `traceability_pdfs/${cropId}.pdf`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading PDF to Storage:", error);
      throw new Error("No se pudo subir el PDF.");
    }
  };

  // Generar PDF + subir + obtener URL
  const generateAndUploadPDF = async () => {
    if (!crop?.id) return null;

    try {
      // Obtener actividades del cultivo
      const activities = await getCropActivities(crop.id);
      const filteredActs = activities.filter((a) => a.name && a.createdAt);

      // Generar PDF (modificamos CropPDFGenerator para que NO comparta)
      const pdfUri = await generatePDFOnly(crop, filteredActs);

      // Subir a Firebase Storage
      const publicUrl = await uploadPDFToStorage(pdfUri, crop.id);
      return publicUrl;
    } catch (error) {
      console.error("Error in generateAndUploadPDF:", error);
      Alert.alert("Error", "No se pudo generar o subir el informe de trazabilidad.");
      return null;
    }
  };

  // Nueva versión de CropPDFGenerator que SOLO genera el archivo (sin compartir)
  const generatePDFOnly = async (crop, activities, creatorName = "Usuario no registrado") => {
    try {
      const [logoBase64, fontBase64] = await Promise.all([
        getLogoBase64(),
        getCarterOneBase64(),
      ]);
      const logoSrc = `data:image/png;base64,${logoBase64}`;
      const fontSrc = `data:font/truetype;charset=utf-8;base64,${fontBase64}`;

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

      const sortedActivities = [...activities].sort((a, b) => {
        const dateA = getTimestampFromActivity(a);
        const dateB = getTimestampFromActivity(b);
        return dateA - dateB;
      });

      const docActivity = activities.find(
        (act) => act.name === "Documentación adicional"
      );
      const docImageBase64 = docActivity?.imageBase64 || null;

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
              .header { display: flex; align-items: center; margin-bottom: 25px; }
              .title { font-size: 24px; color: #2E7D32; font-family: 'CarterOne-Regular', Arial, sans-serif; margin: 0; }
              .logo-container { background-color: #2E7D32; padding: 7px 11px; display: flex; align-items: center; min-height: 40px; margin-left: auto; }
              .logo-img { height: 40px; width: auto; margin-right: 5px; }
              .section { display: flex; gap: 20px; margin-bottom: 25px; }
              .data-col { flex: 1; }
              .image-col { flex: 0 0 180px; display: flex; align-items: flex-start; justify-content: flex-end; }
              .crop-image { width: 100%; height: 140px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
              .image-placeholder { width: 100%; height: 140px; background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #888; font-size: 11px; }
              .flow { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 25px; }
              .flow-step { display: flex; align-items: center; font-size: 17px; font-family: Arial, sans-serif; white-space: nowrap; }
              table { width: 100%; max-width: 900px; border-collapse: collapse; margin: 0 auto 25px auto; border: 2px solid #ddd; }
              th { background-color: #2E7D32; color: white; padding: 12px 10px; font-weight: bold; font-size: 14px; text-align: center; border: 1px solid #ddd; font-family: Arial, sans-serif; }
              td { padding: 12px 10px; font-size: 13px; border: 1px solid #ddd; font-family: Arial, sans-serif; word-wrap: break-word; white-space: normal; }
              .footer { position: absolute; bottom: 30px; left: 60px; right: 60px; display: flex; justify-content: space-between; font-size: 10px; color: #666; font-family: Arial, sans-serif; }
              .data-row { margin-bottom: 6px; font-family: Arial, sans-serif; font-size: 14px; }
              .data-label { font-weight: bold; margin-right: 6px; }
              .data-value { font-weight: normal; color: #333; }
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

      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      const cleanCropName = crop.cropName.replace(/[/\\?%*:|"<>]/g, "_").substring(0, 50);
      const newFileName = `Trazabilidad_${cleanCropName}.pdf`;
      const newFileUri = `${FileSystem.documentDirectory}${newFileName}`;
      await FileSystem.moveAsync({ from: uri, to: newFileUri });
      return newFileUri; // ✅ Solo devuelve la URI local, no comparte
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("No se pudo generar el PDF.");
    }
  };

  // --- Funciones auxiliares (copiadas de cropPDFGenerator.js) ---
  const getLogoBase64 = async () => {
    const asset = Asset.fromModule(require("../../assets/Logo-AGROX-Blanco.png"));
    await asset.downloadAsync();
    return await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
  };

  const getCarterOneBase64 = async () => {
    const asset = Asset.fromModule(require("../../utils/fonts/CarterOne-Regular.ttf"));
    await asset.downloadAsync();
    return await FileSystem.readAsStringAsync(asset.localUri, { encoding: FileSystem.EncodingType.Base64 });
  };

  const getTimestampFromActivity = (activity) => {
    if (!activity.createdAt) return 0;
    if (activity.createdAt.seconds !== undefined) return activity.createdAt.seconds * 1000;
    if (typeof activity.createdAt === "string") return new Date(activity.createdAt).getTime();
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
      const month = date.toLocaleString("es-ES", { month: "short" }).replace(".", "");
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (e) {
      return "Error en fecha";
    }
  };

  // --- Efecto principal ---
  useEffect(() => {
    if (visible && crop?.id) {
      setLoading(true);
      setQrUrl("");

      generateAndUploadPDF()
        .then((url) => {
          if (url) {
            setQrUrl(url);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setQrUrl("");
    }
  }, [visible, crop]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={qrModalStyle.modalOverlay}>
        <View style={qrModalStyle.modalContent}>
          <Text style={qrModalStyle.headerText}>Código QR de trazabilidad</Text>
          <Text style={qrModalStyle.subHeaderText}>
            Escanea este código para ver el informe de trazabilidad.
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2E7D32" style={{ marginVertical: 20 }} />
          ) : qrUrl ? (
            <View style={qrModalStyle.qrContainer}>
              <QRCode
                value={qrUrl}
                size={width * 0.6}
                color="black"
                backgroundColor="white"
              />
            </View>
          ) : null}

          <View style={qrModalStyle.buttonContainer}>
            <TouchableOpacity style={qrModalStyle.button} onPress={onClose}>
              <Text style={qrModalStyle.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default QRModal;