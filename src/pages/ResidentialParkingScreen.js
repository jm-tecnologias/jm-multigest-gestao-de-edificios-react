import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import {
    Car,
    Search,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Clock,
    PlusCircle,
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AssignVehicleModal from './modals/AssignVehicleModal';
import ResidentialSpaceModal from './modals/ResidentialSpaceModal'; // Import do novo modal

const ITEMS_PER_PAGE = 5;

export default function ResidentialParkingScreen({ navigation, route }) {
    const { loginData } = route.params ?? {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeMenu, setActiveMenu] = useState('Parque Residencial');
    const [searchText, setSearchText] = useState('');
    const [parkingSpaces, setParkingSpaces] = useState([]);

    // Estados dos Modais
    const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
    const [isSpaceModalVisible, setIsSpaceModalVisible] = useState(false);
    const [selectedSpaceForAssignment, setSelectedSpaceForAssignment] = useState(null);

    // Dados de exemplo para o histórico de acessos de veículos residenciais
    const [vehicleAccessHistory, setVehicleAccessHistory] = useState([
        { id: '1', matricula: 'AAB-123-MC', modelo: 'Toyota Hilux', apto: '201', tipo: 'Entrada', dataHora: '12/11/2026 08:30' },
        { id: '2', matricula: 'BBC-456-MC', modelo: 'Hyundai Tucson', apto: '302', tipo: 'Saída', dataHora: '12/11/2026 09:15' },
        { id: '3', matricula: 'CCD-789-MC', modelo: 'Mazda CX-5', apto: '102', tipo: 'Entrada', dataHora: '12/11/2026 10:00' },
        { id: '4', matricula: 'DDF-321-MC', modelo: 'VW Amarok', apto: '402', tipo: 'Entrada', dataHora: '12/11/2026 11:20' },
        { id: '5', matricula: 'EEF-654-MC', modelo: 'Nissan Patrol', apto: '501', tipo: 'Saída', dataHora: '12/11/2026 12:00' },
        { id: '6', matricula: 'FFG-987-MC', modelo: 'Toyota Fortuner', apto: '202', tipo: 'Entrada', dataHora: '12/11/2026 13:10' },
    ]);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Estados de Paginação Independentes
    const [spacesPage, setSpacesPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Simulação de carregamento / fallback
            setParkingSpaces([
                { id: 1, floor: 'P1', number: '101', type: 'VIP', state: 'Livre' },
                { id: 2, floor: 'P1', number: '102', type: 'Normal', state: 'Ocupado' },
                { id: 3, floor: 'P2', number: '201', type: 'Normal', state: 'Livre' },
                { id: 4, floor: 'P2', number: '202', type: 'VIP', state: 'Ocupado' },
                { id: 5, floor: 'P3', number: '301', type: 'Normal', state: 'Livre' },
                { id: 6, floor: 'P3', number: '302', type: 'Normal', state: 'Ocupado' },
            ]);
        } catch (err) {
            console.error('Erro ao carregar lugares:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleConfirmAssignment = async (spaceId, vehicleId) => {
        // await assignVehicleToSpace(loginData, spaceId, vehicleId);
        loadData();
    };

    const handleSaveSpace = async (spaceData) => {
        // Lógica para enviar para o backend (ex: createParkingSpace)
        const newSpace = {
            id: parkingSpaces.length + 1,
            ...spaceData,
        };
        setParkingSpaces(prev => [newSpace, ...prev]);
    };

    // Filtragem de Lugares
    const filteredSpaces = useMemo(() => {
        return parkingSpaces.filter((item) => {
            const query = searchText.toLowerCase();
            const numberMatch = String(item.number ?? '').toLowerCase().includes(query);
            const floorMatch = String(item.floor ?? '').toLowerCase().includes(query);
            const typeMatch = String(item.type ?? '').toLowerCase().includes(query);
            return numberMatch || floorMatch || typeMatch;
        });
    }, [parkingSpaces, searchText]);

    // Paginação: Lugares
    const totalSpacesPages = Math.ceil(filteredSpaces.length / ITEMS_PER_PAGE) || 1;
    const validSpacesPage = spacesPage > totalSpacesPages ? totalSpacesPages : spacesPage;
    const spacesStartIndex = (validSpacesPage - 1) * ITEMS_PER_PAGE;
    const paginatedSpaces = useMemo(() => {
        return filteredSpaces.slice(spacesStartIndex, spacesStartIndex + ITEMS_PER_PAGE);
    }, [filteredSpaces, spacesStartIndex]);

    // Paginação: Histórico de Acessos
    const totalHistoryPages = Math.ceil(vehicleAccessHistory.length / ITEMS_PER_PAGE) || 1;
    const validHistoryPage = historyPage > totalHistoryPages ? totalHistoryPages : historyPage;
    const historyStartIndex = (validHistoryPage - 1) * ITEMS_PER_PAGE;
    const paginatedHistory = useMemo(() => {
        return vehicleAccessHistory.slice(historyStartIndex, historyStartIndex + ITEMS_PER_PAGE);
    }, [historyStartIndex]);

    // Estatísticas Rápidas
    const totalSpaces = parkingSpaces.length;
    const freeSpaces = parkingSpaces.filter(s => s.state === 'Livre').length;
    const occupiedSpaces = totalSpaces - freeSpaces;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#051937" />

            <Navbar
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                userName="Júlio Santos"
                userRole="Segurança"
                userInitials="JS"
            />

            <View style={styles.mainLayout}>
                {(!isMobile || isSidebarOpen) && (
                    <Sidebar
                        activeMenu={activeMenu}
                        onSelectMenu={setActiveMenu}
                        loginData={loginData}
                        isOpen={isSidebarOpen}
                        onCloseMobile={() => setIsSidebarOpen(false)}
                    />
                )}

                <View style={styles.contentContainer}>
                    <ScrollView contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>

                        {/* Cabeçalho e Botão de Adicionar Vaga */}
                        <View style={styles.headerSection}>
                            <View>
                                <Text style={styles.pageTitle}>Parque Residencial</Text>
                                <Text style={styles.pageSubtitle}>Gestão de lugares e estado de ocupação</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => setIsSpaceModalVisible(true)}
                            >
                                <PlusCircle color="#FFFFFF" size={16} />
                                <Text style={styles.addButtonText}>Nova Vaga</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Métricas */}
                        <View style={styles.metricsRow}>
                            <View style={styles.metricCard}>
                                <Car color="#0284C7" size={24} />
                                <View>
                                    <Text style={styles.metricTitle}>Total de Lugares</Text>
                                    <Text style={styles.metricValue}>{totalSpaces}</Text>
                                </View>
                            </View>
                            <View style={styles.metricCard}>
                                <CheckCircle2 color="#10B981" size={24} />
                                <View>
                                    <Text style={styles.metricTitle}>Livres</Text>
                                    <Text style={[styles.metricValue, { color: '#10B981' }]}>{freeSpaces}</Text>
                                </View>
                            </View>
                            <View style={styles.metricCard}>
                                <Clock color="#EF4444" size={24} />
                                <View>
                                    <Text style={styles.metricTitle}>Ocupados</Text>
                                    <Text style={[styles.metricValue, { color: '#EF4444' }]}>{occupiedSpaces}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Pesquisa */}
                        <View style={styles.filterCard}>
                            <View style={styles.filterSearch}>
                                <Search color="#94A3B8" size={18} />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Pesquisar por número, piso ou tipo..."
                                    placeholderTextColor="#94A3B8"
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                        </View>

                        {/* Tabela de Lugares */}
                        <View style={styles.tableContainer}>
                            <Text style={styles.tableMainTitle}>Lugares de Estacionamento (Toque para associar veículo)</Text>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, { width: '20%' }]}>Piso</Text>
                                <Text style={[styles.th, { width: '25%' }]}>Número</Text>
                                <Text style={[styles.th, { width: '25%' }]}>Tipo</Text>
                                <Text style={[styles.th, { width: '30%' }]}>Estado</Text>
                            </View>

                            {paginatedSpaces.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.tableRow}
                                    onPress={() => {
                                        setSelectedSpaceForAssignment(item);
                                        setIsAssignModalVisible(true);
                                    }}
                                >
                                    <Text style={[styles.td, { width: '20%', fontWeight: '600', color: '#0F172A' }]}>{item.floor}</Text>
                                    <Text style={[styles.td, { width: '25%' }]}>{item.number}</Text>
                                    <Text style={[styles.td, { width: '25%' }]}>{item.type}</Text>
                                    <View style={[styles.td, { width: '30%', flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                                        <View
                                            style={[
                                                styles.statusDot,
                                                { backgroundColor: item.state === 'Livre' ? '#10B981' : '#EF4444' },
                                            ]}
                                        />
                                        <Text style={styles.statusText}>{item.state}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {/* Paginação de Lugares */}
                            <View style={styles.paginationContainer}>
                                <View style={styles.paginationControls}>
                                    <TouchableOpacity
                                        style={[styles.pageArrow, validSpacesPage === 1 && { opacity: 0.5 }]}
                                        disabled={validSpacesPage === 1}
                                        onPress={() => setSpacesPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <ChevronLeft color="#64748B" size={14} />
                                    </TouchableOpacity>

                                    {Array.from({ length: totalSpacesPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = pageNumber === validSpacesPage;
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[styles.pageNumber, isActive && styles.activePage]}
                                                onPress={() => setSpacesPage(pageNumber)}
                                            >
                                                <Text style={isActive ? styles.activePageText : styles.pageText}>
                                                    {pageNumber}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    <TouchableOpacity
                                        style={[styles.pageArrow, validSpacesPage === totalSpacesPages && { opacity: 0.5 }]}
                                        disabled={validSpacesPage === totalSpacesPages}
                                        onPress={() => setSpacesPage(prev => Math.min(prev + 1, totalSpacesPages))}
                                    >
                                        <ChevronRight color="#64748B" size={14} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.paginationInfo}>
                                    {filteredSpaces.length > 0 ? spacesStartIndex + 1 : 0}-{Math.min(spacesStartIndex + ITEMS_PER_PAGE, filteredSpaces.length)} de {filteredSpaces.length}
                                </Text>
                            </View>
                        </View>

                        {/* Tabela de Histórico */}
                        <View style={[styles.tableContainer, { marginTop: 24 }]}>
                            <Text style={styles.tableMainTitle}>Últimos Acessos de Veículos</Text>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, { width: '25%' }]}>Matrícula</Text>
                                <Text style={[styles.th, { width: '25%' }]}>Modelo</Text>
                                <Text style={[styles.th, { width: '20%' }]}>Apto</Text>
                                <Text style={[styles.th, { width: '30%' }]}>Data / Tipo</Text>
                            </View>

                            {paginatedHistory.map((acc) => (
                                <View key={acc.id} style={styles.tableRow}>
                                    <Text style={[styles.td, { width: '25%', fontWeight: '600', color: '#0F172A' }]}>{acc.matricula}</Text>
                                    <Text style={[styles.td, { width: '25%' }]} numberOfLines={1}>{acc.modelo}</Text>
                                    <Text style={[styles.td, { width: '20%', color: '#0284C7', fontWeight: '600' }]}>{acc.apto}</Text>
                                    <View style={[styles.td, { width: '30%' }]}>
                                        <Text style={{ fontSize: 12, color: '#0F172A', fontWeight: '500' }}>{acc.tipo}</Text>
                                        <Text style={{ fontSize: 11, color: '#64748B' }}>{acc.dataHora}</Text>
                                    </View>
                                </View>
                            ))}

                            {/* Paginação de Histórico */}
                            <View style={styles.paginationContainer}>
                                <View style={styles.paginationControls}>
                                    <TouchableOpacity
                                        style={[styles.pageArrow, validHistoryPage === 1 && { opacity: 0.5 }]}
                                        disabled={validHistoryPage === 1}
                                        onPress={() => setHistoryPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <ChevronLeft color="#64748B" size={14} />
                                    </TouchableOpacity>

                                    {Array.from({ length: totalHistoryPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = pageNumber === validHistoryPage;
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[styles.pageNumber, isActive && styles.activePage]}
                                                onPress={() => setHistoryPage(pageNumber)}
                                            >
                                                <Text style={isActive ? styles.activePageText : styles.pageText}>
                                                    {pageNumber}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    <TouchableOpacity
                                        style={[styles.pageArrow, validHistoryPage === totalHistoryPages && { opacity: 0.5 }]}
                                        disabled={validHistoryPage === totalHistoryPages}
                                        onPress={() => setHistoryPage(prev => Math.min(prev + 1, totalHistoryPages))}
                                    >
                                        <ChevronRight color="#64748B" size={14} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.paginationInfo}>
                                    {vehicleAccessHistory.length > 0 ? historyStartIndex + 1 : 0}-{Math.min(historyStartIndex + ITEMS_PER_PAGE, vehicleAccessHistory.length)} de {vehicleAccessHistory.length}
                                </Text>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View>

            {/* Modais */}
            <ResidentialSpaceModal
                visible={isSpaceModalVisible}
                onClose={() => setIsSpaceModalVisible(false)}
                onSaveSpace={handleSaveSpace}
            />

            <AssignVehicleModal
                visible={isAssignModalVisible}
                onClose={() => setIsAssignModalVisible(false)}
                selectedSpace={selectedSpaceForAssignment}
                onConfirmAssignment={handleConfirmAssignment}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#051937' },
    mainLayout: { flex: 1, flexDirection: 'row', width: '100%', height: '100%', position: 'relative' },
    contentContainer: { flex: 1, backgroundColor: '#F1F5F9', borderTopLeftRadius: 16, overflow: 'hidden' },
    contentPadding: { padding: 24 },

    headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
    pageSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
    addButton: { backgroundColor: '#0284C7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
    addButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

    metricsRow: { flexDirection: 'row', gap: 16, marginBottom: 20, flexWrap: 'wrap' },
    metricCard: { flex: 1, minWidth: 160, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
    metricTitle: { fontSize: 12, color: '#64748B' },
    metricValue: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginTop: 2 },

    filterCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 20 },
    filterSearch: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40 },
    filterInput: { marginLeft: 8, flex: 1, height: 30, fontSize: 13, color: '#0F172A' },

    tableContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, width: '100%' },
    tableMainTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8, marginBottom: 6 },
    th: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    td: { fontSize: 13, color: '#334155' },

    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 13, color: '#334155', fontWeight: '500' },

    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, flexWrap: 'wrap', gap: 10 },
    paginationControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pageArrow: { padding: 5, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6 },
    pageNumber: { width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    activePage: { backgroundColor: '#0284C7' },
    activePageText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
    pageText: { color: '#64748B', fontSize: 12 },
    paginationInfo: { fontSize: 12, color: '#64748B' },
});