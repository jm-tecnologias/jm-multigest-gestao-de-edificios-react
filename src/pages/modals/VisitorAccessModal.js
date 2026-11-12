
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { X, User, Phone, FileText, Home, Check } from 'lucide-react-native';

export default function VisitorAccessModal({
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
              <Text style={styles.modalTitle}>Controle de Acesso - Visitante</Text>
              <Text style={styles.modalSubtitle}>Token: {scannedData?.visitor?.token}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Dados do Visitante</Text>
              <View style={[styles.gridContainer, isMobile && styles.gridContainerMobile]}>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><User color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Nome</Text>
                    <Text style={styles.infoValue}>{scannedData?.visitor?.name}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><Phone color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Telefone</Text>
                    <Text style={styles.infoValue}>{scannedData?.visitor?.phone}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><FileText color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Estado</Text>
                    <Text style={styles.infoValue}>{scannedData?.visitor?.status}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Membro Responsável & Apartamento</Text>
              <View style={[styles.gridContainer, isMobile && styles.gridContainerMobile]}>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><User color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Membro Visitado</Text>
                    <Text style={styles.infoValue}>{scannedData?.member?.name} {scannedData?.member?.surname}</Text>
                  </View>
                </View>
                <View style={[styles.infoItem, isMobile && styles.infoItemMobile]}>
                  <View style={styles.iconBox}><Home color="#0284C7" size={16} /></View>
                  <View style={styles.infoTextWrapper}>
                    <Text style={styles.infoLabel}>Apartamento</Text>
                    <Text style={[styles.infoValue, { color: '#0284C7', fontWeight: 'bold' }]}>Apto {scannedData?.apartment?.number}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Notas sobre o Check-in / Check-out</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Insira observações relevantes sobre a visita..."
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