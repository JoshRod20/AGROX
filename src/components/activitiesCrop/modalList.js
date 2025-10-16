import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { modalListStyle } from '../../styles/activitiesCrop/modalListStyle';
import { db, auth } from '../../services/database';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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
  userScoped = true,
  userIdField = 'userId',
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [uid, setUid] = useState(auth?.currentUser?.uid || null);

  useEffect(() => {
    if (!userScoped) return;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid || null);
    });
    return () => unsubAuth();
  }, [userScoped]);

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
      const constraints = [];
      const shouldClientSort = Boolean(userScoped && orderByField);
      if (userScoped) {
        if (!uid) { setItems([]); setLoading(false); return; }
        constraints.push(where(userIdField, '==', uid));
      }
      if (orderByField && !shouldClientSort) {
        constraints.push(orderBy(orderByField, orderDirection));
      }

      const q = constraints.length ? query(ref, ...constraints) : ref;
      const unsub = onSnapshot(q, (snap) => {
        let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (orderByField) {
          const dir = String(orderDirection || 'desc').toLowerCase() === 'asc' ? 1 : -1;
          const getVal = (v) => {
            if (!v && v !== 0) return null;
            if (v?.toDate) { try { return v.toDate().getTime(); } catch { } }
            if (v instanceof Date) return v.getTime();
            if (typeof v === 'number') return v;
            if (typeof v === 'string') {
              const n = Number(v);
              if (!Number.isNaN(n)) return n;
              const t = Date.parse(v);
              if (!Number.isNaN(t)) return t;
              return v.toLowerCase();
            }
            return v;
          };
          docs = docs.sort((a, b) => {
            const av = getVal(a?.[orderByField]);
            const bv = getVal(b?.[orderByField]);
            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;
            if (av < bv) return -1 * dir;
            if (av > bv) return 1 * dir;
            return 0;
          });
        }
        setItems(docs);
        setLoading(false);
      });
      return () => unsub();
    } catch (e) {
      console.error('ModalList subscribe error:', e);
      setLoading(false);
    }
  }, [visible, collectionPath, orderByField, orderDirection, data, userScoped, userIdField, uid]);

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
