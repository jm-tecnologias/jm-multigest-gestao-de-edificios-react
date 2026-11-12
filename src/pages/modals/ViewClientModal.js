import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { X, User, Phone, Mail, FileText, Home, Users, Calendar, Eye, Pencil, Plus } from 'lucide-react-native';

export default function ViewClientModal({ visible, onClose, clientData, onOpenNewMember, onOpenEditMember }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (!clientData) return null;

  // Lista de membros formatada com o esquema do JSON informado
  const membersList = clientData.members || [
    {
      id: 1,
      doc_id: '...',
      name: '...',
      surname: '...',
      phone: '...',
      email: '...',
      client_relationship: '...',
      description: '...)',
      status: false,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
        <View style={[styles.modalContainer, isMobile && styles.modalContainerMobile]}>
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.modalTitle}>Detalhes do Cliente</Text>
              <Text style={styles.modalSubtitle}>
                ID: {clientData.members[0].client_id} - {clientData.members[0].name} {clientData.members[0].surname}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            {/* Bloco 1: Informações Gerais do Cliente */}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Dados do Cliente</Text>

              <View style={[styles.gridContainer, isMobile && styles.gridContainerMobile]}>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}>
                    <User color="#0284C7" size={16} />
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Nome Completo</Text>
                    <Text style={styles.infoValue}>{clientData.members[0].name} {clientData.members[0].surname}</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}>
                    <Phone color="#0284C7" size={16} />
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Telefone</Text>
                    <Text style={styles.infoValue}>{clientData.members[0].phone || '84 000 0000'}</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}>
                    <Mail color="#0284C7" size={16} />
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>E-mail</Text>
                    <Text style={styles.infoValue}>{clientData.members[0].email || 'cliente@exemplo.com'}</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}>
                    <FileText color="#0284C7" size={16} />
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Doc. ID / BI</Text>
                    <Text style={styles.infoValue}>{clientData.members[0].docId || '110100692835M'}</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}>
                    <Calendar color="#0284C7" size={16} />
                  </View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Estado Atual</Text>
                    <View style={styles.statusBadge}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: clientData.members[0].status ? 'rgb(80, 255, 0)' : 'rgb(255, 80, 0)' },
                        ]}
                      />
                      <Text style={styles.statusText}>{clientData.status ? 'Ativo' : 'Inativo'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Bloco 2: Lista de Membros Relacionados */}
            <View style={styles.membersCard}>
              <View style={[styles.membersHeader, isMobile && styles.membersHeaderMobile]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Users color="#0F172A" size={18} />
                  <Text style={styles.sectionTitle}>Membros Associados</Text>
                </View>

                <View style={[styles.headerRightActions, isMobile && styles.headerRightActionsMobile]}>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{membersList.length} membros</Text>
                  </View>
                  {/* Botão de Adicionar Membro associado a este cliente */}
                  <TouchableOpacity
                    style={styles.addMemberButton}
                    onPress={() => onOpenNewMember && onOpenNewMember(clientData)}
                  >
                    <Plus color="#FFFFFF" size={14} />
                    <Text style={styles.addMemberButtonText}>Novo Membro</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Tabela ocupando 100% da largura sem restrições fixas */}
              <View style={styles.tableContainer}>
                {/* Header Tabela */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, isMobile ? styles.colNomeMobile : styles.colNome]}>Nome</Text>

                  {!isMobile && <Text style={[styles.th, styles.colRelacao]}>Relação</Text>}
                  {!isMobile && <Text style={[styles.th, styles.colContacto]}>Contacto / Doc</Text>}
                  {!isMobile && <Text style={[styles.th, styles.colDescricao]}>Descrição</Text>}

                  <Text style={[styles.th, isMobile ? styles.colEstadoMobile : styles.colEstado]}>Estado</Text>
                  <Text style={[styles.th, isMobile ? styles.colAcoesMobile : styles.colAcoes, { textAlign: 'right' }]}>Ações</Text>
                </View>

                {/* Linhas da Tabela com Mapeamento dos Campos JSON */}
                {membersList.map((membro) => (
                  <View key={membro.id} style={styles.tableRow}>
                    <View style={isMobile ? styles.colNomeMobile : styles.colNome}>
                      <Text style={[styles.td, { fontWeight: '600', color: '#0F172A' }]} numberOfLines={1}>
                        {membro.name} {membro.surname}
                      </Text>
                    </View>

                    {!isMobile && <Text style={[styles.td, styles.colRelacao]} numberOfLines={1}>{membro.client_relationship}</Text>}

                    {!isMobile && (
                      <View style={styles.colContacto}>
                        <Text style={styles.td} numberOfLines={1}>{membro.phone}</Text>
                        <Text style={[styles.subTd, { color: '#64748B' }]} numberOfLines={1}>{membro.doc_id}</Text>
                      </View>
                    )}

                    {!isMobile && (
                      <Text style={[styles.td, styles.colDescricao, { color: '#64748B' }]} numberOfLines={2}>
                        {membro.description}
                      </Text>
                    )}

                    <View style={[styles.td, isMobile ? styles.colEstadoMobile : styles.colEstado, styles.statusContainerRow]}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: membro.status ? 'rgb(80, 255, 0)' : 'rgb(255, 80, 0)' },
                        ]}
                      />
                      <Text style={styles.statusText}>{membro.status ? 'Ativo' : 'Inativo'}</Text>
                    </View>

                    <View style={[styles.td, isMobile ? styles.colAcoesMobile : styles.colAcoes, { flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }]}>
                      {/* <TouchableOpacity style={styles.actionBtn}>
                        <Eye color="#3B82F6" size={16} />
                      </TouchableOpacity> */}
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                          if (onOpenEditMember) onOpenEditMember(membro, clientData);
                        }}
                      >
                        <Pencil color="#3B82F6" size={16} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer com Botão Fechar */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 25, 55, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayMobile: {
    padding: 10,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 820,
    maxHeight: '90%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContainerMobile: {
    maxHeight: '95%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  modalHeader: {
    backgroundColor: '#051937',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  formBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 14,
  },
  gridContainerMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  infoItem: {
    width: '30%',
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoItemMobile: {
    width: '100%',
    minWidth: '100%',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  membersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  membersHeaderMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRightActionsMobile: {
    width: '100%',
    justifyContent: 'space-between',
  },
  countBadge: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  countBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  addMemberButton: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  addMemberButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  tableContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: '100%', // Força ocupar 100% do bloco pai
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    width: '100%',
  },
  th: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    width: '100%',
  },
  td: {
    fontSize: 12,
    color: '#334155',
  },
  subTd: {
    fontSize: 11,
  },

  /* Larguras para Desktop (somam 100%) */
  colNome: { width: '22%' },
  colRelacao: { width: '18%' },
  colContacto: { width: '18%' },
  colDescricao: { width: '24%' },
  colEstado: { width: '10%' },
  colAcoes: { width: '8%' },

  /* Larguras para Mobile (somam 100% preenchendo toda a largura) */
  colNomeMobile: { width: '50%' },
  colEstadoMobile: { width: '30%' },
  colAcoesMobile: { width: '20%' },

  statusContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    padding: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  closeModalButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});