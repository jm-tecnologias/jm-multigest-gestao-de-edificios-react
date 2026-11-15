
import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { X, ChevronDown, Check, Tag } from 'lucide-react-native';

export default function NewApartmentModal({
  visible,
  onClose,
  onSave,
  apartmentData,
  categories = [], // Lista de categorias vinda da API (ou prop)
}) {
  const [formData, setFormData] = useState({
    floor: '',
    number: '',
    category_id: null,
    description: '',
  });

  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Filtra apenas categorias activas
  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active !== false),
    [categories]
  );

  // 1. Valores únicos da coluna "group" para o 1º dropdown
  const availableGroups = useMemo(() => {
    return [...new Set(activeCategories.map((c) => c.group).filter(Boolean))];
  }, [activeCategories]);

  // 2. Categorias filtradas em função do "group" selecionado para o 2º dropdown
  const availableTypesForGroup = useMemo(() => {
    if (!selectedGroup) return [];
    return activeCategories.filter((c) => c.group === selectedGroup);
  }, [activeCategories, selectedGroup]);

  // 3. Categoria exata selecionada (contém o id e o price)
  const selectedCategoryObj = useMemo(() => {
    if (!selectedGroup || !selectedType) return null;
    return (
      activeCategories.find(
        (c) => c.group === selectedGroup && c.type === selectedType
      ) || null
    );
  }, [activeCategories, selectedGroup, selectedType]);

  // Preenche o formulário ao abrir (Modo Edição ou Criação)
  useEffect(() => {
    if (apartmentData) {
      const existingCategory = activeCategories.find(
        (c) => c.id === apartmentData.category_id
      );

      setSelectedGroup(existingCategory?.group || '');
      setSelectedType(existingCategory?.type || '');
      setFormData({
        floor: String(apartmentData.floor || ''),
        number: String(apartmentData.number || ''),
        category_id: apartmentData.category_id || null,
        description: apartmentData.description || '',
      });
    } else {
      setSelectedGroup('');
      setSelectedType('');
      setFormData({
        floor: '',
        number: '',
        category_id: null,
        description: '',
      });
    }
    setIsGroupDropdownOpen(false);
    setIsTypeDropdownOpen(false);
  }, [apartmentData, visible, activeCategories]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Seleção do 1º Dropdown (Group)
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setSelectedType(''); // Limpa o tipo ao trocar de grupo
    handleChange('category_id', null);
    setIsGroupDropdownOpen(false);
  };

  // Seleção do 2º Dropdown (Type dependente do Group)
  const handleSelectType = (categoryItem) => {
    setSelectedType(categoryItem.type);
    handleChange('category_id', categoryItem.id);
    setIsTypeDropdownOpen(false);
  };

  const handleSave = () => {
    if (!formData.floor.trim() || !formData.number.trim() || !formData.category_id) {
      return;
    }

    if (onSave) {
      onSave({
        floor: formData.floor.trim(),
        number: formData.number.trim(),
        category_id: formData.category_id,
        description: formData.description.trim(),
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {apartmentData ? 'Editar Apartamento' : 'Novo Apartamento'}
              </Text>
              <Text style={styles.modalSubtitle}>
                Registo e/ou manutenção de unidade no edifício
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
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {/* Secção 1: Identificação */}
            <Text style={styles.sectionTitle}>Dados do apartamento</Text>
            <Text style={styles.sectionSubtitle}>Identificação e classificação da unidade</Text>

            <View style={styles.rowGroup}>
              {/* Andar/Bloco */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Andar/Bloco <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 3"
                  placeholderTextColor="#94A3B8"
                  value={formData.floor}
                  onChangeText={(val) => handleChange('floor', val)}
                />
              </View>

              {/* Número */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>
                  Número <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 3B"
                  placeholderTextColor="#94A3B8"
                  value={formData.number}
                  onChangeText={(val) => handleChange('number', val)}
                />
              </View>
            </View>

            {/* Linha com os 2 Dropdowns Dependentes (Group -> Type) */}
            <View style={[styles.rowGroup, { zIndex: 9999 }]}>
              {/* 1º Dropdown: Grupo */}
              <View style={[styles.fieldContainer, { zIndex: 10000 }]}>
                <Text style={styles.label}>
                  Grupo <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => {
                    setIsGroupDropdownOpen(!isGroupDropdownOpen);
                    setIsTypeDropdownOpen(false);
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

              {/* 2º Dropdown: Tipo (Dependente do Grupo) */}
              <View style={[styles.fieldContainer, { zIndex: 9999 }]}>
                <Text style={styles.label}>
                  Tipo <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.dropdown,
                    !selectedGroup && styles.dropdownDisabled,
                  ]}
                  disabled={!selectedGroup}
                  onPress={() => {
                    setIsTypeDropdownOpen(!isTypeDropdownOpen);
                    setIsGroupDropdownOpen(false);
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
            </View>

            {/* Tag <Text> para apresentar o Preço da Categoria selecionada */}
            <View style={styles.priceBox}>
              <View style={styles.priceLabelRow}>
                <Tag color="#0284C7" size={16} />
                <Text style={styles.priceLabel}>Preço da Categoria:</Text>
              </View>
              <Text style={styles.priceValue}>
                {selectedCategoryObj
                  ? `${Number(selectedCategoryObj.price).toLocaleString('pt-MZ', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} MT`
                  : '---'}
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Secção 2: Descrição */}
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.sectionSubtitle}>Informação complementar sobre a unidade</Text>

            <View style={styles.rowGroup}>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Descrição do apartamento</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Características, observações ou informação adicional..."
                  placeholderTextColor="#94A3B8"
                  multiline={true}
                  numberOfLines={4}
                  value={formData.description}
                  onChangeText={(val) => handleChange('description', val)}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer com Botões */}
          <View style={styles.modalFooter}>
            <Text style={styles.requiredNotice}>Campos obrigatórios (*)</Text>

            <View style={styles.footerButtonsGroup}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!formData.floor || !formData.number || !formData.category_id) && { opacity: 0.5 },
                ]}
                disabled={!formData.floor || !formData.number || !formData.category_id}
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
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 550,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  formBody: {
    padding: 20,
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
    gap: 12,
    marginBottom: 16,
  },
  fieldContainer: {
    flex: 1,
    position: 'relative',
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
  },
  dropdownSelectedText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
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
    elevation: 10,
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
  priceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0369A1',
  },
  priceValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  requiredNotice: {
    fontSize: 12,
    color: '#64748B',
  },
  footerButtonsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#0284C7',
  },
  saveButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});