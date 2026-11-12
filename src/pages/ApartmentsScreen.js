import React, { useState, useEffect } from 'react';
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
    Search,
    Plus,
    Pencil,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Loading, Erro, NoData } from '../components/status-components';
import NewApartmentModal from './modals/NewApartmentModal';
import { createApartment, updateApartment, listApartments } from '../service/_apartment-events';

export default function ApartmentsScreen({ navigation, route }) {
    const { loginData } = route.params ?? {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { width } = useWindowDimensions();
    const isMobile = width < 768; // Deteta se está em ambiente mobile com base na largura do ecrã

    const [activeMenu, setActiveMenu] = useState('Apartamentos');
    const [searchText, setSearchText] = useState('');
    const [isApartmentModalVisible, setIsApartmentModalVisible] = useState(false);

    const [selectedApartmentToEdit, setSelectedApartmentToEdit] = useState(null);
    // Estado para controlar a abertura/fecho do Sidebar em Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Guardamos todos os apartamentos vindos da API
    const [allApartments, setAllApartments] = useState([]);

    // ESTADO DA PAGINAÇÃO
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        loadData()
    }, []);

    // Sempre que o texto de pesquisa mudar, voltamos para a página 1 para evitar erros de índice
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const apartments = await listApartments(loginData)
            // Certifique-se de que é um array, caso venha dentro de um objeto use apartments.data ou similar
            setAllApartments(Array.isArray(apartments) ? apartments : apartments?.data || []);

        } catch (error) {

            console.error(
                'Erro ao carregar dashboard:',
                error
            );
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Função unificada para salvar (se tiver ID edita, senão cria novo)
    const handleSaveApartment = async (apartmentData) => {
        try {
            if (selectedApartmentToEdit) {
                // Edição: envia o ID junto com os dados alterados
                await updateApartment(loginData, selectedApartmentToEdit.id, apartmentData);
            } else {
                // Criação de um novo apartamento
                await createApartment(loginData, apartmentData);
            }
            loadData(); // Recarrega a lista da API
            setSelectedApartmentToEdit(null); // Fecha / limpa o estado de edição
            setIsApartmentModalVisible(false); // Fecha a modal de novo apartamento se estiver aberta
        } catch (error) {
            console.error('Erro ao guardar apartamento:', error);
        }
    };

    // Função chamada ao clicar no lápis (ícone de edição) na tabela
    const handleOpenModalForUpdate = (apartment) => {
        setSelectedApartmentToEdit(apartment);
    };

    // =========================================================
    // LÓGICA DE FILTRAGEM (searchText) E PAGINAÇÃO
    // =========================================================
    const filteredApartments = allApartments.filter((item) => {
        const query = searchText.toLowerCase();
        const numberMatch = String(item.number ?? '').toLowerCase().includes(query);
        const floorMatch = String(item.floor ?? '').toLowerCase().includes(query);
        const typeMatch = String(item.type ?? '').toLowerCase().includes(query);
        const descriptionMatch = String(item.description ?? '').toLowerCase().includes(query);

        return numberMatch || floorMatch || typeMatch || descriptionMatch;
    });

    // Cálculos da paginação
    const totalPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE) || 1;

    // Garante que a página atual não ultrapassa o total de páginas filtradas
    const validCurrentPage = currentPage > totalPages ? totalPages : currentPage;

    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    const paginatedApartments = filteredApartments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        <Loading />
    }
    // =========================================================
    // ERRO
    // =========================================================
    if (error) {
        <Erro message={error} />
    }
    // =========================================================
    // SEM DADOS
    // =========================================================
    if (!allApartments) {
        <NoData />
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#051937" />

            {/* Utilização da Navbar Reutilizável */}
            <Navbar
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Main Layout */}
            <View style={styles.mainLayout}>
                {/* Componente Sidebar Reutilizado com comportamento responsivo */}
                {(!isMobile || isSidebarOpen) && (
                    <Sidebar
                        activeMenu={activeMenu}
                        onSelectMenu={setActiveMenu}
                        loginData={loginData}
                        isOpen={isSidebarOpen}
                        onCloseMobile={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Content Area */}
                <View style={styles.contentContainer}>
                    <ScrollView contentContainerStyle={styles.contentPadding} showsVerticalScrollIndicator={false}>
                        <View style={styles.headerSection}>
                            <View>
                                <Text style={styles.pageTitle}>Apartamentos</Text>
                                <Text style={styles.pageSubtitle}>Gestão de apartamentos do edifício</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={() => setIsApartmentModalVisible(true)}
                            >
                                <Plus color="#FFFFFF" size={18} />
                                <Text style={styles.primaryButtonText}>Novo Apartamento</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.filterCard}>
                            <View style={styles.filterSearch}>
                                <Search color="#94A3B8" size={18} />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Pesquisar por número, andar ou tipo..."
                                    placeholderTextColor="#94A3B8"
                                    value={searchText}
                                    onChangeText={setSearchText}
                                />
                            </View>

                            <View style={styles.dropdownGroup}>
                                <TouchableOpacity style={styles.dropdownButton}>
                                    <Text style={styles.dropdownText}>Todos os estados</Text>
                                    <ChevronDown color="#64748B" size={16} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.dropdownButton}>
                                    <Text style={styles.dropdownText}>Todos os tipos</Text>
                                    <ChevronDown color="#64748B" size={16} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Contentor principal da tabela ocupando 100% da largura */}
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, isMobile ? styles.colIdMobile : styles.colId]}>ID</Text>
                                <Text style={[styles.th, isMobile ? styles.colAndarMobile : styles.colAndar]}>Andar</Text>
                                <Text style={[styles.th, isMobile ? styles.colNumeroMobile : styles.colNumero]}>Número</Text>
                                <Text style={[styles.th, isMobile ? styles.colTipoMobile : styles.colTipo]}>Tipo</Text>

                                {/* Oculta a coluna Descrição em Mobile */}
                                {!isMobile && <Text style={[styles.th, styles.colDescricao]}>Descrição</Text>}

                                {/* Oculta a coluna Estado em Mobile */}
                                {!isMobile && <Text style={[styles.th, styles.colEstado]}>Estado</Text>}

                                <Text style={[styles.th, isMobile ? styles.colAcoesMobile : styles.colAcoes, { textAlign: 'right' }]}>Ações</Text>
                            </View>

                            {/* Mapeamos apenas os itens fatiados para a página atual */}
                            {paginatedApartments.map((item) => (
                                <View key={item.id} style={styles.tableRow}>
                                    <Text style={[styles.td, isMobile ? styles.colIdMobile : styles.colId]}>{item.id}</Text>
                                    <Text style={[styles.td, isMobile ? styles.colAndarMobile : styles.colAndar]}>{item.floor}</Text>
                                    <Text style={[styles.td, isMobile ? styles.colNumeroMobile : styles.colNumero]}>{item.number}</Text>
                                    <Text style={[styles.td, isMobile ? styles.colTipoMobile : styles.colTipo]}>{item.type}</Text>

                                    {/* Oculta os dados da Descrição em Mobile */}
                                    {!isMobile && <Text style={[styles.td, styles.colDescricao]}>{item.description}</Text>}

                                    {/* Oculta os dados do Estado em Mobile */}
                                    {!isMobile && (
                                        <View style={[styles.td, styles.colEstado, styles.statusContainer]}>
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    { backgroundColor: item.occupation_state === 'Ocupado' ? 'rgb(255, 80, 0)' : 'rgb(80, 255, 0)' },
                                                ]}
                                            />
                                            <Text style={styles.statusText}>{item.occupation_state}</Text>
                                        </View>
                                    )}

                                    <View style={[styles.td, isMobile ? styles.colAcoesMobile : styles.colAcoes, styles.actionsContainer]}>
                                        <TouchableOpacity
                                            style={styles.actionBtn}
                                            onPress={() => handleOpenModalForUpdate(item)}
                                        >
                                            <Pencil color="#3B82F6" size={18} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.actionBtn}>
                                            <MoreVertical color="#64748B" size={18} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {paginatedApartments.length === 0 && (
                                <View style={{ padding: 20, alignItems: 'center' }}>
                                    <Text style={{ color: '#64748B', fontSize: 13 }}>Nenhum apartamento encontrado.</Text>
                                </View>
                            )}

                            {/* BARRA DE PAGINAÇÃO DINÂMICA */}
                            <View style={styles.paginationContainer}>
                                <View style={styles.paginationControls}>
                                    {/* Botão Página Anterior */}
                                    <TouchableOpacity
                                        style={[styles.pageArrow, validCurrentPage === 1 && { opacity: 0.5 }]}
                                        disabled={validCurrentPage === 1}
                                        onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <ChevronLeft color="#64748B" size={16} />
                                    </TouchableOpacity>

                                    {/* Gerar botões de números de páginas dinamicamente */}
                                    {Array.from({ length: totalPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = pageNumber === validCurrentPage;
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[styles.pageNumber, isActive && styles.activePage]}
                                                onPress={() => setCurrentPage(pageNumber)}
                                            >
                                                <Text style={isActive ? styles.activePageText : styles.pageText}>
                                                    {pageNumber}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    {/* Botão Próxima Página */}
                                    <TouchableOpacity
                                        style={[styles.pageArrow, validCurrentPage === totalPages && { opacity: 0.5 }]}
                                        disabled={validCurrentPage === totalPages}
                                        onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    >
                                        <ChevronRight color="#64748B" size={16} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.paginationInfo}>
                                    Mostrando {filteredApartments.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredApartments.length)} de {filteredApartments.length}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            {/* Modal para Criar Novo */}
            <NewApartmentModal
                visible={isApartmentModalVisible}
                onClose={() => setIsApartmentModalVisible(false)}
                onSave={handleSaveApartment}
            />

            {/* Modal para Editar Apartamento Existente */}
            <NewApartmentModal
                visible={!!selectedApartmentToEdit}
                apartmentData={selectedApartmentToEdit}
                onClose={() => setSelectedApartmentToEdit(null)}
                onSave={handleSaveApartment}
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
    primaryButton: { backgroundColor: '#0284C7', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, gap: 6 },
    primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
    filterCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' },
    filterSearch: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40, flex: 1, minWidth: 220 },
    // filterInput: { marginLeft: 8, flex: 1, fontSize: 13, color: '#0F172A' },
    filterInput: {
        marginLeft: 8,
        flex: 1,
        height: 30, fontSize: 13,
        color: '#0F172A'
    },
    dropdownGroup: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    dropdownButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40, gap: 8, backgroundColor: '#FFFFFF' },
    dropdownText: { fontSize: 13, color: '#64748B' },

    // Tabela expandida a 100% preenchendo toda a largura útil
    tableContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', paddingBottom: 10 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#F8FAFC', borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', width: '100%' },
    th: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', width: '100%' },
    td: { fontSize: 13, color: '#334155' },

    // Distribuição para Desktop (com todas as colunas)
    colId: { width: '8%' },
    colAndar: { width: '10%' },
    colNumero: { width: '12%' },
    colTipo: { width: '12%' },
    colDescricao: { width: '38%' },
    colEstado: { width: '12%' },
    colAcoes: { width: '8%' },

    // Distribuição para Mobile (sem Descrição e sem Estado, redistribuindo bem o espaço)
    colIdMobile: { width: '18%' },
    colAndarMobile: { width: '20%' },
    colNumeroMobile: { width: '22%' },
    colTipoMobile: { width: '22%' },
    colAcoesMobile: { width: '18%' },

    statusContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 13, color: '#334155', fontWeight: '500' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
    actionBtn: { padding: 4 },
    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, flexWrap: 'wrap', gap: 10 },
    paginationControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pageArrow: { padding: 6, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6 },
    pageNumber: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    activePage: { backgroundColor: '#0284C7' },
    activePageText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
    pageText: { color: '#64748B', fontSize: 12 },
    paginationInfo: { fontSize: 12, color: '#64748B' },
});