import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { formTableStyle } from '../../styles/inventoryStyles/formTableStyle';
import { db, auth } from '../../services/database';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, where } from 'firebase/firestore';

/**
 * FormTable - Tabla reusable con datos en vivo de Firestore
 * Props:
 * - collectionPath: string (ruta de la colección, ej: 'seedsAndInputs')
 * - columns: Array<{ key: string, label: string, flex?: number, render?: (item) => ReactNode }>
 * - orderByField?: string
 * - orderDirection?: 'asc' | 'desc'
 * - emptyText?: string
 * - onRowPress?: (item) => void
 * - actions?: boolean | { edit?: boolean, delete?: boolean, flex?: number }
 * - onEdit?: (item) => void
 * - onDeleted?: (item) => void // callback luego de eliminar
 * - horizontalScroll?: boolean // habilita scroll horizontal cuando hay muchas columnas
 * - minColumnUnitWidth?: number // ancho base en px por unidad de flex (default 120)
 * - indexColumn?: boolean | { label?: string, start?: number, flex?: number, width?: number } // agrega columna N°
 * - userScoped?: boolean // filtra por userId === auth.currentUser.uid (default true)
 * - userIdField?: string // nombre del campo que almacena el id de usuario (default 'userId')
 */
const FormTable = ({
	collectionPath,
	columns = [],
	orderByField = 'createdAt',
	orderDirection = 'desc',
	emptyText = 'Sin datos',
	onRowPress,
	searchTerm = '',
	filterKeys,
	actions = false,
	onEdit,
	onDeleted,
	horizontalScroll = true,
	minColumnUnitWidth = 120,
	indexColumn = false,
	userScoped = true,
	userIdField = 'userId',
}) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [confirmVisible, setConfirmVisible] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [uid, setUid] = useState(auth?.currentUser?.uid || null);

	// Mantener uid actualizado cuando cambie el estado de autenticación
	useEffect(() => {
		if (!userScoped) return;
		const unsubAuth = onAuthStateChanged(auth, (user) => {
			setUid(user?.uid || null);
		});
		return () => unsubAuth();
	}, [userScoped]);

	useEffect(() => {
		try {
			const ref = collection(db, collectionPath);
			const constraints = [];
			// Filtro por usuario autenticado si está habilitado
			if (userScoped) {
				if (!uid) {
					// Si aún no hay usuario disponible, mostramos vacío y salimos
					setData([]);
					setLoading(false);
					return;
				}
				constraints.push(where(userIdField, '==', uid));
			}
			// Si hay filtro por usuario y además ordenamiento, evitamos orderBy en Firestore
			// para no requerir índice compuesto; ordenaremos en cliente.
			const shouldClientSort = Boolean(userScoped && orderByField);
			if (orderByField && !shouldClientSort) {
				constraints.push(orderBy(orderByField, orderDirection));
			}

			const q = constraints.length ? query(ref, ...constraints) : ref;
			const unsub = onSnapshot(q, (snap) => {
				let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
				// Ordenamiento en cliente si corresponde
				if (orderByField && (userScoped || constraints.length === 0)) {
					const dir = String(orderDirection || 'desc').toLowerCase() === 'asc' ? 1 : -1;
					const getVal = (v) => {
						if (!v && v !== 0) return null;
						// Firestore Timestamp
						if (v?.toDate) {
							try { return v.toDate().getTime(); } catch { /* ignore */ }
						}
						// Date
						if (v instanceof Date) return v.getTime();
						// number
						if (typeof v === 'number') return v;
						// string fecha ISO o general
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
						if (av == null) return 1; // nulls last
						if (bv == null) return -1;
						if (av < bv) return -1 * dir;
						if (av > bv) return 1 * dir;
						return 0;
					});
				}
				setData(docs);
				setLoading(false);
			});
			return () => unsub();
		} catch (e) {
			console.error('FormTable subscribe error:', e);
			setLoading(false);
		}
	}, [collectionPath, orderByField, orderDirection, userScoped, userIdField, uid]);

	const keyExtractor = useMemo(() => (item) => item.id, []);

		const searchableKeys = useMemo(() => {
			if (Array.isArray(filterKeys) && filterKeys.length) return filterKeys;
			return columns.map(c => c.key).filter(Boolean);
		}, [filterKeys, columns]);

		const filteredData = useMemo(() => {
			const term = String(searchTerm || '').toLowerCase().trim();
			if (!term) return data;
			try {
				return data.filter(item =>
					searchableKeys.some(key => {
						const raw = item?.[key];
						if (raw === undefined || raw === null) return false;
						return String(raw).toLowerCase().includes(term);
					})
				);
			} catch {
				return data;
			}
		}, [data, searchTerm, searchableKeys]);

	const actionsConfig = useMemo(() => {
		if (!actions) return null;
		if (typeof actions === 'boolean') return { edit: true, delete: true, flex: 0.8 };
		return { edit: true, delete: true, flex: 0.8, ...actions };
	}, [actions]);

	const normalizedCols = useMemo(() => columns.map(c => ({ ...c, flex: c.flex ?? 1 })), [columns]);

	const indexColumnConfig = useMemo(() => {
		if (!indexColumn) return null;
		if (typeof indexColumn === 'boolean') return { label: 'N°', flex: 0.5, start: 1 };
		return { label: 'N°', flex: 0.5, start: 1, ...indexColumn };
	}, [indexColumn]);
	const totalFlex = useMemo(() => {
		let t = normalizedCols.reduce((sum, c) => sum + (c.flex || 1), 0);
		if (indexColumnConfig) t += (indexColumnConfig.flex || 0.5);
		if (actionsConfig) t += (actionsConfig.flex || 0.8);
		return t;
	}, [normalizedCols, actionsConfig, indexColumnConfig]);

	const getWidth = (flexUnits) => Math.max(1, Number(flexUnits || 1)) * minColumnUnitWidth;
	const tableMinWidth = useMemo(() => getWidth(totalFlex), [totalFlex, minColumnUnitWidth]);

	const Header = () => (
		<View style={[formTableStyle.headerRow, { minWidth: tableMinWidth }]}>
			{indexColumnConfig && (
				<View style={[formTableStyle.headerCell, { width: indexColumnConfig.width || getWidth(indexColumnConfig.flex) }]}>
					<Text style={formTableStyle.headerText}>{indexColumnConfig.label}</Text>
				</View>
			)}
			{normalizedCols.map((col, idx) => (
				<View key={idx} style={[formTableStyle.headerCell, { width: getWidth(col.flex) }]}>
					<Text style={formTableStyle.headerText}>{col.label}</Text>
				</View>
			))}
			{actionsConfig && (
				<View style={[formTableStyle.headerCell, { width: getWidth(actionsConfig.flex) }]}> 
					<Text style={formTableStyle.headerText}>Acciones</Text>
				</View>
			)}
		</View>
	);

	const Row = ({ item, index }) => {
		const content = (
			<View style={[formTableStyle.row, index % 2 === 1 && formTableStyle.rowAlt, { minWidth: tableMinWidth }]}>
				{indexColumnConfig && (
					<View style={[formTableStyle.cell, { width: indexColumnConfig.width || getWidth(indexColumnConfig.flex) }]}>
						<Text style={formTableStyle.cellText} numberOfLines={1}>
							{String((indexColumnConfig.start || 1) + index)}
						</Text>
					</View>
				)}
				{normalizedCols.map((col, idx) => {
					const cellContent = col.render ? col.render(item) : item[col.key];
					return (
						<View key={idx} style={[formTableStyle.cell, { width: getWidth(col.flex) }]}>
							<Text style={formTableStyle.cellText} numberOfLines={1}>
								{cellContent !== undefined && cellContent !== null ? String(cellContent) : ''}
							</Text>
						</View>
					);
				})}
				{actionsConfig && (
					<View style={[formTableStyle.cell, { width: getWidth(actionsConfig.flex) }]}> 
						<View style={formTableStyle.actionsContainer}>
							{actionsConfig.edit && (
								<TouchableOpacity
									style={formTableStyle.actionBtn}
									onPress={() => onEdit && onEdit(item)}
								>
									<Image source={require('../../assets/edit.png')} style={formTableStyle.actionIcon} />
								</TouchableOpacity>
							)}
							{actionsConfig.delete && (
								<TouchableOpacity
									style={formTableStyle.actionBtn}
									onPress={() => {
										setItemToDelete(item);
										setConfirmVisible(true);
									}}
								>
									<Image source={require('../../assets/trash.png')} style={[formTableStyle.actionIcon, { tintColor: '#4e4e4e' }]} />
								</TouchableOpacity>
							)}
						</View>
					</View>
				)}
			</View>
		);
		if (onRowPress) {
			return (
				<TouchableOpacity activeOpacity={0.85} onPress={() => onRowPress(item)}>
					{content}
				</TouchableOpacity>
			);
		}
		return content;
	};

	if (loading) {
		return (
			<View style={formTableStyle.loadingContainer}>
				<ActivityIndicator color="#2E7D32" size="small" />
			</View>
		);
	}

		if (!filteredData.length) {
		return (
			<View style={formTableStyle.emptyContainer}>
					<Text style={formTableStyle.emptyText}>{searchTerm ? 'Sin resultados' : emptyText}</Text>
			</View>
		);
	}

	return (
		<View style={formTableStyle.container}>
			{horizontalScroll ? (
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					<View>
						<Header />
						<FlatList
							data={filteredData}
							keyExtractor={keyExtractor}
							renderItem={({ item, index }) => <Row item={item} index={index} />}
						/>
					</View>
				</ScrollView>
			) : (
				<>
					<Header />
					<FlatList
						data={filteredData}
						keyExtractor={keyExtractor}
						renderItem={({ item, index }) => <Row item={item} index={index} />}
					/>
				</>
			)}

			{/* Modal de confirmación de eliminación */}
			<Modal
				visible={confirmVisible}
				transparent
				animationType="fade"
				onRequestClose={() => setConfirmVisible(false)}
			>
				<TouchableWithoutFeedback onPress={() => setConfirmVisible(false)}>
					<View style={formTableStyle.overlay}>
						<TouchableWithoutFeedback>
							<View style={formTableStyle.alertContainer}>
								<View style={formTableStyle.alertIconContainer}>
									<Image source={require('../../assets/warning.png')} style={formTableStyle.alertIcon} />
								</View>
								<Text style={formTableStyle.alertTitle}>¿Eliminar registro?</Text>
								<Text style={formTableStyle.alertMessage}>
									¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
								</Text>
								<View style={formTableStyle.alertButtons}>
									<TouchableOpacity
										style={[formTableStyle.alertButton, formTableStyle.cancelButtonAlert]}
										onPress={() => setConfirmVisible(false)}
									>
										<Text style={formTableStyle.alertButtonTextCancel}>Cancelar</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[formTableStyle.alertButton, formTableStyle.deleteButtonAlert]}
										onPress={async () => {
											if (!itemToDelete?.id) {
												setConfirmVisible(false);
												return;
											}
											try {
												await deleteDoc(doc(db, collectionPath, itemToDelete.id));
												onDeleted && onDeleted(itemToDelete);
											} catch (e) {
												console.error('Error eliminando documento:', e);
											}
											setConfirmVisible(false);
											setItemToDelete(null);
										}}
									>
										<Text style={formTableStyle.alertButtonTextDelete}>Eliminar</Text>
									</TouchableOpacity>
								</View>
							</View>
						</TouchableWithoutFeedback>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
		</View>
	);
};

export default FormTable;

