import React, { useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import Svg, { G, Circle, Rect } from 'react-native-svg';
import finanDashboardStyle from '../../styles/graphicStyles/finanDashboardStyle';
import { useRoute } from '@react-navigation/native';
import { db, auth } from '../../services/database';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs, query, where } from 'firebase/firestore';

SplashScreen.preventAutoHideAsync();
// Regla de negocio: el costo total acumulado es la suma de totalCost
// de todas las actividades del cultivo actual.
const FinanDashboard = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const crop = route.params?.crop; // si el panel abre desde un cultivo, traerá crop

	const [loading, setLoading] = React.useState(true);
	const [totalCostAccum, setTotalCostAccum] = React.useState(0);
	const [error, setError] = React.useState('');
	const [byStage, setByStage] = React.useState([]); // [{name, value, color}]
	const [totalCultivatedArea, setTotalCultivatedArea] = React.useState(0);
	const [totalYieldAccum, setTotalYieldAccum] = React.useState(0);
	const [totalRevenueAccum, setTotalRevenueAccum] = React.useState(0);

	const [fontsLoaded] = useFonts({
		CarterOne: require("../../utils/fonts/CarterOne-Regular.ttf"),
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

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

	// Datos para gráfico de barras: Ingresos vs Costos vs Utilidad
	const barData = React.useMemo(() => {
		const ingresos = Number(totalRevenueAccum || 0);
		const costos = Number(totalYieldAccum || 0);
		const utilidad = ingresos - costos; // misma lógica que la tarjeta de Utilidad neta pedida por el usuario
		return [
			{ label: 'Ingresos', value: ingresos, color: '#2E7D32' },
			{ label: 'Costos', value: costos, color: '#2E7D32' },
			{ label: 'Utilidad', value: utilidad, color: utilidad >= 0 ? '#2E7D32' : '#C62828' },
		];
	}, [totalRevenueAccum, totalCostAccum]);

	return (
		<ScrollView contentContainerStyle={finanDashboardStyle.container} onLayout={onLayoutRootView}>
			<TouchableOpacity
				onPress={() => navigation.navigate('Inicio')}
				style={finanDashboardStyle.backButton}
			>
				<Image
					source={require('../../assets/arrow-left.png')}
					style={finanDashboardStyle.backIcon}
				/>
			</TouchableOpacity>
			<View>
				<Text style={finanDashboardStyle.title}>Panel económico</Text>
			</View>

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
					</>
				) : (
					<Text style={finanDashboardStyle.helper}>
						Para calcular este indicador, abre el panel desde un cultivo con “Área cultivada” registrada.
					</Text>
				)}
			</View>

			{/* Tarjetas en fila: Producción total y Costo por unidad */}
			<View style={finanDashboardStyle.cardsRow}>
				{/* Producción total */}
				<View style={[finanDashboardStyle.card, finanDashboardStyle.halfCard, finanDashboardStyle.halfCardLeft]}>
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
				{/* Costo por unidad */}
				<View style={[finanDashboardStyle.card, finanDashboardStyle.halfCard]}>
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
						</>
					) : (
						<Text style={finanDashboardStyle.helper}>Para calcular este indicador, registra la producción en la etapa de Cosecha.</Text>
					)}
				</View>
			</View>


			{/* Tarjetas en fila: Ingresos totales y Utilidad neta */}
			<View style={finanDashboardStyle.cardsRow}>
				{/* Ingresos totales */}
				<View style={[finanDashboardStyle.card, finanDashboardStyle.halfCard, finanDashboardStyle.halfCardLeft]}>
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
				{/* Tarjeta: Utilidad neta (Ingresos - Costo Total) */}
				<View style={[finanDashboardStyle.card, finanDashboardStyle.halfCard]}>
					<Text style={finanDashboardStyle.cardTitle}>Utilidad neta</Text>
					{loading ? (
						<ActivityIndicator color="#2E7D32" />
					) : Number(totalYieldAccum) > 0 ? (
						<>
							<View style={finanDashboardStyle.currencyRow}>

								<Text style={finanDashboardStyle.amount}>
									{(
										Number(totalRevenueAccum || 0) - Number(totalYieldAccum)
									).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</Text>
							</View>
						</>
					) : (
						<Text style={finanDashboardStyle.helper}>Para calcular este indicador, registra la producción en la etapa de Cosecha.</Text>
					)}
				</View>
			</View>



			{/* Tarjeta: Rentabilidad (Utilidad neta / Costo Total) × 100. */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Rentabilidad</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : Number(totalCostAccum) > 0 ? (
					<>
						{(() => {
							// Reutiliza el mismo cálculo de "Utilidad neta" de la otra tarjeta
							const profitFromCard = (Number(totalRevenueAccum || 0) - Number(totalYieldAccum || 0));
							const marginPct = Number(totalCostAccum) > 0 ? (profitFromCard / Number(totalCostAccum)) * 100 : 0;
							return (
								<View style={finanDashboardStyle.currencyRow}>
									<Text style={finanDashboardStyle.rentability}>
										{marginPct.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
									</Text>
								</View>
							);
						})()}
					</>
				) : (
					<Text style={finanDashboardStyle.helper}>Para calcular este indicador, registra costos en las actividades del cultivo.</Text>
				)}
			</View>

			{/* Gráfico de barras: Ingresos vs Costos vs Utilidad */}
			<View style={finanDashboardStyle.card}>
				<Text style={finanDashboardStyle.cardTitle}>Ingresos vs Costos vs Utilidad</Text>
				{loading ? (
					<ActivityIndicator color="#2E7D32" />
				) : (barData?.some(d => Number(d.value) !== 0)) ? (
					<>
						<BarChart data={barData} width={320} height={180} barWidth={36} barSpacing={28} />
					</>
				) : (
					<Text style={finanDashboardStyle.helper}>Sin datos para graficar.</Text>
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
		<View style={finanDashboardStyle.donutContainer}>
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
			<View style={finanDashboardStyle.donutCenter}>
				<Text style={finanDashboardStyle.donutCenterTotal}>
					C$ {Number(safeTotal || 0).toLocaleString('es-NI')}
				</Text>
			</View>
			{/* leyenda simple */}
			<View style={finanDashboardStyle.donutLegend}>
				{(data || []).map((d, i) => (
					<View key={i} style={finanDashboardStyle.donutLegendRow}>
						<View style={[finanDashboardStyle.legendColorBox, { backgroundColor: d.color }]} />
						<Text style={finanDashboardStyle.donutLegendLabel} numberOfLines={1}>{d.name}</Text>
						<Text style={finanDashboardStyle.donutLegendValue}>
							C$ {Number(d.value || 0).toLocaleString('es-NI')}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

// Componente de gráfico de barras simple
const BarChart = ({ data = [], width = 320, height = 180, barWidth = 36, barSpacing = 24, padding = 16 }) => {
	const max = Math.max(1, ...data.map(d => Math.abs(Number(d.value) || 0)));
	const chartHeight = height - padding * 2 - 20; // espacio para valores
	const chartWidth = width - padding * 2;
	const zeroY = padding + chartHeight * (Number(Math.max(0, 0)) / max); // 0 en la base

	const totalBarsWidth = data.length * barWidth + (data.length - 1) * barSpacing;
	const startX = padding + Math.max(0, (chartWidth - totalBarsWidth) / 2);

	return (
		<View style={finanDashboardStyle.barChartContainer}>
			<Svg width={width} height={height}>
				<G>
					{data.map((d, i) => {
						const val = Number(d.value) || 0;
						const barHeight = (Math.abs(val) / max) * chartHeight;
						const x = startX + i * (barWidth + barSpacing);
						const y = val >= 0 ? (height - padding - barHeight) : (height - padding);
						return (
							<G key={i}>
								<Rect x={x} y={y} width={barWidth} height={barHeight} fill={d.color || '#2E7D32'} rx={6} />
							</G>
						);
					})}
				</G>
			</Svg>
			{/* Etiquetas debajo */}
			<View style={[finanDashboardStyle.barLabelsRow, { width }]}>
				{data.map((d, i) => (
					<View key={i} style={[finanDashboardStyle.barLabelItem, { width: barWidth + barSpacing }]}>
						<Text style={finanDashboardStyle.barLabelText} numberOfLines={1}>{d.label}</Text>
						<Text style={finanDashboardStyle.barValueText}>
							{Number(d.value || 0).toLocaleString('es-NI', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
};

