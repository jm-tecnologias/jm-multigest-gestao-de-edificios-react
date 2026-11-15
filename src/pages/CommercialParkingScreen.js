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
    Clock,
    PlusCircle,
    LogOut,
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CommercialEntryModal from './modals/CommercialEntryModal';
import CommercialExitModal from './modals/CommercialExitModal';
import ComercialSpaceModal from './modals/ComercialSpaceModal';
// import { 
//     listCommercialSpaces, 
//     listCommercialParkings, 
//     registerCommercialEntry, 
//     registerCommercialExit 
// } from '../service/_commercial-park-events';

const ITEMS_PER_PAGE = 5;

export default function CommercialParkingScreen({ navigation, route }) {
    const { loginData } = route.params ?? {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeMenu, setActiveMenu] = useState('Parque Comercial');
    const [searchText, setSearchText] = useState('');

    const [commercialSpaces, setCommercialSpaces] = useState([]);
    const [commercialParkings, setCommercialParkings] = useState([]);

    // Estados dos Modais
    const [isSpaceModalVisible, setIsSpaceModalVisible] = useState(false);
    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
    const [isExitModalVisible, setIsExitModalVisible] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Estados de Paginação Independentes
    const [spacesPage, setSpacesPage] = useState(1);
    const [parkingsPage, setParkingsPage] = useState(1);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            setParkingSpaces([
                { id: 1, floor: 'P1', number: '101', type: 'VIP', state: 'Livre' },
                { id: 2, floor: 'P1', number: '102', type: 'Normal', state: 'Ocupado' },
                { id: 3, floor: 'P2', number: '201', type: 'Normal', state: 'Livre' },
                { id: 4, floor: 'P2', number: '202', type: 'VIP', state: 'Ocupado' },
                { id: 5, floor: 'P3', number: '301', type: 'Normal', state: 'Livre' },
                { id: 6, floor: 'P3', number: '302', type: 'Normal', state: 'Ocupado' },
            ]);
            // const spaces = await listCommercialSpaces(loginData, 1);
            // setCommercialSpaces(Array.isArray(spaces) ? spaces : spaces?.data || []);

            // const parkings = await listCommercialParkings(loginData);
            // if (parkings) {
            //     setCommercialParkings(Array.isArray(parkings) ? parkings : parkings?.data || []);
            // }
        } catch (err) {
            console.error('Erro ao carregar dados do parque comercial:', err);
            // Dados simulados para fallback caso a API não responda
            setCommercialSpaces([
                { id: 1, floor: 'P1', number: '101', type: 'Normal' },
                { id: 2, floor: 'P1', number: '102', type: 'VIP' },
                { id: 3, floor: 'P2', number: '201', type: 'Normal' },
                { id: 4, floor: 'P2', number: '202', type: 'VIP' },
                { id: 5, floor: 'P3', number: '301', type: 'Normal' },
                { id: 6, floor: 'P3', number: '302', type: 'Normal' },
            ]);
            setCommercialParkings([
                { plate_number: 'AB-12-34', space_number: '101', date_in: '2026-11-12', time_in: '09:30', balance: 15.50 },
                { plate_number: 'CD-56-78', space_number: '102', date_in: '2026-11-12', time_in: '10:15', balance: 8.00 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handlers para os modais
    const handleConfirmEntry = async (entryData) => {
        // await registerCommercialEntry(loginData, entryData);
        loadData();
    };

    const handleConfirmExit = async (plateNumber, exitData) => {
        // await registerCommercialExit(loginData, plateNumber, exitData);
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
        return commercialSpaces.filter((item) => {
            const query = searchText.toLowerCase();
            const numberMatch = String(item.number ?? '').toLowerCase().includes(query);
            const floorMatch = String(item.floor ?? '').toLowerCase().includes(query);
            const typeMatch = String(item.type ?? '').toLowerCase().includes(query);
            return numberMatch || floorMatch || typeMatch;
        });
    }, [commercialSpaces, searchText]);

    // Paginação: Lugares
    const totalSpacesPages = Math.ceil(filteredSpaces.length / ITEMS_PER_PAGE) || 1;
    const validSpacesPage = spacesPage > totalSpacesPages ? totalSpacesPages : spacesPage;
    const spacesStartIndex = (validSpacesPage - 1) * ITEMS_PER_PAGE;
    const paginatedSpaces = useMemo(() => {
        return filteredSpaces.slice(spacesStartIndex, spacesStartIndex + ITEMS_PER_PAGE);
    }, [filteredSpaces, spacesStartIndex]);

    // Paginação: Estacionamentos Ativos
    const totalParkingsPages = Math.ceil(commercialParkings.length / ITEMS_PER_PAGE) || 1;
    const validParkingsPage = parkingsPage > totalParkingsPages ? totalParkingsPages : parkingsPage;
    const parkingsStartIndex = (validParkingsPage - 1) * ITEMS_PER_PAGE;
    const paginatedParkings = useMemo(() => {
        return commercialParkings.slice(parkingsStartIndex, parkingsStartIndex + ITEMS_PER_PAGE);
    }, [commercialParkings, parkingsStartIndex]);

    const totalSpaces = commercialSpaces.length;
    const activeSessions = commercialParkings.length;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#051937" />

            <Navbar
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                loginData={loginData}
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

                        {/* Cabeçalho e Botões de Ação */}
                        <View style={styles.headerSection}>
                            <View>
                                <Text style={styles.pageTitle}>Parque Comercial</Text>
                                <Text style={styles.pageSubtitle}>Controle de entradas, lugares e saldos</Text>
                            </View>
                            <View style={styles.actionButtonsRow}>
                                {/* <TouchableOpacity
                                    style={styles.entryButton}
                                    onPress={() => setIsSpaceModalVisible(true)}
                                >
                                    <PlusCircle color="#FFFFFF" size={16} />
                                    <Text style={styles.buttonText}>Nova Vaga</Text>
                                </TouchableOpacity> */}
                                <TouchableOpacity
                                    style={styles.entryButton}
                                    onPress={() => setIsEntryModalVisible(true)}
                                >
                                    <PlusCircle color="#FFFFFF" size={16} />
                                    <Text style={styles.buttonText}>Nova Entrada</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.exitButton}
                                    onPress={() => setIsExitModalVisible(true)}
                                >
                                    <LogOut color="#FFFFFF" size={16} />
                                    <Text style={styles.buttonText}>Registar Saída</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Cards de Métricas */}
                        <View style={styles.metricsRow}>
                            <View style={styles.metricCard}>
                                <Car color="#0284C7" size={24} />
                                <View>
                                    <Text style={styles.metricTitle}>Total de Lugares</Text>
                                    <Text style={styles.metricValue}>{totalSpaces}</Text>
                                </View>
                            </View>
                            <View style={styles.metricCard}>
                                <Clock color="#10B981" size={24} />
                                <View>
                                    <Text style={styles.metricTitle}>Sessões Ativas</Text>
                                    <Text style={[styles.metricValue, { color: '#10B981' }]}>{activeSessions}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Filtro e Pesquisa */}
                        <View style={styles.filterCard}>
                            <View style={styles.filterSearch}>
                                <Search color="#94A3B8" size={18} />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Pesquisar por número de vaga, piso ou tipo..."
                                    placeholderTextColor="#94A3B8"
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>
                        </View>


                        {/* Tabela de Lugares Comerciais */}
                        <View style={styles.tableContainer}>
                            {/* <Text style={styles.tableMainTitle}>Lugares do Parque Comercial</Text> */}
                            <View style={styles.headerSection}>
                                    <View>
                                        <Text style={styles.tableMainTitle}>Lugares do Parque Comercial</Text>
                                    </View>
                                    <View style={styles.actionButtonsRow}>
                                        <TouchableOpacity
                                            style={styles.entryButton}
                                            onPress={() => setIsSpaceModalVisible(true)}
                                        >
                                            <PlusCircle color="#FFFFFF" size={16} />
                                            <Text style={styles.buttonText}>Nova Vaga</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, { width: '30%' }]}>Piso</Text>
                                <Text style={[styles.th, { width: '35%' }]}>Número da Vaga</Text>
                                <Text style={[styles.th, { width: '35%' }]}>Tipo</Text>
                            </View>

                            {paginatedSpaces.map((item) => (
                                <View key={item.id} style={styles.tableRow}>
                                    <Text style={[styles.td, { width: '30%', fontWeight: '600', color: '#0F172A' }]}>{item.floor}</Text>
                                    <Text style={[styles.td, { width: '35%' }]}>{item.number}</Text>
                                    <Text style={[styles.td, { width: '35%' }]}>{item.type}</Text>
                                </View>
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

                        {/* Tabela de Controlo de Entradas e Saldos */}
                        <View style={[styles.tableContainer, { marginTop: 10 }]}>
                            <Text style={styles.tableMainTitle}>Veículos em Estacionamento & Saldos</Text>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, { width: '25%' }]}>Matrícula</Text>
                                <Text style={[styles.th, { width: '20%' }]}>Vaga</Text>
                                <Text style={[styles.th, { width: '30%' }]}>Entrada</Text>
                                <Text style={[styles.th, { width: '25%' }]}>Saldo (MT)</Text>
                            </View>

                            {paginatedParkings.map((park, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.td, { width: '25%', fontWeight: '600', color: '#0F172A' }]}>{park.plate_number}</Text>
                                    <Text style={[styles.td, { width: '20%', color: '#0284C7', fontWeight: '600' }]}>{park.space_number}</Text>
                                    <View style={[styles.td, { width: '30%' }]}>
                                        <Text style={{ fontSize: 11, color: '#0F172A', fontWeight: '500' }}>{park.date_in}</Text>
                                        <Text style={{ fontSize: 10, color: '#64748B' }}>{park.time_in}</Text>
                                    </View>
                                    <Text style={[styles.td, { width: '25%', color: '#10B981', fontWeight: 'bold' }]}>
                                        {Number(park.balance).toFixed(2)} MT
                                    </Text>
                                </View>
                            ))}

                            {/* Paginação: Parkings */}
                            <View style={styles.paginationContainer}>
                                <View style={styles.paginationControls}>
                                    <TouchableOpacity
                                        style={[styles.pageArrow, validParkingsPage === 1 && { opacity: 0.5 }]}
                                        disabled={validParkingsPage === 1}
                                        onPress={() => setParkingsPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <ChevronLeft color="#64748B" size={14} />
                                    </TouchableOpacity>

                                    {Array.from({ length: totalParkingsPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = pageNumber === validParkingsPage;
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[styles.pageNumber, isActive && styles.activePage]}
                                                onPress={() => setParkingsPage(pageNumber)}
                                            >
                                                <Text style={isActive ? styles.activePageText : styles.pageText}>
                                                    {pageNumber}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    <TouchableOpacity
                                        style={[styles.pageArrow, validParkingsPage === totalParkingsPages && { opacity: 0.5 }]}
                                        disabled={validParkingsPage === totalParkingsPages}
                                        onPress={() => setParkingsPage(prev => Math.min(prev + 1, totalParkingsPages))}
                                    >
                                        <ChevronRight color="#64748B" size={14} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.paginationInfo}>
                                    {commercialParkings.length > 0 ? parkingsStartIndex + 1 : 0}-{Math.min(parkingsStartIndex + ITEMS_PER_PAGE, commercialParkings.length)} de {commercialParkings.length}
                                </Text>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View>
            <ComercialSpaceModal
                visible={isSpaceModalVisible}
                onClose={() => setIsSpaceModalVisible(false)}
                onSaveSpace={handleSaveSpace}
            />

            {/* Modais Integrados */}
            <CommercialEntryModal
                visible={isEntryModalVisible}
                onClose={() => setIsEntryModalVisible(false)}
                onConfirmEntry={handleConfirmEntry}
            />

            <CommercialExitModal
                visible={isExitModalVisible}
                onClose={() => setIsExitModalVisible(false)}
                onConfirmExit={handleConfirmExit}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#051937' },
    mainLayout: { flex: 1, flexDirection: 'row', width: '100%', height: '100%', position: 'relative' },
    contentContainer: { flex: 1, backgroundColor: '#F1F5F9', borderTopLeftRadius: 16, overflow: 'hidden' },
    contentPadding: { padding: 16 },

    headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
    pageSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
    actionButtonsRow: { flexDirection: 'row', gap: 8 },
    entryButton: { backgroundColor: '#0284C7', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
    exitButton: { backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
    buttonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

    metricsRow: { flexDirection: 'row', gap: 16, marginBottom: 10, flexWrap: 'wrap' },
    metricCard: { flex: 1, minWidth: 160, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
    metricTitle: { fontSize: 12, color: '#64748B' },
    metricValue: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginTop: 2 },

    filterCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 10 },
    filterSearch: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40 },
    filterInput: { marginLeft: 8, flex: 1, height: 30, fontSize: 13, color: '#0F172A' },

    tableContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, width: '100%' },
    tableMainTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8, marginBottom: 6 },
    th: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    td: { fontSize: 13, color: '#334155' },

    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, flexWrap: 'wrap', gap: 10 },
    paginationControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pageArrow: { padding: 5, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6 },
    pageNumber: { width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    activePage: { backgroundColor: '#0284C7' },
    activePageText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
    pageText: { color: '#64748B', fontSize: 12 },
    paginationInfo: { fontSize: 12, color: '#64748B' },
});