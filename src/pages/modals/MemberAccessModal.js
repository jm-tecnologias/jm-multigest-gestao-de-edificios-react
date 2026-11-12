import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  useWindowDimensions,
} from 'react-native';
import { X, User, Phone, Mail, FileText, Home, Calendar, Check, Camera } from 'lucide-react-native';

export default function MemberAccessModal({
  visible,
  onClose,
  scannedData,
  actionNotes,
  setActionNotes,
  onConfirmAction,
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (!scannedData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
        <View style={[styles.modalContainer, isMobile && styles.modalContainerMobile]}>
          <View style={styles.modalHeader}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.modalTitle}>Controle de Acesso - Membro</Text>
              <Text style={styles.modalSubtitle}>Token: {scannedData?.member?.token}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            
            {/* Secção de Visualização da Imagem do Membro */}
            <View style={[styles.imageViewerSection, isMobile && styles.imageViewerSectionMobile]}>
              <View style={styles.avatarContainer}>
                {scannedData?.member?.profile_pic_url ? (
                  <Image source={{ uri: scannedData?.member?.profile_pic_url }} style={styles.memberImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Camera color="#64748B" size={28} />
                    <Text style={styles.avatarPlaceholderText}>Sem Foto</Text>
                  </View>
                )}
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.avatarName}>{scannedData?.member?.name} {scannedData?.member?.surname}</Text>
                <Text style={styles.avatarSub}>Apto {scannedData?.apartment?.number} • {scannedData?.member?.client_relationship}</Text>
                <View style={styles.statusPill}>
                  <View style={styles.statusDotActive} />
                  <Text style={styles.statusPillText}>Membro Ativo</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Dados Pessoais & Contactos</Text>
              <View style={[styles.gridContainer, isMobile && styles.gridContainerMobile]}>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><Phone color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Telefone</Text>
                    <Text style={styles.infoValue}>{scannedData?.member?.phone}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><Mail color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>E-mail</Text>
                    <Text style={styles.infoValue}>{scannedData?.member?.email}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><FileText color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Doc. ID</Text>
                    <Text style={styles.infoValue}>{scannedData?.member?.doc_id}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><Home color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Apartamento</Text>
                    <Text style={[styles.infoValue, { color: '#0284C7', fontWeight: 'bold' }]}>Apto {scannedData?.apartment?.number}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><Calendar color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Relação</Text>
                    <Text style={styles.infoValue}>{scannedData?.member?.client_relationship}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Caixa de Texto para Notas do Processo */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Notas sobre o Check-in / Check-out</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Insira notas de ocorrência ou observações..."
                placeholderTextColor="#94A3B8"
                multiline={true}
                numberOfLines={3}
                value={actionNotes}
                onChangeText={setActionNotes}
              />
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, isMobile && styles.modalFooterMobile]}>
            <TouchableOpacity style={[styles.actionBtnModal, isMobile && styles.fullWidthButton, { backgroundColor: '#DC2626' }]} onPress={() => onConfirmAction('Rejeição')}>
              <X color="#FFFFFF" size={16} />
              <Text style={styles.actionBtnTextModal}>Rejeitar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtnModal, isMobile && styles.fullWidthButton, { backgroundColor: '#D97706' }]} onPress={() => onConfirmAction('Check-out')}>
              <Check color="#FFFFFF" size={16} />
              <Text style={styles.actionBtnTextModal}>Check-out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtnModal, isMobile && styles.fullWidthButton, { backgroundColor: '#059669' }]} onPress={() => onConfirmAction('Check-in')}>
              <Check color="#FFFFFF" size={16} />
              <Text style={styles.actionBtnTextModal}>Check-in</Text>
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
    padding: 20 
  },
  modalOverlayMobile: {
    padding: 10,
    justifyContent: 'flex-end',
  },
  modalContainer: { 
    width: '100%', 
    maxWidth: 750, 
    maxHeight: '90%', 
    backgroundColor: '#F8FAFC', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 8 
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
    alignItems: 'center' 
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  modalTitle: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  modalSubtitle: { 
    color: '#94A3B8', 
    fontSize: 12, 
    marginTop: 2 
  },
  closeButton: { 
    padding: 4 
  },
  formBody: { 
    paddingHorizontal: 20, 
    paddingVertical: 18 
  },
  
  imageViewerSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 10, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    gap: 16 
  },
  imageViewerSectionMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  avatarContainer: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    overflow: 'hidden', 
    backgroundColor: '#F1F5F9', 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  memberImage: { 
    width: '100%', 
    height: '100%' 
  },
  avatarPlaceholder: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarPlaceholderText: { 
    fontSize: 10, 
    color: '#64748B', 
    marginTop: 2 
  },
  avatarInfo: { 
    flex: 1,
  },
  avatarName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0F172A' 
  },
  avatarSub: { 
    fontSize: 13, 
    color: '#64748B', 
    marginTop: 2 
  },
  statusPill: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    marginTop: 6 
  },
  statusDotActive: { 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#10B981' 
  },
  statusPillText: { 
    fontSize: 12, 
    color: '#059669', 
    fontWeight: '600' 
  },

  infoCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 10, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#E2E8F0' 
  },
  sectionTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#0F172A', 
    marginBottom: 14 
  },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 16 
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
    gap: 10 
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
    justifyContent: 'center' 
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: { 
    fontSize: 11, 
    color: '#64748B' 
  },
  infoValue: { 
    fontSize: 13, 
    color: '#0F172A', 
    fontWeight: '500' 
  },
  fieldContainer: { 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    marginBottom: 10 
  },
  label: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#334155', 
    marginBottom: 6 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    fontSize: 13, 
    color: '#0F172A', 
    backgroundColor: '#FFFFFF' 
  },
  textArea: { 
    height: 80, 
    textAlignVertical: 'top', 
    paddingVertical: 8 
  },
  modalFooter: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 14, 
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0', 
    backgroundColor: '#FFFFFF' 
  },
  modalFooterMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 8,
  },
  actionBtnModal: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    gap: 6 
  },
  actionBtnTextModal: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 13 
  },
  fullWidthButton: {
    width: '100%',
  },
});