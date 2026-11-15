import React, { useState, useEffect, useRef, useMemo } from 'react';
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
    QrCode,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import MemberAccessModal from './modals/MemberAccessModal';
import VisitorAccessModal from './modals/VisitorAccessModal';
import { createMemberCheckInOut, getMember, scanMember } from '../service/_member-events';
import { getApartment } from '../service/_apartment-events';
import { createVisitorCheckInOut, listVisitors, scanVisitor } from '../service/_visitor-events';
import { Erro, Loading, NoData } from '../components/status-components';

const ITEMS_PER_PAGE = 4;

export default function SecurityScreen({ navigation, route }) {
    const { loginData } = route.params ?? {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allVisitors, setAllVisitors] = useState([]);

    const [activeMenu, setActiveMenu] = useState('Segurança');
    const [selectedVisitor, setSelectedVisitor] = useState('1');

    const [tokenInput, setTokenInput] = useState('');
    const inputRef = useRef(null);

    const [scannedVisitorModal, setScannedVisitorModal] = useState(false);
    const [scannedMemberModal, setScannedMemberModal] = useState(false);
    const [actionNotes, setActionNotes] = useState('');
    const [scannedData, setScannedData] = useState(null);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Estados de Paginação Independentes
    const [waitingPage, setWaitingPage] = useState(1);
    const [recentPage, setRecentPage] = useState(1);

    // =========================================================
    // FILTRAGEM CORRETA DOS DADOS POR STATUS
    // =========================================================
    const waitingVisitors = useMemo(() => {
        return allVisitors.filter(item => item.status === 'Esperando Check-In');
    }, [allVisitors]);

    // Exemplo para "Últimos acessos" (ajuste a condição de status conforme a sua regra de negócio, ex: 'Concluído' ou diferente de 'Esperando Check In')
    const recentAccessList = useMemo(() => {
        return allVisitors.filter(item => item.status !== 'Esperando Check-In');
    }, [allVisitors]);

    // =========================================================
    // LÓGICA DE PAGINAÇÃO PARA VISITANTES AGUARDANDO
    // =========================================================
    const totalWaitingPages = Math.ceil(waitingVisitors.length / ITEMS_PER_PAGE) || 1;
    const validWaitingPage = waitingPage > totalWaitingPages ? totalWaitingPages : waitingPage;
    const waitingStartIndex = (validWaitingPage - 1) * ITEMS_PER_PAGE;

    const paginatedWaiting = useMemo(() => {
        return waitingVisitors.slice(waitingStartIndex, waitingStartIndex + ITEMS_PER_PAGE);
    }, [waitingVisitors, waitingStartIndex]);

    // =========================================================
    // LÓGICA DE PAGINAÇÃO PARA ÚLTIMOS ACESSOS
    // =========================================================
    const totalRecentPages = Math.ceil(recentAccessList.length / ITEMS_PER_PAGE) || 1;
    const validRecentPage = recentPage > totalRecentPages ? totalRecentPages : recentPage;
    const recentStartIndex = (validRecentPage - 1) * ITEMS_PER_PAGE;

    const paginatedRecent = useMemo(() => {
        return recentAccessList.slice(recentStartIndex, recentStartIndex + ITEMS_PER_PAGE);
    }, [recentAccessList, recentStartIndex]);

    const loadData = async (isInitial = false) => {
        try {
            if (isInitial && allVisitors.length === 0) setLoading(true);
            setError(null);

            const visitor = await listVisitors(loginData);
            setAllVisitors(Array.isArray(visitor) ? visitor : visitor?.data || []);
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

    const handleScanSubmit = async () => {
        const finalToken = tokenInput.trim();
        if (!finalToken) return;

        if (finalToken.toUpperCase().startsWith('V') || finalToken.length % 2 === 0) {
            const visitor = await scanVisitor(loginData, finalToken);
            const member = await getMember(loginData, visitor);
            const apartment = await getApartment(loginData, member.apartment_id);

            setScannedData({
                tipo: 'visitante',
                visitor: visitor,
                member: member,
                apartment: apartment,
            });
            setActionNotes('');
            setScannedVisitorModal(true);
        } else {
            const member = await scanMember(loginData, finalToken);
            const apartment = await getApartment(loginData, member.apartment_id);

            setScannedData({
                tipo: 'membro',
                member: member,
                apartment: apartment
            });
            setActionNotes('');
            setScannedMemberModal(true);
        }

        setTokenInput('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleConfirmAction = async (actionType) => {
        if (scannedData?.tipo == 'membro') {
            const checkInOutData = {
                member_id: scannedData?.member?.id,
                status: actionType,
                note: `${actionNotes || 'Sem notas'}`
            };
            await createMemberCheckInOut(loginData, checkInOutData);
        } else {
            const checkInOutData = {
                visitor_id: scannedData?.visitor.id,
                status: actionType,
                note: `${actionNotes || 'Sem notas'}`
            };
            await createVisitorCheckInOut(loginData, checkInOutData);
        }

        setScannedVisitorModal(false);
        setScannedMemberModal(false);
        loadData(); // Recarrega os dados após a ação
    };

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
    if (!allVisitors) {
        <NoData />
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
                                <Text style={styles.pageTitle}>Portaria / Segurança</Text>
                                <Text style={styles.pageSubtitle}>Controle de acesso e check-in/out</Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>10 de Setembro de 2026</Text>
                                <Text style={styles.timeText}>10:45</Text>
                            </View>
                        </View>

                        <View style={styles.topGridRow}>
                            {/* Bloco 1: Leitura via Leitor Físico */}
                            <View style={[styles.card, styles.scannerCard]}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Leitor Físico / Token</Text>
                                    <QrCode color="#0284C7" size={18} />
                                </View>

                                <View style={styles.qrIconContainer}>
                                    <QrCode color="#0284C7" size={48} />
                                </View>

                                <Text style={styles.qrInstructionText}>Passe o código no leitor ou digite manualmente</Text>

                                <View style={styles.tokenInputWrapper}>
                                    <TextInput
                                        ref={inputRef}
                                        style={styles.tokenInput}
                                        placeholder="Aguardando leitura do token..."
                                        placeholderTextColor="#94A3B8"
                                        value={tokenInput}
                                        onChangeText={(text) => setTokenInput(text)}
                                        onSubmitEditing={handleScanSubmit}
                                        autoFocus={true}
                                        blurOnSubmit={false}
                                        returnKeyType="done"
                                    />
                                    <TouchableOpacity style={styles.scannerIconButton}>
                                        <QrCode color="#0284C7" size={20} />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.verifyButton} onPress={handleScanSubmit}>
                                    <Text style={styles.verifyButtonText}>Verificar Token</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bloco 2: Visitantes aguardando */}
                            <View style={[styles.card, styles.waitingCard]}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Visitantes aguardando</Text>
                                    <View style={styles.badgeCount}>
                                        <Text style={styles.badgeCountText}>{waitingVisitors.length}</Text>
                                    </View>
                                </View>

                                <View style={styles.miniTable}>
                                    <View style={styles.miniHeader}>
                                        <Text style={[styles.miniTh, { width: isMobile ? '40%' : '25%' }]}>Nome</Text>
                                        {!isMobile && <Text style={[styles.miniTh, { width: '25%' }]}>Descrição</Text>}
                                        <Text style={[styles.miniTh, { width: isMobile ? '30%' : '15%' }]}>Data</Text>
                                        <Text style={[styles.miniTh, { width: isMobile ? '30%' : '15%' }]}>Hora</Text>
                                        {!isMobile && <Text style={[styles.miniTh, { width: '20%' }]}>Criado Em</Text>}
                                    </View>

                                    {paginatedWaiting.length > 0 ? (
                                        paginatedWaiting.map((item) => {
                                            const isSelected = selectedVisitor === item.id;
                                            return (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    style={[styles.miniRow, isSelected && styles.miniRowSelected]}
                                                    onPress={() => setSelectedVisitor(item.id)}
                                                >
                                                    <Text style={[styles.miniTd, { width: isMobile ? '40%' : '25%', fontWeight: '600', color: '#0F172A' }]} numberOfLines={1}>{item.name}</Text>
                                                    {!isMobile && <Text style={[styles.miniTd, { width: '25%' }]} numberOfLines={1}>{item.description}</Text>}
                                                    <Text style={[styles.miniTd, { width: isMobile ? '30%' : '15%' }]}>{item.visitor_date}</Text>
                                                    <Text style={[styles.miniTd, { width: isMobile ? '30%' : '15%' }]}>{item.visitor_time}</Text>
                                                    {!isMobile && <Text style={[styles.miniTd, { width: '20%' }]} numberOfLines={1}>{item.created_at}</Text>}
                                                </TouchableOpacity>
                                            );
                                        })
                                    ) : (
                                        <View style={{ padding: 15, alignItems: 'center' }}>
                                            <Text style={{ color: '#64748B', fontSize: 12 }}>Nenhum visitante aguardando.</Text>
                                        </View>
                                    )}
                                </View>

                                {/* Paginação: Visitantes Aguardando */}
                                <View style={styles.paginationContainer}>
                                    <View style={styles.paginationControls}>
                                        <TouchableOpacity
                                            style={[styles.pageArrow, validWaitingPage === 1 && { opacity: 0.5 }]}
                                            disabled={validWaitingPage === 1}
                                            onPress={() => setWaitingPage(prev => Math.max(prev - 1, 1))}
                                        >
                                            <ChevronLeft color="#64748B" size={14} />
                                        </TouchableOpacity>

                                        {Array.from({ length: totalWaitingPages }, (_, index) => {
                                            const pageNumber = index + 1;
                                            const isActive = pageNumber === validWaitingPage;
                                            return (
                                                <TouchableOpacity
                                                    key={pageNumber}
                                                    style={[styles.pageNumber, isActive && styles.activePage]}
                                                    onPress={() => setWaitingPage(pageNumber)}
                                                >
                                                    <Text style={isActive ? styles.activePageText : styles.pageText}>
                                                        {pageNumber}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}

                                        <TouchableOpacity
                                            style={[styles.pageArrow, validWaitingPage === totalWaitingPages && { opacity: 0.5 }]}
                                            disabled={validWaitingPage === totalWaitingPages}
                                            onPress={() => setWaitingPage(prev => Math.min(prev + 1, totalWaitingPages))}
                                        >
                                            <ChevronRight color="#64748B" size={14} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.paginationInfo}>
                                        {waitingVisitors.length > 0 ? waitingStartIndex + 1 : 0}-{Math.min(waitingStartIndex + ITEMS_PER_PAGE, waitingVisitors.length)} de {waitingVisitors.length}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Bottom Section: Últimos acessos */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Últimos acessos</Text>

                            <View style={styles.tableHeader}>
                                <Text style={[styles.th, { width: isMobile ? '40%' : '25%' }]}>Visitante</Text>
                                {!isMobile && <Text style={[styles.th, { width: '25%' }]}>Descrição</Text>}
                                {!isMobile && <Text style={[styles.th, { width: '20%' }]}>Data / Hora</Text>}
                                <Text style={[styles.th, { width: isMobile ? '35%' : '15%' }]}>Status</Text>
                                <Text style={[styles.th, { width: isMobile ? '25%' : '15%' }]}>Actualizado Em</Text>
                            </View>

                            {paginatedRecent.length > 0 ? (
                                paginatedRecent.map((acc) => (
                                    <View key={acc.id} style={styles.tableRow}>
                                        <Text style={[styles.td, { width: isMobile ? '40%' : '25%', fontWeight: '600', color: '#0F172A' }]} numberOfLines={1}>{acc.name}</Text>
                                        {!isMobile && <Text style={[styles.td, { width: '25%' }]} numberOfLines={1}>{acc.description}</Text>}
                                        {!isMobile && <Text style={[styles.td, { width: '20%' }]}>{acc.visitor_date} / {acc.visitor_time}</Text>}
                                        <Text style={[styles.td, { width: isMobile ? '35%' : '15%', color: '#0284C7', fontWeight: '600' }]} numberOfLines={1}>{acc.status}</Text>
                                        <Text style={[styles.td, { width: isMobile ? '25%' : '15%' }]} numberOfLines={1}>{acc.updated_at || '-'}</Text>
                                    </View>
                                ))
                            ) : (
                                <View style={{ padding: 15, alignItems: 'center' }}>
                                    <Text style={{ color: '#64748B', fontSize: 12 }}>Nenhum acesso recente encontrado.</Text>
                                </View>
                            )}

                            {/* Paginação: Últimos Acessos */}
                            <View style={styles.paginationContainer}>
                                <View style={styles.paginationControls}>
                                    <TouchableOpacity
                                        style={[styles.pageArrow, validRecentPage === 1 && { opacity: 0.5 }]}
                                        disabled={validRecentPage === 1}
                                        onPress={() => setRecentPage(prev => Math.max(prev - 1, 1))}
                                    >
                                        <ChevronLeft color="#64748B" size={16} />
                                    </TouchableOpacity>

                                    {Array.from({ length: totalRecentPages }, (_, index) => {
                                        const pageNumber = index + 1;
                                        const isActive = pageNumber === validRecentPage;
                                        return (
                                            <TouchableOpacity
                                                key={pageNumber}
                                                style={[styles.pageNumber, isActive && styles.activePage]}
                                                onPress={() => setRecentPage(pageNumber)}
                                            >
                                                <Text style={isActive ? styles.activePageText : styles.pageText}>
                                                    {pageNumber}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}

                                    <TouchableOpacity
                                        style={[styles.pageArrow, validRecentPage === totalRecentPages && { opacity: 0.5 }]}
                                        disabled={validRecentPage === totalRecentPages}
                                        onPress={() => setRecentPage(prev => Math.min(prev + 1, totalRecentPages))}
                                    >
                                        <ChevronRight color="#64748B" size={16} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.paginationInfo}>
                                    Mostrando {recentAccessList.length > 0 ? recentStartIndex + 1 : 0} - {Math.min(recentStartIndex + ITEMS_PER_PAGE, recentAccessList.length)} de {recentAccessList.length}
                                </Text>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View>

            {/* Modais Externas Integradas */}
            <VisitorAccessModal
                visible={scannedVisitorModal}
                onClose={() => setScannedVisitorModal(false)}
                scannedData={scannedData}
                actionNotes={actionNotes}
                setActionNotes={setActionNotes}
                onConfirmAction={handleConfirmAction}
            />

            <MemberAccessModal
                visible={scannedMemberModal}
                onClose={() => setScannedMemberModal(false)}
                scannedData={scannedData}
                actionNotes={actionNotes}
                setActionNotes={setActionNotes}
                onConfirmAction={handleConfirmAction}
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
    dateContainer: { alignItems: 'flex-end' },
    dateText: { fontSize: 13, color: '#334155', fontWeight: '600' },
    timeText: { fontSize: 12, color: '#64748B' },

    topGridRow: { flexDirection: 'row', gap: 16, marginBottom: 20, flexWrap: 'wrap' },
    card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 18, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, width: '100%' },
    scannerCard: { flex: 1, minWidth: 280 },
    waitingCard: { flex: 1.4, minWidth: 300 },

    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
    badgeCount: { backgroundColor: '#0284C7', width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    badgeCountText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },

    qrIconContainer: { alignItems: 'center', marginVertical: 10 },
    qrInstructionText: { textAlign: 'center', fontSize: 12, color: '#64748B', marginBottom: 14 },

    tokenInputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 42, marginBottom: 14 },
    tokenInput: {
        flex: 1,
        height: 30,
        fontSize: 13,
        color: '#0F172A'
    },
    scannerIconButton: { padding: 4 },
    verifyButton: { backgroundColor: '#0284C7', borderRadius: 8, paddingVertical: 11, alignItems: 'center' },
    verifyButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },

    miniTable: { marginBottom: 10 },
    miniHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8, marginBottom: 6 },
    miniTh: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
    miniRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    miniRowSelected: { backgroundColor: '#F8FAFC' },
    miniTd: { fontSize: 12, color: '#334155' },

    tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingVertical: 10, marginTop: 8, marginBottom: 6, width: '100%' },
    th: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC', width: '100%' },
    td: { fontSize: 13, color: '#334155' },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f7a121' },
    statusText: { fontSize: 13, color: '#334155', fontWeight: '500' },

    // Estilos da Paginação
    paginationContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, flexWrap: 'wrap', gap: 10 },
    paginationControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    pageArrow: { padding: 5, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 6 },
    pageNumber: { width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
    activePage: { backgroundColor: '#0284C7' },
    activePageText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
    pageText: { color: '#64748B', fontSize: 12 },
    paginationInfo: { fontSize: 12, color: '#64748B' },
});