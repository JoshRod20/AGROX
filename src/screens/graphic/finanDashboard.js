import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import finanDashboardStyle from '../../styles/graphicStyles/finanDashboardStyle';
import { useRoute } from '@react-navigation/native';
import { db, auth } from '../../services/database';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Regla de negocio: el costo total acumulado es la suma de totalCost
// de todas las actividades del cultivo actual.
const FinanDashboard = () => {
	const route = useRoute();
	const crop = route.params?.crop; // si el panel abre desde un cultivo, traerá crop

	const [loading, setLoading] = React.useState(true);
	const [totalCostAccum, setTotalCostAccum] = React.useState(0);
	const [error, setError] = React.useState('');
	const [byStage, setByStage] = React.useState([]); // [{name, value, color}]
	const [totalCultivatedArea, setTotalCultivatedArea] = React.useState(0);
	const [totalYieldAccum, setTotalYieldAccum] = React.useState(0);
    const [totalRevenueAccum, setTotalRevenueAccum] = React.useState(0);

	React.useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				setLoading(true);
				let acc = 0;
				let yieldAcc = 0;
                let revenueAcc = 0;
				const stageMap = new Map();
				let areaAcc = 0;
				if (crop?.id) {
					// Sumar totalCost de las actividades del cultivo
					const actsRef = collection(db, `Crops/${crop.id}/activities`);
					const snap = await getDocs(actsRef);
					snap.forEach((d) => {
						const data = d.data() || {};
						const tc = Number(data.totalCost) || 0;
						if (Number.isFinite(tc)) acc += tc;
						// Producción total: sumar si la actividad es Cosecha
						const stageName = String(data.name || '').toLowerCase();
						if (stageName === 'cosecha' && data.totalYield != null) {
							const y = Number(data.totalYield) || 0;
							if (Number.isFinite(y)) yieldAcc += y;
						}
                        // Ingresos totales: en Postcosecha y comercialización -> processedAmount * salePrice
                        if (stageName.includes('postcosecha') && (data.processedAmount != null || data.salePrice != null)) {
                            const qty = Number(data.processedAmount) || 0;
                            const price = Number(data.salePrice) || 0;
                            const rev = qty * price;
                            if (Number.isFinite(rev)) revenueAcc += rev;
                        }
						const stage = data.name || 'Actividad';
						if (!stageMap.has(stage)) stageMap.set(stage, 0);
						stageMap.set(stage, stageMap.get(stage) + (Number(tc) || 0));
					});
					// Área del cultivo actual (si viene en params)
					areaAcc = Number(crop?.cultivatedArea) || 0;
				} else {
					// Si no hay crop, sumar de todos los cultivos del usuario actual
					const uid = auth.currentUser?.uid;
					if (!uid) throw new Error('Usuario no autenticado');
					const cropsQ = query(collection(db, 'Crops'), where('userId', '==', uid));
					const cropsSnap = await getDocs(cropsQ);
					for (const c of cropsSnap.docs) {
						const actsRef = collection(db, `Crops/${c.id}/activities`);
						const actsSnap = await getDocs(actsRef);
						actsSnap.forEach((d) => {
							const data = d.data() || {};
							const tc = Number(data.totalCost) || 0;
							if (Number.isFinite(tc)) acc += tc;
							const stageName = String(data.name || '').toLowerCase();
							if (stageName === 'cosecha' && data.totalYield != null) {
								const y = Number(data.totalYield) || 0;
								if (Number.isFinite(y)) yieldAcc += y;
							}
                            if (stageName.includes('postcosecha') && (data.processedAmount != null || data.salePrice != null)) {
                                const qty = Number(data.processedAmount) || 0;
                                const price = Number(data.salePrice) || 0;
                                const rev = qty * price;
                                if (Number.isFinite(rev)) revenueAcc += rev;
                            }
							const stage = data.name || 'Actividad';
							if (!stageMap.has(stage)) stageMap.set(stage, 0);
							stageMap.set(stage, stageMap.get(stage) + (Number(tc) || 0));
						});
						// Sumar área cultivada de cada cultivo
						const cd = c.data() || {};
						const ca = Number(cd.cultivatedArea);
						if (Number.isFinite(ca) && ca > 0) areaAcc += ca;
					}
				}
				if (!cancelled) {
					setTotalCostAccum(acc);
					setTotalYieldAccum(yieldAcc);
					setTotalCultivatedArea(areaAcc || 0);
                    setTotalRevenueAccum(revenueAcc);
					// preparar dataset por etapa con colores
					const palette = ['#2E7D32', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#388E3C', '#4CAF50'];
					const data = Array.from(stageMap.entries()).map(([name, value], idx) => ({
						name,
						value,
						color: palette[idx % palette.length],
					})).sort((a, b) => b.value - a.value);
					setByStage(data);
				}
			} catch (e) {
				if (!cancelled) setError('No se pudo cargar el costo total acumulado.');
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => { cancelled = true; };
	}, [crop?.id]);

	return (
		<ScrollView contentContainerStyle={finanDashboardStyle.container}>
			<Text style={finanDashboardStyle.title}>Panel económico</Text>

			{/* Tarjeta: Costo total acumulado */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Costo total acumulado</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : (
					<View style={finanDashboardStyle.currencyRow}>
						<Text style={finanDashboardStyle.currencySymbol}>C$</Text>
						<Text style={finanDashboardStyle.amount}>
							{Number(totalCostAccum || 0).toLocaleString('es-NI')}
						</Text>
					</View>
				)}
				{!!error && (
					<Text style={finanDashboardStyle.helper}>{error}</Text>
				)}
				{!error && crop?.name && (
					<Text style={finanDashboardStyle.helper}>
						Cultivo: {crop.cropName || crop.name}
					</Text>
				)}
			</View>


			{/* Gráfico circular: distribución de costo por etapa */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Distribución de costos por etapa</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : (
					<DonutChart total={totalCostAccum} data={byStage} size={220} strokeWidth={24} />
				)}
				{!loading && byStage?.length === 0 && (
					<Text style={finanDashboardStyle.helper}>Sin datos para graficar.</Text>
				)}
			</View>
			{/* Tarjeta: Costo por ha/mz (total / área cultivada). Si no se abre desde un cultivo, usa suma de áreas del usuario. */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Costo por ha/mz</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : (Number(crop?.cultivatedArea) > 0 || Number(totalCultivatedArea) > 0) ? (
					<>
						<View style={finanDashboardStyle.currencyRow}>
							<Text style={finanDashboardStyle.currencySymbol}>C$</Text>
							<Text style={finanDashboardStyle.amount}>
								{(() => {
									const area = Number(crop?.cultivatedArea) > 0 ? Number(crop.cultivatedArea) : Number(totalCultivatedArea) || 0;
									const value = area > 0 ? (Number(totalCostAccum || 0) / area) : 0;
									return value.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
								})()}
							</Text>
						</View>
						<Text style={finanDashboardStyle.helper}>
							{(() => {
								const area = Number(crop?.cultivatedArea) > 0 ? Number(crop.cultivatedArea) : Number(totalCultivatedArea) || 0;
								return `Total: C$ ${Number(totalCostAccum || 0).toLocaleString('es-NI')} / Área cultivada: ${area} mz`;
							})()}
						</Text>
					</>
				) : (
					<Text style={finanDashboardStyle.helper}>
						Para calcular este indicador, abre el panel desde un cultivo con “Área cultivada” registrada.
					</Text>
				)}
			</View>

			{/* Tarjeta: Producción total (suma de totalYield en Cosecha) */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Producción total</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : (
					<View style={finanDashboardStyle.currencyRow}>
						<Text style={finanDashboardStyle.amount}>
							{Number(totalYieldAccum || 0).toLocaleString('es-NI')}
						</Text>
						<Text style={finanDashboardStyle.currencySymbol}>Kg</Text>
					</View>
				)}
				{!loading && (crop?.cropName || crop?.name) && (
					<Text style={finanDashboardStyle.helper}>
						Cultivo: {crop.cropName || crop.name}
					</Text>
				)}
			</View>

			{/* Tarjeta: Costo por unidad producida (total / producción) */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Costo por unidad</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : Number(totalYieldAccum) > 0 ? (
					<>
						<View style={finanDashboardStyle.currencyRow}>
							<Text style={finanDashboardStyle.currencySymbol}>C$</Text>
							<Text style={finanDashboardStyle.amount}>
								{(
									Number(totalCostAccum || 0) / Number(totalYieldAccum)
								).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</Text>
						</View>
						<Text style={finanDashboardStyle.helper}>
							Total: C$ {Number(totalCostAccum || 0).toLocaleString('es-NI')} / Producción total: {Number(totalYieldAccum || 0).toLocaleString('es-NI')} Kg
						</Text>
					</>
				) : (
					<Text style={finanDashboardStyle.helper}>Para calcular este indicador, registra la producción en la etapa de Cosecha.</Text>
				)}
			</View>

			{/* Tarjeta: Ingresos totales (cantidad procesada x precio de venta en Postcosecha) */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Ingresos totales</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : Number(totalRevenueAccum) > 0 ? (
					<>
						<View style={finanDashboardStyle.currencyRow}>
							<Text style={finanDashboardStyle.currencySymbol}>C$</Text>
							<Text style={finanDashboardStyle.amount}>
								{Number(totalRevenueAccum || 0).toLocaleString('es-NI')}
							</Text>
						</View>
						{/* Nota: Si se requiere, se puede mostrar desglose en el futuro */}
					</>
				) : (
					<Text style={finanDashboardStyle.helper}>Para calcular este indicador, registra la cantidad procesada y el precio de venta en Postcosecha.</Text>
				)}
			</View>

		</ScrollView>
	);
};

