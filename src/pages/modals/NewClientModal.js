

import React, { useState, useEffect, useMemo } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewClientModal({
  visible,
  onClose,
  onSave,
  packageData = [],
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isApartmentDropdownOpen, setIsApartmentDropdownOpen] = useState(false);

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
    price: 0, // <-- Novo campo
  });

  // 1. Filtra apenas categorias ativas
  const activeCategories = useMemo(
    () => (packageData?.categories === undefined ? [] : packageData?.categories).filter((c) => c.is_active !== false),
    [(packageData?.categories === undefined ? [] : packageData?.categories)]
  );

  // 2. Valores únicos da coluna "group" para o 1º dropdown
  const availableGroups = useMemo(() => {
    return [...new Set(activeCategories.map((c) => c.group).filter(Boolean))];
  }, [activeCategories]);

  // 3. Tipos disponíveis em função do "group" selecionado (2º dropdown)
  const availableTypesForGroup = useMemo(() => {
    if (!selectedGroup) return [];
    return activeCategories.filter((c) => c.group === selectedGroup);
  }, [activeCategories, selectedGroup]);

  // 4. Apartamentos disponíveis em função da categoria selecionada (Grupo + Tipo)
  const availableApartmentsForCategory = useMemo(() => {
    if (!selectedCategoryId) return [];
    return  packageData?.apartments.filter((apt) => {
      const sameCategory = Number(apt.category_id) === Number(selectedCategoryId);
      // Mostra apartamentos livres ou o apartamento já associado ao cliente em edição
      const isAvailable =
        apt.occupation_state !== 'Ocupado' ||
        String(apt.id) === String(packageData?.clientData?.apartment_id);
      return sameCategory && isAvailable;
    });
  }, [packageData?.apartments, selectedCategoryId, packageData?.clientData]);

  // Preenche o formulário (Modo Edição ou Criação)
  useEffect(() => {
    if (packageData?.clientData) {
      const currentApartment = packageData?.apartments.find(
        (apt) => String(apt.id) === String(packageData?.clientData.apartment_id)
      );
      const currentCategory = activeCategories.find(
        (cat) => Number(cat.id) === Number(currentApartment?.category_id)
      );

      setSelectedGroup(currentCategory?.group || '');
      setSelectedType(currentCategory?.type || '');
      setSelectedCategoryId(currentCategory?.id || null);

      setFormData({
        id: String(packageData?.clientData.id || ''),
        client_id: String(packageData?.clientData.client_id || ''),
        name: String(packageData?.clientData.name || ''),
        surname: String(packageData?.clientData.surname || ''),
        num_members: String(packageData?.clientData.num_members || ''),
        description: String(packageData?.clientData.description || ''),
        phone: String(packageData?.clientData.phone || ''),
        email: String(packageData?.clientData.email || ''),
        doc_id: String(packageData?.clientData.doc_id || ''),
        occupational_date: String(packageData?.clientData.occupational_date || ''),
        final_date: String(packageData?.clientData.final_date || ''),
        number: String(currentApartment?.number || packageData?.clientData.number || ''),
        client_relationship: String(packageData?.clientData.client_relationship || 'Parent'),
        apartment_id: String(packageData?.clientData.apartment_id || ''),
        price: currentCategory?.price ?? packageData?.clientData.price ?? 0, // <-- Preenche o price
      });
    } 
 
    setIsGroupDropdownOpen(false);
    setIsTypeDropdownOpen(false);
    setIsApartmentDropdownOpen(false);
  }, [packageData?.clientData, visible, packageData?.apartments, activeCategories]);

  // 1º Dropdown: Seleção do Grupo
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedType('');
    setSelectedCategoryId(null);
    setFormData((prev) => ({
      ...prev,
      number: '',
      apartment_id: '',
      price: 0, // <-- Limpa o preço ao trocar de grupo
    }));
    setIsGroupDropdownOpen(false);
  };

  // 2º Dropdown: Seleção do Tipo (guarda o price da category selecionada)
  const handleSelectType = (categoryItem) => {
    setSelectedType(categoryItem.type);
    setSelectedCategoryId(categoryItem.id);

    const matchingApts = packageData?.apartments.filter(
      (apt) =>
        Number(apt.category_id) === Number(categoryItem.id) &&
        apt.occupation_state !== 'Ocupado'
    );

    if (matchingApts.length === 1) {
      setFormData((prev) => ({
        ...prev,
        number: String(matchingApts[0].number),
        apartment_id: String(matchingApts[0].id),
        price: categoryItem.price ?? 0, // <-- Guarda o price da categoria
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        number: '',
        apartment_id: '',
        price: categoryItem.price ?? 0, // <-- Guarda o price da categoria
      }));
    }

    setIsTypeDropdownOpen(false);
  };

  // 3º Dropdown: Seleção do Apartamento (envia o apartment_id exato)
  const handleSelectApartment = (apartment) => {
    setFormData((prev) => ({
      ...prev,
      number: String(apartment.number),
      apartment_id: String(apartment.id),

    }));
    setIsApartmentDropdownOpen(false);
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleSave = () => {
    if (!formData.apartment_id) return;
    if (onSave) {
      onSave({
        ...formData,
        apartment_id: Number(formData.apartment_id),
        price: Number(formData.price || 0),
      });
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
              <Text style={styles.modalTitle}>
                {packageData?.clientData ? 'Editar Cliente' : 'Novo Cliente'}
              </Text>
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
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {/* Secção 1: Identificação e contacto */}
            <Text style={styles.sectionTitle}>Identificação e contacto</Text>
            <Text style={styles.sectionSubtitle}>Dados Principais do cliente</Text>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
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

            {/* Linha 1: Agregado (número) + Grupo */}
            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile, { zIndex: 10002 }]}>
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

              {/* 1º Dropdown: Grupo */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile, { zIndex: 10002 }]}>
                <Text style={styles.label}>
                  Grupo <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    setIsGroupDropdownOpen(!isGroupDropdownOpen);
                    setIsTypeDropdownOpen(false);
                    setIsApartmentDropdownOpen(false);
                  }}
                >
                  <Text style={selectedGroup ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                    {selectedGroup || 'Seleccionar grupo'}
                  </Text>
                  <ChevronDown color="#64748B" size={16} />
                </TouchableOpacity>

                {isGroupDropdownOpen && (
                  <View style={styles.dropdownListContainer}>
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
                      {availableGroups.map((group) => (
                        <TouchableOpacity
                          key={group}
                          style={[
                            styles.dropdownOption,
                            selectedGroup === group && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => handleSelectGroup(group)}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              selectedGroup === group && styles.dropdownOptionTextSelected,
                            ]}
                          >
                            {group}
                          </Text>
                          {selectedGroup === group && <Check color="#0284C7" size={14} />}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Linha 2: Tipo + Apartamento lado a lado */}
            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile, { zIndex: 9500 }]}>
              {/* 2º Dropdown: Tipo (Dependente do Grupo) */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile, { zIndex: 9502 }]}>
                <Text style={styles.label}>
                  Tipo <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.dropdown, !selectedGroup && styles.dropdownDisabled]}
                  disabled={!selectedGroup}
                  onPress={() => {
                    setIsTypeDropdownOpen(!isTypeDropdownOpen);
                    setIsGroupDropdownOpen(false);
                    setIsApartmentDropdownOpen(false);
                  }}
                >
                  <Text style={selectedType ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                    {selectedType || (selectedGroup ? 'Seleccionar tipo' : 'Escolha o grupo primeiro')}
                  </Text>
                  <ChevronDown color="#64748B" size={16} />
                </TouchableOpacity>

                {isTypeDropdownOpen && (
                  <View style={styles.dropdownListContainer}>
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
                      {availableTypesForGroup.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={[
                            styles.dropdownOption,
                            selectedType === cat.type && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => handleSelectType(cat)}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              selectedType === cat.type && styles.dropdownOptionTextSelected,
                            ]}
                          >
                            {cat.type}
                          </Text>
                          {selectedType === cat.type && <Check color="#0284C7" size={14} />}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* 3º Dropdown: Apartamento (Dependente da Categoria escolhida) */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile, { zIndex: 9501 }]}>
                <Text style={styles.label}>
                  Apartamento <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[styles.dropdown, !selectedCategoryId && styles.dropdownDisabled]}
                  disabled={!selectedCategoryId}
                  onPress={() => {
                    setIsApartmentDropdownOpen(!isApartmentDropdownOpen);
                    setIsGroupDropdownOpen(false);
                    setIsTypeDropdownOpen(false);
                  }}
                >
                  <Text
                    style={formData.apartment_id ? styles.dropdownSelectedText : styles.dropdownPlaceholder}
                    numberOfLines={1}
                  >
                    {formData.apartment_id
                      ? `Apto ${formData.number} (ID: ${formData.apartment_id})`
                      : selectedCategoryId
                        ? availableApartmentsForCategory.length > 0
                          ? 'Seleccionar apartamento'
                          : 'Sem apartamentos disponíveis'
                        : 'Escolha o grupo e o tipo primeiro'}
                  </Text>
                  <ChevronDown color="#64748B" size={16} />
                </TouchableOpacity>

                {isApartmentDropdownOpen && (
                  <View style={styles.dropdownListContainer}>
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
                      {availableApartmentsForCategory.map((apt) => (
                        <TouchableOpacity
                          key={apt.id}
                          style={[
                            styles.dropdownOption,
                            String(formData.apartment_id) === String(apt.id) && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => handleSelectApartment(apt)}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              String(formData.apartment_id) === String(apt.id) && styles.dropdownOptionTextSelected,
                            ]}
                          >
                            Apto {apt.number} — Andar {apt.floor}
                          </Text>
                          {String(formData.apartment_id) === String(apt.id) && (
                            <Check color="#0284C7" size={14} />
                          )}
                        </TouchableOpacity>
                      ))}
                      {availableApartmentsForCategory.length === 0 && (
                        <View style={styles.dropdownOption}>
                          <Text style={styles.dropdownPlaceholder}>
                            Nenhum apartamento livre encontrado
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Datas de Entrada e Saída */}
            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>
                  Data de Entrada <Text style={styles.required}>*</Text>
                </Text>

                {Platform.OS === 'web' ? (
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
            <Text style={styles.requiredNotice}>Campos obrigatórios (*)</Text>

            <View style={[styles.footerButtonsGroup, isMobile && styles.footerButtonsGroupMobile]}>
              <TouchableOpacity
                style={[styles.cancelButton, isMobile && styles.fullWidthButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isMobile && styles.fullWidthButton,
                  !formData.apartment_id && { opacity: 0.5 },
                ]}
                disabled={!formData.apartment_id}
                onPress={handleSave}
              >
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
    position: 'relative',
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
  dropdownDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  dropdownPlaceholder: {
    fontSize: 13,
    color: '#94A3B8',
    flex: 1,
    paddingRight: 6,
  },
  dropdownSelectedText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
    paddingRight: 6,
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