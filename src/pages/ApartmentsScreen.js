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

import { FileText } from 'lucide-react-native'; // Adicione se quiser um ícone de documento
import { generateApartmentsPdf } from '../utils/generatePdf';
import { getCategory, listCategories } from '../service/_category-events';

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

    const [categoryMap, setCategoryMap] = useState({})

    // 1. Estado para guardar todas as categorias
    const [categoriesList, setCategoriesList] = useState([]);

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

            const categories = await listCategories(loginData); // função do teu _category-events
            setCategoriesList(Array.isArray(categories) ? categories : categories?.data || []);

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
        // console.log(apartmentData)
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
    // const filteredApartments = allApartments.filter((item) => {
    //     const query = searchText.toLowerCase();
    //     const numberMatch = String(item.number ?? '').toLowerCase().includes(query);
    //     const floorMatch = String(item.floor ?? '').toLowerCase().includes(query);
    //     const typeMatch = String(item.type ?? '').toLowerCase().includes(query);
    //     const groupMatch = String(item.group ?? '').toLowerCase().includes(query);
    //     const descriptionMatch = String(item.description ?? '').toLowerCase().includes(query);

    //     return numberMatch || floorMatch || typeMatch || groupMatch || descriptionMatch;
    // });

    // =========================================================
    // LÓGICA DE FILTRAGEM (searchText) E PAGINAÇÃO
    // =========================================================
    const filteredApartments = allApartments.filter((item) => {
        const query = searchText.toLowerCase();

        // Obtém os dados da categoria correspondente a este apartamento no categoryMap
        const categoryData = categoryMap[item.category_id] || {};

        const numberMatch = String(item.number ?? '').toLowerCase().includes(query);
        const floorMatch = String(item.floor ?? '').toLowerCase().includes(query);
        const typeMatch = String(categoryData.type ?? item.type ?? '').toLowerCase().includes(query);

        // Agora verifica o grupo vindo do categoryMap (ou diretamente do item se existir)
        const groupValue = categoryData.group ?? item.group ?? '';
        const groupMatch = String(groupValue).toLowerCase().includes(query);

        const descriptionMatch = String(item.description ?? '').toLowerCase().includes(query);

        return numberMatch || floorMatch || typeMatch || groupMatch || descriptionMatch;
    });

    // Cálculos da paginação
    const totalPages = Math.ceil(filteredApartments.length / ITEMS_PER_PAGE) || 1;

    // Garante que a página atual não ultrapassa o total de páginas filtradas
    const validCurrentPage = currentPage > totalPages ? totalPages : currentPage;

    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    const paginatedApartments = filteredApartments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // useEffect(() => {
    //     const fetchAllCategories = async () => {
    //         if (!paginatedApartments || paginatedApartments.length === 0) return

    //         const promises = paginatedApartments.map(async (apartment) => {
    //             try {
    //                 const data = await getCategory(loginData, apartment.category_id)

    //                 return { category_id: apartment.category_id, category: data || data?.category || 'N/A' }
    //             } catch (error) {
    //                 console.error(`Erro ao carregar categoria do apartamento ${apartment.category_id}: `, error)
    //                 return { category_id: apartment.category_id, category: 'Erro' }
    //             }
    //         })

    //         const results = await Promise.all(promises)

    //         setCategoryMap((prev) => {
    //             const updated = { ...prev };
    //             results.forEach((item) => {
    //                 updated[item.category_id] = item.category;
    //             });
    //             return updated;
    //         });
    //     }
    //     fetchAllCategories()
    // }, [paginatedApartments, loginData])
    useEffect(() => {
        const fetchAllCategories = async () => {
            if (!paginatedApartments || paginatedApartments.length === 0) return;

            // Filtra apenas IDs únicos que ainda não estão em cache no categoryMap
            const uniqueIds = [
                ...new Set(
                    paginatedApartments
                        .map((apt) => apt.category_id)
                        .filter((id) => id && !categoryMap[id])
                ),
            ];

            if (uniqueIds.length === 0) return;

            const promises = uniqueIds.map(async (categoryId) => {
                try {
                    const data = await getCategory(loginData, categoryId);
                    return { category_id: categoryId, category: data?.category || data || null };
                } catch (error) {
                    console.error(`Erro ao carregar categoria ${categoryId}:`, error);
                    return { category_id: categoryId, category: { type: 'Erro' } };
                }
            });

            const results = await Promise.all(promises);

            setCategoryMap((prev) => {
                const updated = { ...prev };
                results.forEach((item) => {
                    // CORREÇÃO 1: Usar item.category_id em vez de item.id
                    updated[item.category_id] = item.category;
                });
                return updated;
            });
        };

        fetchAllCategories();
    }, [allApartments, validCurrentPage, searchText, loginData]);

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
                loginData={loginData}
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
                            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                                {/* Botão de Gerar PDF */}
                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => generateApartmentsPdf(filteredApartments)}
                                >
                                    <FileText color="#0284C7" size={18} />
                                    <Text style={styles.secondaryButtonText}>Exportar PDF</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={() => setIsApartmentModalVisible(true)}
                                >
                                    <Plus color="#FFFFFF" size={18} />
                                    <Text style={styles.primaryButtonText}>Novo Apartamento</Text>
                                </TouchableOpacity>
                            </View>
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
                            {/* Cabeçalho da Tabela */}
                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, isMobile ? styles.colIdMobile : styles.colId]}>ID</Text>
                                {!isMobile && <Text style={[styles.th, styles.colGrupo]}>Grupo</Text>}
                                <Text style={[styles.th, isMobile ? styles.colAndarMobile : styles.colAndar]}>Andar</Text>
                                <Text style={[styles.th, isMobile ? styles.colNumeroMobile : styles.colNumero]}>Número</Text>
                                <Text style={[styles.th, isMobile ? styles.colTipoMobile : styles.colTipo]}>Tipo</Text>
                                {!isMobile && <Text style={[styles.th, styles.colDescricao]}>Descrição</Text>}
                                {!isMobile && <Text style={[styles.th, styles.colPreco]}>Preço</Text>}
                                {!isMobile && <Text style={[styles.th, styles.colEstado]}>Estado</Text>}
                                {!isMobile && <Text style={[styles.th, styles.colEstado2]}>Activo</Text>}
                                <Text style={[styles.th, isMobile ? styles.colAcoesMobile : styles.colAcoes, { textAlign: 'right' }]}>Ações</Text>
                            </View>

                            {/* Linhas da Tabela */}
                            {paginatedApartments.map((item) => (
                                <View key={item.id} style={styles.tableRow}>
                                    <Text style={[styles.td, isMobile ? styles.colIdMobile : styles.colId]}>{item.id}</Text>

                                    {!isMobile && (
                                        <Text style={[styles.td, styles.colGrupo]} numberOfLines={1}>
                                            {categoryMap[item.category_id]?.group ?? '-'}
                                        </Text>
                                    )}

                                    <Text style={[styles.td, isMobile ? styles.colAndarMobile : styles.colAndar]}>{item.floor}</Text>
                                    <Text style={[styles.td, isMobile ? styles.colNumeroMobile : styles.colNumero, { fontWeight: '600', color: '#0F172A' }]}>
                                        {item.number}
                                    </Text>

                                    <Text style={[styles.td, isMobile ? styles.colTipoMobile : styles.colTipo]} numberOfLines={1}>
                                        {categoryMap[item.category_id]?.type ?? '-'}
                                    </Text>

                                    {!isMobile && (
                                        <Text style={[styles.td, styles.colDescricao]} numberOfLines={1}>
                                            {item.description || '-'}
                                        </Text>
                                    )}

                                    {!isMobile && (
                                        <Text style={[styles.td, styles.colPreco]} numberOfLines={1}>
                                            {categoryMap[item.category_id]?.price != null
                                                ? `${Number(categoryMap[item.category_id].price).toLocaleString('pt-MZ')} MT`
                                                : '-'}
                                        </Text>
                                    )}

                                    {!isMobile && (
                                        <View style={[styles.td, styles.colEstado, styles.statusContainer]}>
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    { backgroundColor: item.occupation_state === 'Ocupado' ? '#EF4444' : '#10B981' },
                                                ]}
                                            />
                                            <Text style={styles.statusText}>{item.occupation_state}</Text>
                                        </View>
                                    )}

                                    {!isMobile && (
                                        <View style={[styles.td, styles.colEstado2, styles.statusContainer]}>
                                            <View
                                                style={[
                                                    styles.statusDot,
                                                    { backgroundColor: item.status === false ? '#EF4444' : '#10B981' },
                                                ]}
                                            />
                                            <Text style={styles.statusText}>{item.status === false ? 'Não' : 'Sim'}</Text>
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
                categories={categoriesList}
                onClose={() => setIsApartmentModalVisible(false)}
                onSave={handleSaveApartment}
            />
            {/* Modal para Editar Apartamento Existente */}
            <NewApartmentModal
                visible={!!selectedApartmentToEdit}
                apartmentData={selectedApartmentToEdit}
                categories={categoriesList}
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
    // Tabela expandida a 100% preenchendo toda a largura útil
    tableContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '100%',
        paddingBottom: 12,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        width: '100%',
    },
    th: {
        fontSize: 12,
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        paddingRight: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingVertical: 13,
        paddingHorizontal: 16,
        alignItems: 'center',
        width: '100%',
    },
    td: {
        fontSize: 13,
        color: '#334155',
        paddingRight: 8,
    },

    // Distribuição Desktop (Soma exacta = 100%)
    colId: { width: '5%' },
    colGrupo: { width: '9%' },
    colAndar: { width: '7%' },
    colNumero: { width: '8%' },
    colTipo: { width: '10%' },
    colDescricao: { width: '25%' },
    colPreco: { width: '11%' },
    colEstado: { width: '10%' },
    colEstado2: { width: '8%' },
    colAcoes: { width: '7%', paddingRight: 0 },

    // Distribuição Mobile (Soma exacta = 100%)
    colIdMobile: { width: '14%' },
    colAndarMobile: { width: '18%' },
    colNumeroMobile: { width: '22%' },
    colTipoMobile: { width: '26%' },
    colAcoesMobile: { width: '20%', paddingRight: 0 },

    statusContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 13, color: '#334155', fontWeight: '500' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10 },
    actionBtn: { padding: 4 },

    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, flexWrap: 'wrap', gap: 10 },
    paginationControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pageArrow: { padding: 6, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6 },
    pageNumber: { width: 28, height: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    activePage: { backgroundColor: '#0284C7' },
    activePageText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
    pageText: { color: '#64748B', fontSize: 12 },
    paginationInfo: { fontSize: 12, color: '#64748B' },

    secondaryButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#0284C7', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, gap: 6 },
    secondaryButtonText: { color: '#0284C7', fontWeight: '600', fontSize: 14 },
});