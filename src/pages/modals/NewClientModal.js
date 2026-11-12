
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { X, Calendar, ChevronDown, Check } from 'lucide-react-native';
// 1. Importa o componente do DateTimePicker
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewClientModal({ visible, onClose, onSave, clientData, apartmentData = [] }) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Estados para controlar a visibilidade dos datepickers no mobile
  const [showOccupationalPicker, setShowOccupationalPicker] = useState(false);
  const [showFinalPicker, setShowFinalPicker] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    client_id: '',
    name: '',
    surname: '',
    num_members: '',
    description: '',
    phone: '',
    email: '',
    doc_id: '',
    occupational_date: '',
    final_date: '',
    number: '',
    client_relationship: 'Parent',
    apartment_id: '',
  });

  useEffect(() => {
    if (clientData) {
      setFormData({
        id: String(clientData.id || ''),
        client_id: String(clientData.client_id || ''),
        name: String(clientData.name || ''),
        surname: String(clientData.surname || ''),
        num_members: String(clientData.num_members || ''),
        description: String(clientData.description || ''),
        phone: String(clientData.phone || ''),
        email: String(clientData.email || ''),
        doc_id: String(clientData.doc_id || ''),
        occupational_date: String(clientData.occupational_date || ''),
        final_date: String(clientData.final_date || ''),
        number: String(clientData.number || ''),
        client_relationship: String(clientData.client_relationship || 'Parent'),
        apartment_id: String(clientData.apartment_id || ''),
      });
    } else {
      setFormData({
        id: '',
        client_id: '',
        name: '',
        surname: '',
        num_members: '',
        description: '',
        phone: '',
        email: '',
        doc_id: '',
        occupational_date: '',
        final_date: '',
        number: '',
        client_relationship: 'Parent',
        apartment_id: ''
      });
    }
  }, [clientData, visible]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Função auxiliar para formatar a data selecionada no Datepicker para 'AAAA-MM-DD'
  const formatDateToString = (date) => {
    if (!date) return '';
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSelectApartment = (apartment) => {
    setFormData((prev) => ({
      ...prev,
      number: apartment.number,
      apartment_id: String(apartment.id)
    }));
    setIsTypeDropdownOpen(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

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
              <Text style={styles.modalTitle}>Novo Cliente</Text>
              <Text style={styles.modalSubtitle}>
                Registe o responsável principal e associe-o a um apartamento
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView
            style={styles.formBody}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
          >
            {/* Secção 1: Identificação e contacto */}
            <Text style={styles.sectionTitle}>Identificação e contacto</Text>
            <Text style={styles.sectionSubtitle}>Dados Principais do cliente</Text>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
              {/* Nome */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Nome <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Carlos"
                  placeholderTextColor="#94A3B8"
                  value={formData.name}
                  onChangeText={(val) => handleChange('name', val)}
                />
              </View>

              {/* Apelido */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Apelido <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mula"
                  placeholderTextColor="#94A3B8"
                  value={formData.surname}
                  onChangeText={(val) => handleChange('surname', val)}
                />
              </View>
            </View>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
              {/* Telefone */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Telefone <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 84 000 0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(val) => handleChange('phone', val)}
                />
              </View>

              {/* E-mail */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="email@exemplo.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(val) => handleChange('email', val)}
                />
              </View>
            </View>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
              {/* Doc ID */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Doc. ID <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 110100692835M"
                  placeholderTextColor="#94A3B8"
                  value={formData.doc_id}
                  onChangeText={(val) => handleChange('doc_id', val)}
                />
              </View>

              {/* Observações Identificação */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Notas adicionais sobre o membro..."
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                  numberOfLines={3}
                  value={formData.description}
                  onChangeText={(val) => handleChange('description', val)}
                />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Secção 2: Associação ao edifício */}
            <Text style={styles.sectionTitle}>Associação ao edifício</Text>
            <Text style={styles.sectionSubtitle}>Apartamento e situação actual do cliente</Text>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile, { zIndex: 9999 }]}>
              {/* Dropdown Apartamento */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile, { zIndex: 9999, position: 'relative' }]}>
                <Text style={styles.label}>
                  Apartamento <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <Text style={formData.number ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                    {formData.number || 'Seleccione o apartamento'}
                  </Text>
                  <ChevronDown color="#64748B" size5={16} />
                </TouchableOpacity>

                {/* Lista de Opções do Dropdown */}
                {isTypeDropdownOpen && (
                  <View style={styles.dropdownListContainer}>
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
                      {apartmentData.map((t) => (
                        <TouchableOpacity
                          key={t.id}
                          style={[
                            styles.dropdownOption,
                            formData.apartment_id === String(t.id) && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => handleSelectApartment(t)}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              formData.apartment_id === String(t.id) && styles.dropdownOptionTextSelected,
                            ]}
                          >
                            {t.number}
                          </Text>
                          {formData.apartment_id === String(t.id) && <Check color="#0284C7" size={14} />}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Agregado (número) */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Agregado (número) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 3"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={formData.num_members}
                  onChangeText={(val) => handleChange('num_members', val)}
                />
              </View>
            </View>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
              {/* Data de Entrada com Datepicker Nativo */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Data de Entrada <Text style={styles.required}>*</Text>
                </Text>
                
                {Platform.OS === 'web' ? (
                  // Na Web usa input type="date" nativo do browser
                  <View style={styles.dateInputContainer}>
                    <TextInput
                    placeholder="AAAA-MM-DD"
                      style={styles.dateInput}
                      value={formData.occupational_date}
                      onChangeText={(val) => handleChange('occupational_date', val)}
                      type="date"
                    />
                    <View style={styles.calendarButton}>
                      <Calendar color="#64748B" size={16} />
                    </View>
                  </View>
                ) : (
                  // No Mobile (iOS/Android) abre o DateTimePicker ao clicar
                  <>
                    <TouchableOpacity 
                      style={styles.dateInputContainer} 
                      onPress={() => setShowOccupationalPicker(true)}
                    >
                      <Text style={[styles.dateInput, { paddingVertical: 10 }]}>
                        {formData.occupational_date || 'AAAA-MM-DD'}
                      </Text>
                      <View style={styles.calendarButton}>
                        <Calendar color="#64748B" size={16} />
                      </View>
                    </TouchableOpacity>

                    {showOccupationalPicker && (
                      <DateTimePicker
                        value={formData.occupational_date ? new Date(formData.occupational_date) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowOccupationalPicker(false);
                          if (selectedDate) {
                            handleChange('occupational_date', formatDateToString(selectedDate));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>

              {/* Data de Saída com Datepicker Nativo */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>Data de Saída</Text>

                {Platform.OS === 'web' ? (
                  <View style={styles.dateInputContainer}>
                    <TextInput
                    
                    placeholder="AAAA-MM-DD"
                      style={styles.dateInput}
                      value={formData.final_date}
                      onChangeText={(val) => handleChange('final_date', val)}
                      type="date"
                    />
                    <View style={styles.calendarButton}>
                      <Calendar color="#64748B" size={16} />
                    </View>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.dateInputContainer} 
                      onPress={() => setShowFinalPicker(true)}
                    >
                      <Text style={[styles.dateInput, { paddingVertical: 10 }]}>
                        {formData.final_date || 'AAAA-MM-DD'}
                      </Text>
                      <View style={styles.calendarButton}>
                        <Calendar color="#64748B" size={16} />
                      </View>
                    </TouchableOpacity>

                    {showFinalPicker && (
                      <DateTimePicker
                        value={formData.final_date ? new Date(formData.final_date) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowFinalPicker(false);
                          if (selectedDate) {
                            handleChange('final_date', formatDateToString(selectedDate));
                          }
                        }}
                      />
                    )}
                  </>
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer com Botões */}
          <View style={[styles.modalFooter, isMobile && styles.modalFooterMobile]}>
            <Text style={styles.requiredNotice}>Campos obrigatórios *</Text>

            <View style={[styles.footerButtonsGroup, isMobile && styles.footerButtonsGroupMobile]}>
              <TouchableOpacity style={[styles.cancelButton, isMobile && styles.fullWidthButton]} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.saveButton, isMobile && styles.fullWidthButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
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
    maxWidth: 720,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  rowGroupMobile: {
    flexDirection: 'column',
    gap: 14,
  },
  fieldContainer: {
    flex: 1,
    minWidth: 260,
  },
  fieldContainerMobile: {
    width: '100%',
    minWidth: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#FFFFFF',
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
  },
  dropdownSelectedText: {
    fontSize: 13,
    color: '#0F172A',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 999,
    zIndex: 99999,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F0F9FF',
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#334155',
  },
  dropdownOptionTextSelected: {
    color: '#0284C7',
    fontWeight: 'bold',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    height: 40,
    overflow: 'hidden',
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
  },
  calendarButton: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalFooterMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  requiredNotice: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  footerButtonsGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButtonsGroupMobile: {
    flexDirection: 'column',
    width: '100%',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  fullWidthButton: {
    width: '100%',
  },
});