export default FinanDashboard;

// Componente de Donut simple con total al centro y segmentos por etapa
const DonutChart = ({ total, data, size = 220, strokeWidth = 24 }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const cx = size / 2;
	const cy = size / 2;
	const safeTotal = total > 0 ? total : data.reduce((s, d) => s + (d.value || 0), 0);

	// calcular offsets
	let cumulative = 0;
	const segments = (data || []).map((d) => {
		const val = Number(d.value) || 0;
		const frac = safeTotal > 0 ? val / safeTotal : 0;
		const length = frac * circumference;
		const gap = 2; // pequeño gap visual
		const dashArray = `${Math.max(0, length - gap)} ${circumference}`;
		const dashOffset = circumference - cumulative - length + gap / 2;
		cumulative += length;
		return { color: d.color, dashArray, dashOffset };
	});

	return (
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
			<Svg width={size} height={size}>
				<G rotation="-90" origin={`${cx}, ${cy}`}>
					{/* fondo */}
					<Circle cx={cx} cy={cy} r={radius} stroke="#E9EEF2" strokeWidth={strokeWidth} fill="transparent" />
					{/* segmentos */}
					{segments.map((s, idx) => (
						<Circle
							key={idx}
							cx={cx}
							cy={cy}
							r={radius}
							stroke={s.color}
							strokeWidth={strokeWidth}
							strokeDasharray={s.dashArray}
							strokeDashoffset={s.dashOffset}
							strokeLinecap="butt"
							fill="transparent"
						/>
					))}
				</G>
			</Svg>
			{/* total en el centro */}
			<View style={{ position: 'absolute', alignItems: 'center' }}>
				<Text style={{ fontSize: 14, color: '#666' }}>C$</Text>
				<Text style={{ fontSize: 22, fontWeight: '800', color: '#111' }}>
					{Number(safeTotal || 0).toLocaleString('es-NI')}
				</Text>
			</View>
			{/* leyenda simple */}
			<View style={{ marginTop: 12, width: '100%' }}>
				{(data || []).map((d, i) => (
					<View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
						<View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: d.color, marginRight: 8 }} />
						<Text style={{ flex: 1, color: '#333' }} numberOfLines={1}>{d.name}</Text>
						<Text style={{ color: '#111', fontWeight: '600' }}>
							C$ {Number(d.value || 0).toLocaleString('es-NI')}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

