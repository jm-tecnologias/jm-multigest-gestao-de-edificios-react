
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
    Search,
    Plus,
    Eye,
    Pencil,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import NewClientModal from './modals/NewClientModal';
import NewMemberModal from './modals/NewMemberModal';
import ViewClientModal from './modals/ViewClientModal';
import { createClient, listClients, updateClient } from '../service/_client-events';
import { Loading, Erro, NoData } from '../components/status-components';
import { getClientApartment, listApartments } from '../service/_apartment-events';
import { createMember, updateMember } from '../service/_member-events';
import { createHistoric } from '../service/_historic-events';
import { listCategories } from '../service/_category-events';

export default function ClientsScreen({ navigation, route }) {
    const { loginData } = route.params ?? {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para controlar a abertura/fecho do Sidebar em Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Deteta o tamanho do ecrã para responsividade (Mobile / Desktop)
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [activeMenu, setActiveMenu] = useState('Clientes');
    const [searchText, setSearchText] = useState('');

    const [isClientModalVisible, setIsClientModalVisible] = useState(false);
    const [selectedClientToView, setSelectedClientToView] = useState(null);

    // Adiciona estes estados no início do teu ClientsScreen:
    const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
    const [activeClientForNewMember, setActiveClientForNewMember] = useState(null);
    const [selectedMemberToEdit, setSelectedMemberToEdit] = useState(null);

    const [packageData, setPackageData] = useState(null)
    const [apartmentCollection, setApartmentCollection] = useState(null);
    const [categoriesList, setCategoriesList] = useState([]);

    const [allClients, setAllClients] = useState([]);
    const [apartmentsMap, setApartmentsMap] = useState({});

    // ESTADO DA PAGINAÇÃO
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const loadData = async (isInitial = false) => {
        try {
            if (isInitial && allClients.length === 0) setLoading(true);
            setError(null);

            const clients = await listClients(loginData);
            setAllClients(Array.isArray(clients) ? clients : clients?.data || []);

            const apartments = await listApartments(loginData);
            setApartmentCollection(apartments);

            const categories = await listCategories(loginData); // função do teu _category-events
            setCategoriesList(Array.isArray(categories) ? categories : categories?.data || []);
            setPackageData({
                apartments: apartments,
                categories: categories
            })

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData(true);
    }, []);

    const handleSaveClient = async (clientData) => {
        try {
            if (packageData?.clientData) {
                await updateClient(loginData, clientData);
                await updateMember(loginData, clientData);
            } else {
                const client = await createClient(loginData, clientData);
                const member = await createMember(loginData, client, clientData);
                await createHistoric(loginData, member, clientData);
            }
            loadData();
            setPackageData(null);
            setIsClientModalVisible(false);
        } catch (error) {  
            console.error('Erro ao guardar cliente: ', error);
        }
    };

    // Função para abrir a modal de edição do membro
    const handleOpenEditMember = (member, client) => {
        setActiveClientForNewMember(client);
        setSelectedMemberToEdit(member);
        setSelectedClientToView(null);
        setIsMemberModalVisible(true);
    };

    // Na função de guardar/atualizar o membro:
    const handleSaveMember = async (memberData) => {
        try {
            if (selectedMemberToEdit) {
                await updateMember(loginData, memberData);
            } else {
                await createMember(loginData, activeClientForNewMember, memberData);
            }

            loadData();
            setSelectedMemberToEdit(null);
            setActiveClientForNewMember(null);
            setIsMemberModalVisible(false);
        } catch (error) {
            console.error('Erro ao guardar/atualizar membro:', error);
        }
    };

    // Função disparada ao clicar em "Novo Membro" dentro da modal de visualização do cliente
    const handleOpenNewMemberFromClient = (client) => {
        setActiveClientForNewMember(client);
        setSelectedClientToView(null);
        setIsMemberModalVisible(true);
    };

    const handleOpenModalForUpdate = (client) => {
        setPackageData({
                clientData: client.members[0],
                apartments: apartmentCollection,
                categories: categoriesList
            })
        
    };

    // =========================================================
    // LÓGICA DE FILTRAGEM E PAGINAÇÃO OTIMIZADA COM useMemo
    // =========================================================
    const filteredClients = useMemo(() => {
        return allClients.filter((item) => {
            const query = searchText.toLowerCase();
            const fullNameMatch = String(item.surname ?? '').toLowerCase().includes(query);
            const nameMatch = String(item.name ?? '').toLowerCase().includes(query);
            return fullNameMatch || nameMatch;
        });
    }, [allClients, searchText]);

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE) || 1;
    const validCurrentPage = currentPage > totalPages ? totalPages : currentPage;

    const paginatedClients = useMemo(() => {
        const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
        return filteredClients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredClients, validCurrentPage]);

    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;

    // =========================================================
    // BUSCA DE APARTAMENTOS EM PARALELO
    // =========================================================
    useEffect(() => {
        const fetchAllApartments = async () => {
            if (!paginatedClients || paginatedClients.length === 0) return;

            const promises = paginatedClients.map(async (client) => {
                try {
                    const data = await getClientApartment(loginData, client.id);
                    return { id: client.id, apartment: data?.number || data?.apartment || 'N/A' };
                } catch (error) {
                    console.error(`Erro ao carregar apto do cliente ${client.id}:`, error);
                    return { id: client.id, apartment: 'Erro' };
                }
            });

            const results = await Promise.all(promises);

            setApartmentsMap((prev) => {
                const updated = { ...prev };
                results.forEach((item) => {
                    updated[item.id] = item.apartment;
                });
                return updated;
            });
        };

        fetchAllApartments();
    }, [paginatedClients, loginData]);

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Erro message={error} />
            </SafeAreaView>
        );
    }

    if (!allClients) {
        return (
            <SafeAreaView style={styles.container}>
                <NoData />
            </SafeAreaView>
        );
    }

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
                        <View style={styles.headerSection}>
                            <View>
                                <Text style={styles.pageTitle}>Clientes e Members</Text>
                                <Text style={styles.pageSubtitle}>Gestão de clientes e seus membros</Text>
                            </View>

                            <View style={styles.headerButtonsGroup}>
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={() => setIsClientModalVisible(true)}
                                >
                                    <Plus color="#FFFFFF" size={18} />
                                    <Text style={styles.primaryButtonText}>Novo Cliente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.filterCard}>
                            <View style={styles.filterSearch}>
                                <Search color="#94A3B8" size={18} />
                                <TextInput
                                    style={styles.filterInput}
                                    placeholder="Pesquisar por nome, documento..."
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
                                    <Text style={styles.dropdownText}>Todos os apartamentos</Text>
                                    <ChevronDown color="#64748B" size={16} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, isMobile ? styles.colIdMobile : styles.colId]}>ID</Text>
                                <Text style={[styles.th, isMobile ? styles.colClienteMobile : styles.colCliente]}>Cliente</Text>
                                {!isMobile && <Text style={[styles.th, styles.colMembers]}>Members</Text>}
                                <Text style={[styles.th, isMobile ? styles.colApartamentoMobile : styles.colApartamento]}>Apartamento</Text>
                                {!isMobile && <Text style={[styles.th, styles.colDescricao]}>Descrição</Text>}
                                {!isMobile && <Text style={[styles.th, styles.colEstado]}>Estado</Text>}
                                <Text style={[styles.th, isMobile ? styles.colAcoesMobile : styles.colAcoes, { textAlign: 'right' }]}>Ações</Text>
                            </View>

                            {loading && allClients.length === 0 ? (
                                <View style={{ padding: 40, alignItems: 'center' }}>
                                    <Loading />
                                </View>
                            ) : (
                                <>
                                    {paginatedClients.map((item) => (
                                        <View key={item.id} style={styles.tableRow}>
                                            <Text style={[styles.td, isMobile ? styles.colIdMobile : styles.colId]}>{item.id}</Text>
                                            <Text style={[styles.td, isMobile ? styles.colClienteMobile : styles.colCliente, { fontWeight: '600', color: '#0F172A' }]} numberOfLines={1}>
                                                {item.name ? `${item.name} ${item.surname || ''}` : item.surname}
                                            </Text>

                                            {!isMobile && <Text style={[styles.td, styles.colMembers]}>{item.num_members}</Text>}
                                            <Text style={[styles.td, isMobile ? styles.colApartamentoMobile : styles.colApartamento]}>
                                                {apartmentsMap[item.id] ?? 'A carregar...'}
                                            </Text>

                                            {!isMobile && <Text style={[styles.td, styles.colDescricao]} numberOfLines={1}>{item.description}</Text>}

                                            {!isMobile && (
                                                <View style={[styles.td, styles.colEstado, styles.statusContainer]}>
                                                    <View
                                                        style={[
                                                            styles.statusDot,
                                                            { backgroundColor: item.status === true ? 'rgb(80, 255, 0)' : 'rgb(255, 80, 0)' },
                                                        ]}
                                                    />
                                                    <Text style={styles.statusText}>{item.status === true ? 'Activo' : 'Inactivo'}</Text>
                                                </View>
                                            )}

                                            <View style={[styles.td, isMobile ? styles.colAcoesMobile : styles.colAcoes, styles.actionsContainer]}>
                                                <TouchableOpacity
                                                    style={styles.actionBtn}
                                                    onPress={() => setSelectedClientToView(item)}
                                                >
                                                    <Eye color="#3B82F6" size={18} />
                                                </TouchableOpacity>
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

                                    {paginatedClients.length === 0 && (
                                        <View style={{ padding: 20, alignItems: 'center' }}>
                                            <Text style={{ color: '#64748B', fontSize: 13 }}>Nenhum cliente encontrado.</Text>
                                        </View>
                                    )}

                                    {/* BARRA DE PAGINAÇÃO RESTAURADA */}
                                    <View style={styles.paginationContainer}>
                                        <View style={styles.paginationControls}>
                                            <TouchableOpacity
                                                style={[styles.pageArrow, validCurrentPage === 1 && { opacity: 0.5 }]}
                                                disabled={validCurrentPage === 1}
                                                onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            >
                                                <ChevronLeft color="#64748B" size={16} />
                                            </TouchableOpacity>

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

                                            <TouchableOpacity
                                                style={[styles.pageArrow, validCurrentPage === totalPages && { opacity: 0.5 }]}
                                                disabled={validCurrentPage === totalPages}
                                                onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            >
                                                <ChevronRight color="#64748B" size={16} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.paginationInfo}>
                                            Mostrando {filteredClients.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredClients.length)} de {filteredClients.length}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Modais */}
            <NewClientModal
                visible={isClientModalVisible}
                packageData={packageData}
                onClose={() => setIsClientModalVisible(false)}
                onSave={handleSaveClient}
            />

            <NewClientModal
                visible={!!packageData?.clientData}
                packageData={packageData}
                onClose={() => setPackageData(null)}
                onSave={handleSaveClient}
            />

            <ViewClientModal
                visible={!!selectedClientToView}
                clientData={selectedClientToView}
                onClose={() => setSelectedClientToView(null)}
                onOpenNewMember={handleOpenNewMemberFromClient}
                onOpenEditMember={handleOpenEditMember}
            />

            <NewMemberModal
                visible={isMemberModalVisible}
                onClose={() => {
                    setIsMemberModalVisible(false);
                    setSelectedMemberToEdit(null);
                    setActiveClientForNewMember(null);
                }}
                clientContext={activeClientForNewMember}
                memberData={selectedMemberToEdit}
                onSave={handleSaveMember}
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
    headerButtonsGroup: { flexDirection: 'row', gap: 10 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
    pageSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
    primaryButton: { backgroundColor: '#0284C7', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, gap: 6 },
    primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
    filterCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' },
    filterSearch: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40, flex: 1, minWidth: 220 },
    filterInput: {
        marginLeft: 8,
        flex: 1,
        height: 30,
        fontSize: 13,
        color: '#0F172A',
    },
    dropdownGroup: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
    dropdownButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 40, gap: 8, backgroundColor: '#FFFFFF' },
    dropdownText: { fontSize: 13, color: '#64748B' },

    tableContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', paddingBottom: 10 },
    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#F8FAFC', borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', width: '100%' },
    th: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center', width: '100%' },
    td: { fontSize: 13, color: '#334155' },

    colId: { width: '10%' },
    colCliente: { width: '20%' },
    colMembers: { width: '10%' },
    colApartamento: { width: '10%' },
    colDescricao: { width: '35%' },
    colEstado: { width: '10%' },
    colAcoes: { width: '5%' },

    colIdMobile: { width: '15%' },
    colClienteMobile: { width: '40%' },
    colApartamentoMobile: { width: '20%' },
    colAcoesMobile: { width: '25%' },

    statusContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 13, color: '#334155', fontWeight: '500' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
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