import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { modalListStyle } from '../../styles/activitiesCrop/modalListStyle';
import { db } from '../../services/database';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

/**
 * ModalList - Modal reusable para listar y seleccionar items con búsqueda
 * Props:
 * - visible: boolean
 * - onClose: () => void
 * - data?: any[]  // si se pasa, no se usa Firestore
 * - collectionPath?: string // si no se pasa data, se suscribe a Firestore
 * - orderByField?: string (default 'createdAt')
 * - orderDirection?: 'asc' | 'desc' (default 'desc')
 * - searchPlaceholder?: string (default 'Buscar...')
 * - searchKeys?: string[] // claves sobre las que filtra el término
 * - renderItem?: (item) => ReactNode // render personalizado de fila
 * - onSelect: (item) => void
 * - title?: string
 */
const ModalList = ({
  visible,
  onClose,
  data,
  collectionPath,
  orderByField = 'createdAt',
  orderDirection = 'desc',
  searchPlaceholder = 'Buscar...',
  searchKeys = [],
  renderItem,
  onSelect,
  title = 'Seleccionar',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');

  useEffect(() => {
    if (!visible) return; // evitar suscripción cuando no está visible
    if (Array.isArray(data)) {
      setItems(data);
      setLoading(false);
      return;
    }
    if (!collectionPath) { setItems([]); setLoading(false); return; }
    try {
      const ref = collection(db, collectionPath);
      const q = orderByField ? query(ref, orderBy(orderByField, orderDirection)) : ref;
      const unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(docs);
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      console.error('ModalList subscribe error:', e);
      setLoading(false);
    }
  }, [visible, collectionPath, orderByField, orderDirection, data]);

  const filtered = useMemo(() => {
    const t = String(term || '').toLowerCase().trim();
    if (!t) return items;
    if (!searchKeys || !searchKeys.length) return items;
    try {
      return items.filter(it => searchKeys.some(k => {
        const v = it?.[k];
        if (v === undefined || v === null) return false;
        return String(v).toLowerCase().includes(t);
      }));
    } catch {
      return items;
    }
  }, [term, items, searchKeys]);

  const renderRow = ({ item, index }) => (
    <TouchableOpacity
      style={[modalListStyle.row, index % 2 === 1 && modalListStyle.rowAlt]}
      activeOpacity={0.85}
      onPress={() => { onSelect && onSelect(item); onClose && onClose(); }}
    >
      {renderItem ? (
        renderItem(item)
      ) : (
        <Text style={modalListStyle.rowText} numberOfLines={1}>
          {item?.name || item?.fullName || item?.title || item?.id}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={modalListStyle.overlay}>
          <TouchableWithoutFeedback>
            <View style={modalListStyle.container}>

              {/* Barra de búsqueda */}
              <View style={modalListStyle.searchContainer}>
                <TextInput
                  style={modalListStyle.searchInput}
                  placeholder={searchPlaceholder}
                  placeholderTextColor="#888"
                  value={term}
                  onChangeText={setTerm}
                />
              </View>

              {/* Lista de items */}
              {loading ? (
                <View style={modalListStyle.loadingContainer}>
                  <ActivityIndicator color="#2E7D32" />
                </View>
              ) : (
                <FlatList
                  data={filtered}
                  keyExtractor={(it, idx) => it.id || String(idx)}
                  renderItem={renderRow}
                  ListEmptyComponent={
                    <View style={modalListStyle.emptyContainer}>
                      <Text style={modalListStyle.emptyText}>{term ? 'Sin resultados' : 'Sin datos'}</Text>
                    </View>
                  }
                />
              )}

              {/* Botón cerrar */}
              <TouchableOpacity style={modalListStyle.closeButton} onPress={onClose}>
                <Text style={modalListStyle.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalList;
