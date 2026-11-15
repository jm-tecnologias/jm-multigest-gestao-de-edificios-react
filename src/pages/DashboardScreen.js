

import React, { useState, useEffect, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import {
    Home,
    Users,
    UserCheck,
    Briefcase,
    Check,
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Erro, Loading, NoData } from '../components/status-components';
import { listApartments } from '../service/_apartment-events';
import { listClients } from '../service/_client-events';
import { listMembers } from '../service/_member-events';
import { listVisitors } from '../service/_visitor-events';
import { dateFormater } from '../service/_date-time-formarter';

const RECENT_ACTIVITIES = [
    { id: '1', data: '10:32', utilizador: 'security01', acao: 'Check In Member', estado: 'Sucesso' },
    { id: '2', data: '10:15', utilizador: 'admin', acao: 'Novo apartamento', estado: 'Sucesso' },
    { id: '3', data: '09:54', utilizador: 'security01', acao: 'Check In Visitor', estado: 'Sucesso' },
    { id: '4', data: '09:20', utilizador: 'amilcar', acao: 'Criação de cliente', estado: 'Sucesso' },
    { id: '5', data: '08:45', utilizador: 'admin', acao: 'Atualização de dados', estado: 'Sucesso' },
];

export default function DashboardScreen({ route }) {
    const { loginData } = route.params ?? {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenu, setActiveMenu] = useState('Dashboard');

    // Guardamos todos os apartamentos vindos da API
    const [allApartments, setAllApartments] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [allVisitors, setAllVisitors] = useState([]);

    // Estado para controlar a abertura/fecho do Sidebar em Mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Deteta o tamanho do ecrã para responsividade
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const apartments = await listApartments(loginData)
            setAllApartments(apartments);

            const clients = await listClients(loginData)
            setAllClients(clients)

            const members = await listMembers(loginData)
            setAllMembers(members)

            const visitors = await listVisitors(loginData)
            setAllVisitors(visitors)

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

    useEffect(() => {
        loadData()
    }, []);

    // ====================================================
    // APARTMENTS COUNTING FOR DASHBOARD
    // ====================================================
    const activeApartments = useMemo(() => {
        return allApartments.filter(item => item.status === true)
    }, [allApartments])

    const freeApartments = useMemo(() => {
        return allApartments.filter(item => item.occupation_state === 'Livre' && item.status === true )
    },[allApartments])

    const busyApartments = useMemo(() => {
        return allApartments.filter(item => item.occupation_state === 'Ocupado'  && item.status === true )
    },[allApartments])

    // ====================================================
    // CLIENTS COUNTING FOR DASHBOARD
    // ====================================================
    const activeClients = useMemo(() => {
        return allClients.filter(item => item.status === true)
    }, [allClients])

    // ====================================================
    // MEMBERS COUNTING FOR DASHBOARD
    // ====================================================
    const activeMembers = useMemo(() => {
        return allMembers.filter(item => item.status === true)
    }, [allMembers])

    // ====================================================
    // VISITORS COUNTING FOR DASHBOARD
    // ====================================================
    const dataActual = dateFormater(new Date())
    const checkInVisitors = useMemo(() => {
        return allVisitors.filter(item => item.status === 'Esperando Check-In' && item.visitor_date === dataActual)
    }, [allVisitors])

    const checkOutVisitors = useMemo(() => {
        return allVisitors.filter(item => item.status === 'Esperando Check-Out' && item.visitor_date === dataActual)
    }, [allVisitors])

    const canceledVisitors = useMemo(() => {
        return allVisitors.filter(item => item.status === 'Convite Cancelado' && item.visitor_date === dataActual)
    }, [allVisitors])

    const expiredVisitors = useMemo(() => {
        return allVisitors.filter(item => item.status === 'Convite Expirado' && item.visitor_date === dataActual)
    }, [allVisitors])

    const concludedVisitors = useMemo(() => {
        return allVisitors.filter(item => item.status === 'Visita Concluída' && item.visitor_date === dataActual)
    }, [allVisitors])

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
    if (!allApartments || !allClients || !allMembers) {
        <NoData />
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#051937" />

            {/* Utilização da Navbar Reutilizável com suporte mobile */}
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

                        {/* Header Section */}
                        <View style={styles.headerSection}>
                            <View>
                                <Text style={styles.pageTitle}>Dashboard</Text>
                                <Text style={styles.pageSubtitle}>Visão geral do condomínio</Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dateText}>10 de Setembro de 2026</Text>
                                <Text style={styles.timeText}>10:32</Text>
                            </View>
                        </View>

                        {/* Top Stat Cards (4 colunas responsivas) */}
                        <View style={styles.statsCardsRow}>
                            {/* Card 1: Apartamentos */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <View style={[styles.statIconBox, { backgroundColor: '#E0F2FE' }]}>
                                        <Home color="#0284C7" size={20} />
                                    </View>
                                    <View>
                                        <Text style={styles.statLabel}>Apartamentos</Text>
                                        <Text style={styles.statValue}>{activeApartments.length}</Text>
                                        <Text style={styles.statSubValue}>ativos</Text>
                                    </View>
                                </View>
                                <Text style={styles.statFooterText}>{busyApartments.length} ocupados</Text>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: `${(busyApartments.length*100)/activeApartments.length}%`, backgroundColor: '#0284C7' }]} />
                                </View>
                                <Text style={styles.progressPercentage}>{`${Math.ceil((busyApartments.length*100)/activeApartments.length)}%`}</Text>
                            </View>

                            {/* Card 2: Clientes */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <View style={[styles.statIconBox, { backgroundColor: '#E0E7FF' }]}>
                                        <Users color="#4F46E5" size={20} />
                                    </View>
                                    <View>
                                        <Text style={styles.statLabel}>Clientes</Text>
                                        <Text style={styles.statValue}>{activeClients.length}</Text>
                                        <Text style={styles.statSubValue}>ativos</Text>
                                    </View>
                                </View>
                                <Text style={styles.statFooterText}>&nbsp;</Text>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: `${Math.ceil((activeClients.length*100)/allClients.length)}%`, backgroundColor: '#4F46E5' }]} />
                                </View>
                                <Text style={styles.progressPercentage}>{`${Math.ceil((activeClients.length*100)/allClients.length)}%`}</Text>
                            </View>

                            {/* Card 3: Members */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <View style={[styles.statIconBox, { backgroundColor: '#D1FAE5' }]}>
                                        <UserCheck color="#10B981" size={20} />
                                    </View>
                                    <View>
                                        <Text style={styles.statLabel}>Members</Text>
                                        <Text style={styles.statValue}>{activeMembers.length}</Text>
                                        <Text style={styles.statSubValue}>ativos</Text>
                                    </View>
                                </View>
                                <Text style={styles.statFooterText}>&nbsp;</Text>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: `${Math.ceil((activeMembers.length*100)/allMembers.length)}%`, backgroundColor: '#10B981' }]} />
                                </View>
                                <Text style={styles.progressPercentage}>{`${Math.ceil((activeMembers.length*100)/allMembers.length)}%`}</Text>
                            </View>

                            {/* Card 4: Funcionários */}
                            <View style={styles.statCard}>
                                <View style={styles.statHeader}>
                                    <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                                        <Briefcase color="#D97706" size={20} />
                                    </View>
                                    <View>
                                        <Text style={styles.statLabel}>Funcionários</Text>
                                        <Text style={styles.statValue}>24</Text>
                                        <Text style={styles.statSubValue}>ativos</Text>
                                    </View>
                                </View>
                                <Text style={styles.statFooterText}>&nbsp;</Text>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: '88%', backgroundColor: '#D97706' }]} />
                                </View>
                                <Text style={styles.progressPercentage}>88%</Text>
                            </View>
                        </View>

                        {/* Bottom Section (3 Blocos: Ocupação, Visitantes Hoje, Atividade Recente) */}
                        <View style={styles.bottomSectionRow}>

                            {/* Bloco 1: Ocupação do Edifício */}
                            <View style={[styles.bottomCard, styles.flexCard]}>
                                <Text style={styles.cardTitle}>Ocupação do Edifício</Text>

                                <View style={styles.chartContainer}>
                                    <View style={styles.donutCircle}>
                                        <Text style={styles.donutPercentage}>{`${Math.ceil((busyApartments.length*100)/activeApartments.length)}%`}</Text>
                                    </View>
                                </View>

                                <Text style={styles.donutSubText}>Apartamentos ocupados</Text>
                                <Text style={styles.donutCount}>{busyApartments.length} / {activeApartments.length}</Text>

                                <View style={styles.legendContainer}>
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: 'rgb(255, 80, 0)' }]} />
                                        <Text style={styles.legendText}>Ocupados</Text>
                                        <Text style={styles.legendValue}>{busyApartments.length}</Text>
                                    </View>
                                    <View style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: 'rgb(80, 255, 0)' }]} />
                                        <Text style={styles.legendText}>Livres</Text>
                                        <Text style={styles.legendValue}>{freeApartments.length}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Bloco 2: Visitantes hoje */}
                            <View style={[styles.bottomCard, styles.flexCard]}>
                                <Text style={styles.cardTitle}>Visitantes hoje</Text>

                                <View style={styles.visitorRow}>
                                    <View style={[styles.visitorIconBox, { backgroundColor: '#E0F2FE' }]}>
                                        <Users color="#0284C7" size={18} />
                                    </View>
                                    <Text style={styles.visitorLabel}>Esperando Check-in</Text>
                                    <Text style={styles.visitorValue}>{checkInVisitors.length}</Text>
                                </View>

                                <View style={styles.visitorRow}>
                                    <View style={[styles.visitorIconBox, { backgroundColor: '#E0F2FE' }]}>
                                        <Users color="#0284C7" size={18} />
                                    </View>
                                    <Text style={styles.visitorLabel}>Esperando Check-Out</Text>
                                    <Text style={styles.visitorValue}>{checkOutVisitors.length}</Text>
                                </View>

                                <View style={styles.visitorRow}>
                                    <View style={[styles.visitorIconBox, { backgroundColor: '#FEF3C7' }]}>
                                        <Users color="#D97706" size={18} />
                                    </View>
                                    <Text style={styles.visitorLabel}>Convites Cancelados</Text>
                                    <Text style={styles.visitorValue}>{canceledVisitors.length}</Text>
                                </View>

                                <View style={styles.visitorRow}>
                                    <View style={[styles.visitorIconBox, { backgroundColor: '#FEF3C7' }]}>
                                        <Users color="#D97706" size={18} />
                                    </View>
                                    <Text style={styles.visitorLabel}>Convites Expirados</Text>
                                    <Text style={styles.visitorValue}>{expiredVisitors.length}</Text>
                                </View>

                                <View style={styles.visitorRow}>
                                    <View style={[styles.visitorIconBox, { backgroundColor: '#D1FAE5' }]}>
                                        <Users color="#10B981" size={18} />
                                    </View>
                                    <Text style={styles.visitorLabel}>Visitas Concluídas</Text>
                                    <Text style={styles.visitorValue}>{concludedVisitors.length}</Text>
                                </View>

                                {/* <TouchableOpacity style={styles.visitorButton}>
                                    <Text style={styles.visitorButtonText}>Ver visitantes</Text>
                                </TouchableOpacity> */}
                            </View>

                            {/* Bloco 3: Atividade recente */}
                            <View style={[styles.bottomCard, styles.flexCardLarge]}>
                                <Text style={styles.cardTitle}>Atividade recente</Text>

                                <View style={styles.activityTableHeader}>
                                    <Text style={[styles.actTh, { width: '20%' }]}>Data</Text>
                                    <Text style={[styles.actTh, { width: '30%' }]}>Utilizador</Text>
                                    <Text style={[styles.actTh, { width: '35%' }]}>Ação</Text>
                                    <Text style={[styles.actTh, { width: '15%', textAlign: 'right' }]}>Estado</Text>
                                </View>

                                {RECENT_ACTIVITIES.map((act) => (
                                    <View key={act.id} style={styles.activityTableRow}>
                                        <Text style={[styles.actTd, { width: '20%' }]}>{act.data}</Text>
                                        <Text style={[styles.actTd, { width: '30%', color: '#0F172A', fontWeight: '500' }]}>{act.utilizador}</Text>
                                        <Text style={[styles.actTd, { width: '35%' }]}>{act.acao}</Text>
                                        <View style={[styles.actTd, { width: '15%', alignItems: 'flex-end' }]}>
                                            <View style={styles.checkIconBox}>
                                                <Check color="#10B981" size={14} />
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                <TouchableOpacity style={styles.historyButton}>
                                    <Text style={styles.historyButtonText}>Ver histórico</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                    </ScrollView>
                </View>
            </View>
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

    statsCardsRow: { flexDirection: 'row', gap: 16, marginBottom: 20, flexWrap: 'wrap' },
    statCard: { flex: 1, minWidth: 220, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
    statHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    statIconBox: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: 12, color: '#64748B' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
    statSubValue: { fontSize: 10, color: '#64748B' },
    statFooterText: { fontSize: 11, color: '#64748B', marginBottom: 6 },
    progressBarBackground: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, width: '100%', marginBottom: 4, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    progressPercentage: { fontSize: 10, color: '#64748B', textAlign: 'right' },

    bottomSectionRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
    bottomCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, minWidth: 280, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
    flexCard: { flex: 1, minWidth: 260 },
    flexCardLarge: { flex: 2, minWidth: 300 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },

    chartContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
    donutCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 12, borderColor: '#0284C7', alignItems: 'center', justifyContent: 'center' },
    donutPercentage: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
    donutSubText: { textAlign: 'center', fontSize: 12, color: '#64748B', marginTop: 8 },
    donutCount: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },

    legendContainer: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12, gap: 8 },
    legendItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    legendDot: { width: 8, height: 8, borderRadius: 4 },
    legendText: { fontSize: 12, color: '#64748B', flex: 1, marginLeft: 8 },
    legendValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },

    visitorRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    visitorIconBox: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    visitorLabel: { fontSize: 13, color: '#334155', flex: 1 },
    visitorValue: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
    visitorButton: { backgroundColor: '#0284C7', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 24 },
    visitorButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },

    activityTableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 8, marginBottom: 8 },
    actTh: { fontSize: 11, fontWeight: 'bold', color: '#64748B' },
    activityTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    actTd: { fontSize: 12, color: '#334155' },
    checkIconBox: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
    historyButton: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 16 },
    historyButtonText: { color: '#334155', fontWeight: '600', fontSize: 12 },
});