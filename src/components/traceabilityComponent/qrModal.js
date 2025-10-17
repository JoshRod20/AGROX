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

// Servicios de Firebase
import { db, storage } from "../../services/database";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { generatePDFOnly } from "./cropPDFGenerator";
import { getCropActivities } from "../../services/activitiesService";

const { width } = Dimensions.get("window");

const QRModal = ({ visible, onClose, crop }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Subir PDF y actualizar referencia en Firestore
  const uploadPDFAndUpdateRef = async (localUri, cropId, lastActivityTime) => {
    try {
      const response = await fetch(localUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `traceability_pdfs/${cropId}.pdf`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizar en Firestore
      const cropDocRef = doc(db, "Crops", cropId);
      await updateDoc(cropDocRef, {
        traceabilityPDF: {
          url: downloadURL,
          lastUpdated: lastActivityTime,
        },
      });

      return downloadURL;
    } catch (error) {
      console.error("Error uploading PDF or updating Firestore:", error);
      throw new Error("No se pudo subir el PDF.");
    }
  };

  // Obtener la marca de tiempo de la actividad más reciente
  const getLastActivityTimestamp = (activities) => {
    if (activities.length === 0) return new Date(0).getTime();
    const timestamps = activities
      .map((act) => {
        if (!act.createdAt) return 0;
        if (act.createdAt.seconds) return act.createdAt.seconds * 1000;
        if (typeof act.createdAt === "string")
          return new Date(act.createdAt).getTime();
        if (act.createdAt instanceof Date) return act.createdAt.getTime();
        return 0;
      })
      .filter((t) => t > 0);
    return timestamps.length > 0
      ? Math.max(...timestamps)
      : new Date(0).getTime();
  };

  // Lógica principal
  const getOrGenerateQR = async () => {
    if (!crop?.id) return null;

    try {
      const activities = await getCropActivities(crop.id);
      const filteredActs = activities.filter((a) => a.name && a.createdAt);
      const lastActivityTime = getLastActivityTimestamp(filteredActs);

      // Leer documento del cultivo para ver si ya tiene PDF
      const cropDoc = await getDoc(doc(db, "Crops", crop.id));
      const cropData = cropDoc.exists() ? cropDoc.data() : null;

      const existingPDF = cropData?.traceabilityPDF;
      if (
        existingPDF &&
        existingPDF.url &&
        existingPDF.lastUpdated &&
        existingPDF.lastUpdated.toMillis?.() >= lastActivityTime
      ) {
        // ✅ PDF existente está actualizado → usarlo
        return existingPDF.url;
      }

      // ❌ PDF no existe o está desactualizado → regenerar
      const pdfUri = await generatePDFOnly(crop, filteredActs);
      const publicUrl = await uploadPDFAndUpdateRef(
        pdfUri,
        crop.id,
        lastActivityTime
      );
      return publicUrl;
    } catch (error) {
      console.error("Error in getOrGenerateQR:", error);
      Alert.alert(
        "Error",
        "No se pudo obtener o generar el informe de trazabilidad."
      );
      return null;
    }
  };

  useEffect(() => {
    if (visible && crop?.id) {
      setLoading(true);
      setQrUrl("");
      getOrGenerateQR()
        .then((url) => {
          if (url) setQrUrl(url);
        })
        .finally(() => setLoading(false));
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
      <TouchableOpacity
        style={qrModalStyle.modalOverlay}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View style={qrModalStyle.modalContent}>
          <Text style={qrModalStyle.headerText}>Escanea el código QR</Text>
          <Text style={qrModalStyle.subHeaderText}>
            Escanea el código QR para acceder al informe completo de
            trazabilidad de tu cultivo. Este informe incluye detalles sobre el
            origen, el proceso de cultivo, y las características del producto
            final.
          </Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2E7D32"
              style={{ marginVertical: 20 }}
            />
          ) : qrUrl ? (
            <View style={qrModalStyle.qrContainer}>
              <QRCode
                value={qrUrl}
                size={width * 0.6}
                color="black"
                backgroundColor="white"
                quietZone={10}
                ecl="H"
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default QRModal;
