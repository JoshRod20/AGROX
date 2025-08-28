import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/database';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from '../styles/cropCardStyle';

const { width } = Dimensions.get('window');

const CropCard = () => {
  const navigation = useNavigation();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const q = query(collection(db, 'Crops'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const cropsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          progress: 0, // fijo en 0% como el diseño
        }));
        setCrops(cropsData);
      } catch (error) {
        console.log('Error fetching crops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, []);

  if (loading) return null;

  return (
    <>
      {/* Encabezado de sección con separador */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recientes</Text>
        <View style={styles.sectionLine} />
      </View>

      {crops.length > 0 ? (
        crops.map((crop) => (
          <TouchableOpacity 
            key={crop.id} 
            style={[styles.wrapper, { width: width * 0.9 }]} 
            onPress={() => navigation.navigate('CropsScreen')}
            >
            {/* Etiqueta arriba, flotando */}
            <View style={styles.cropNameTag}>
                <Text style={styles.cropNameText}>{crop.cropName}</Text>
            </View>

            {/* Tarjeta */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                <Text style={styles.label}>
                    Tipo de cultivo: <Text style={styles.value}>{crop.cropType}</Text>
                </Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Registrado el:</Text>
                    <View style={styles.dateBox}>
                    <Text style={styles.dateText}>
                        {new Date(crop.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    </Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.label}>Progreso:</Text>
                    <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${crop.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{crop.progress}%</Text>
                </View>
                </View>
            </View>
        </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noData}>
          <Text style={styles.noDataText}>No hay cultivos registrados aún.</Text>
        </View>
      )}
    </>
  );
};

export default CropCard;
