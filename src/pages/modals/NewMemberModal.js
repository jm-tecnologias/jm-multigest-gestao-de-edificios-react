// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   useWindowDimensions,
// } from 'react-native';
// import { X, ChevronDown, Check } from 'lucide-react-native';

// const MEMBER_RELATIONSHIP = ["Pai", "Mãe", "Filho(a)", "Esposo(a)", "Cunhado(a)", "Sobrinho(a)", "Avó", "Avô", "Neto(a)"];

// export default function NewMemberModal({ visible, onClose, onSave }) {
//   const { width } = useWindowDimensions();
//   const isMobile = width < 768;
//   const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     id: '',
//     client_id: '',
//     nome: '',
//     apelido: '',
//     num_members: '',
//     description: '',
//     telefone: '',
//     email: '',
//     docId: '',
//     client_relationship: '',
//     observacoes: '',
//   });

//   const handleChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   // Função para selecionar o item e fechar o dropdown
//   const handleSelectType = (type) => {
//     handleChange('client_relationship', type);
//     setIsTypeDropdownOpen(false);
//   };

//   const handleSave = () => {
//     if (onSave) {
//       onSave(formData);
//     }
//     onClose();
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <View style={[styles.modalOverlay, isMobile && styles.modalOverlayMobile]}>
//         <View style={[styles.modalContainer, isMobile && styles.modalContainerMobile]}>
//           {/* Header do Modal */}
//           <View style={styles.modalHeader}>
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.modalTitle}>Novo Membro</Text>
//               <Text style={styles.modalSubtitle}>
//                 Adição e/ou manutenção de membro, e associe-o ao respetivo cliente
//               </Text>
//             </View>
//             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//               <X color="#94A3B8" size={20} />
//             </TouchableOpacity>
//           </View>

//           {/* Form Content */}
//           <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
//             {/* Secção 1: Identificação do membro */}
//             <Text style={styles.sectionTitle}>Identificação do membro</Text>
//             <Text style={styles.sectionSubtitle}>Informação pessoal e contacto</Text>

//             <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
//               {/* Nome */}
//               <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>
//                   Nome <Text style={styles.required}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Carlos"
//                   placeholderTextColor="#94A3B8"
//                   value={formData.nome}
//                   onChangeText={(val) => handleChange('nome', val)}
//                 />
//               </View>

//               {/* Apelido */}
//               <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>
//                   Apelido <Text style={styles.required}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Mula"
//                   placeholderTextColor="#94A3B8"
//                   value={formData.apelido}
//                   onChangeText={(val) => handleChange('apelido', val)}
//                 />
//               </View>
//             </View>

//             <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
//               {/* Telefone */}
//               <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>
//                   Telefone <Text style={styles.required}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Ex.: 84 000 0000"
//                   placeholderTextColor="#94A3B8"
//                   keyboardType="phone-pad"
//                   value={formData.telefone}
//                   onChangeText={(val) => handleChange('telefone', val)}
//                 />
//               </View>

//               {/* E-mail */}
//               <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>E-mail</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="email@exemplo.com"
//                   placeholderTextColor="#94A3B8"
//                   keyboardType="email-address"
//                   value={formData.email}
//                   onChangeText={(val) => handleChange('email', val)}
//                 />
//               </View>
//             </View>

//             <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
//               {/* Doc ID */}
//               <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>
//                   Doc. ID <Text style={styles.required}>*</Text>
//                 </Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Ex.: 110100692835M"
//                   placeholderTextColor="#94A3B8"
//                   value={formData.docId}
//                   onChangeText={(val) => handleChange('docId', val)}
//                 />
//               </View>
//             </View>

//             <View style={styles.divider} />

//             {/* Secção 2: Vínculo e acesso */}
//             <Text style={styles.sectionTitle}>Vínculo e acesso</Text>
//             <Text style={styles.sectionSubtitle}>Relação com o cliente e situação no edifício</Text>

//             <View style={[styles.rowGroup, { zIndex: 9999, position: 'relative' }, isMobile && styles.rowGroupMobile]}>
//               {/* Dropdown de Parentesco */}
//               <View style={[styles.fieldContainer, { zIndex: 9999 }, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>
//                   Tipo <Text style={styles.required}>*</Text>
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.dropdown}
//                   onPress={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
//                 >
//                   <Text style={formData.client_relationship ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
//                     {formData.client_relationship || 'Seleccionar tipo'}
//                   </Text>
//                   <ChevronDown color="#64748B" size={16} />
//                 </TouchableOpacity>

//                 {/* Lista de Opções Flutuante */}
//                 {isTypeDropdownOpen && (
//                   <View style={styles.dropdownListContainer}>
//                     <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
//                       {MEMBER_RELATIONSHIP.map((t) => (
//                         <TouchableOpacity
//                           key={t}
//                           style={[
//                             styles.dropdownOption,
//                             formData.client_relationship === t && styles.dropdownOptionSelected,
//                           ]}
//                           onPress={() => handleSelectType(t)}
//                         >
//                           <Text
//                             style={[
//                               styles.dropdownOptionText,
//                               formData.client_relationship === t && styles.dropdownOptionTextSelected,
//                             ]}
//                           >
//                             {t}
//                           </Text>
//                           {formData.client_relationship === t && <Check color="#0284C7" size={14} />}
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
//                 )}
//               </View>

//               {/* Observações */}
//               <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
//                 <Text style={styles.label}>Observações</Text>
//                 <TextInput
//                   style={[styles.input, styles.textArea]}
//                   placeholder="Notas adicionais sobre o membro..."
//                   placeholderTextColor="#94A3B8"
//                   multiline={true}
//                   numberOfLines={3}
//                   value={formData.observacoes}
//                   onChangeText={(val) => handleChange('observacoes', val)}
//                 />
//               </View>
//             </View>
//           </ScrollView>

//           {/* Footer com Botões */}
//           <View style={[styles.modalFooter, isMobile && styles.modalFooterMobile]}>
//             <Text style={styles.requiredNotice}>Campos obrigatórios *</Text>

//             <View style={[styles.footerButtonsGroup, isMobile && styles.footerButtonsGroupMobile]}>
//               <TouchableOpacity style={[styles.cancelButton, isMobile && styles.fullWidthButton]} onPress={onClose}>
//                 <Text style={styles.cancelButtonText}>Cancelar</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={[styles.saveButton, isMobile && styles.fullWidthButton]} onPress={handleSave}>
//                 <Text style={styles.saveButtonText}>Guardar Membro</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(5, 25, 55, 0.65)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalOverlayMobile: {
//     padding: 10,
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     width: '100%',
//     maxWidth: 720,
//     maxHeight: '90%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   modalContainerMobile: {
//     maxHeight: '95%',
//     borderBottomLeftRadius: 0,
//     borderBottomRightRadius: 0,
//   },
//   modalHeader: {
//     backgroundColor: '#051937',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTextContainer: {
//     flex: 1,
//     paddingRight: 10,
//   },
//   modalTitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   modalSubtitle: {
//     color: '#94A3B8',
//     fontSize: 12,
//     marginTop: 2,
//   },
//   closeButton: {
//     padding: 4,
//   },
//   formBody: {
//     paddingHorizontal: 20,
//     paddingVertical: 18,
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#0F172A',
//   },
//   sectionSubtitle: {
//     fontSize: 12,
//     color: '#64748B',
//     marginBottom: 16,
//   },
//   rowGroup: {
//     flexDirection: 'row',
//     gap: 16,
//     marginBottom: 14,
//     flexWrap: 'wrap',
//   },
//   rowGroupMobile: {
//     flexDirection: 'column',
//     gap: 14,
//   },
//   fieldContainer: {
//     flex: 1,
//     minWidth: 260,
//   },
//   fieldContainerMobile: {
//     width: '100%',
//     minWidth: '100%',
//   },
//   label: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#334155',
//     marginBottom: 6,
//   },
//   required: {
//     color: '#EF4444',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     height: 40,
//     fontSize: 13,
//     color: '#0F172A',
//     backgroundColor: '#FFFFFF',
//   },
//   textArea: {
//     height: 72,
//     textAlignVertical: 'top',
//     paddingVertical: 8,
//   },
//   dropdown: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     height: 40,
//     backgroundColor: '#FFFFFF',
//   },
//   dropdownPlaceholder: {
//     fontSize: 13,
//     color: '#94A3B8',
//   },
//   dropdownSelectedText: {
//     fontSize: 13,
//     color: '#0F172A',
//   },
//   // Estilos essenciais para a lista flutuante do dropdown funcionar perfeitamente
//   dropdownListContainer: {
//     position: 'absolute',
//     top: 66,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     borderRadius: 8,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     zIndex: 99999,
//   },
//   dropdownOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F1F5F9',
//   },
//   dropdownOptionSelected: {
//     backgroundColor: '#F0F9FF',
//   },
//   dropdownOptionText: {
//     fontSize: 13,
//     color: '#334155',
//   },
//   dropdownOptionTextSelected: {
//     color: '#0284C7',
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#E2E8F0',
//     marginVertical: 12,
//   },
//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     borderTopWidth: 1,
//     borderTopColor: '#F1F5F9',
//     backgroundColor: '#F8FAFC',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   modalFooterMobile: {
//     flexDirection: 'column',
//     alignItems: 'stretch',
//   },
//   requiredNotice: {
//     fontSize: 12,
//     color: '#EF4444',
//     fontWeight: '500',
//   },
//   footerButtonsGroup: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   footerButtonsGroupMobile: {
//     flexDirection: 'column',
//     width: '100%',
//     gap: 8,
//   },
//   cancelButton: {
//     backgroundColor: '#1E293B',
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 13,
//   },
//   saveButton: {
//     backgroundColor: '#0284C7',
//     paddingVertical: 10,
//     paddingHorizontal: 22,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: 13,
//   },
//   fullWidthButton: {
//     width: '100%',
//   },
// });

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
} from 'react-native';
import { X, ChevronDown, Check } from 'lucide-react-native';

const MEMBER_RELATIONSHIP = ["Pai", "Mãe", "Filho(a)", "Esposo(a)", "Cunhado(a)", "Sobrinho(a)", "Avó", "Avô", "Neto(a)"];

export default function NewMemberModal({ visible, onClose, onSave, clientContext, memberData }) {

  // console.log('CLIENT CONTEXT: ',clientContext?.members[0]?.apartment_id)

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    client_id: '',
    name: '',
    surname: '',
    phone: '',
    email: '',
    doc_id: '',
    client_relationship: '',
    description: '',
    apartment_id: ''
  });

  // Sempre que a modal abre ou o memberData/clientContext muda, preenche o formulário
  useEffect(() => {
    if (memberData) {
      setFormData({
        id: memberData.id || '',
        client_id: memberData.client_id || clientContext?.id || '',
        name: memberData.name || '',
        surname: memberData.surname || '',
        phone: memberData.phone || '',
        email: memberData.email || '',
        doc_id: memberData.doc_id || '',
        client_relationship: memberData.client_relationship || '',
        description: memberData.description || '',
        apartment_id: clientContext?.members[0]?.apartment_id || ''
      });
    } else {
      setFormData({
        id: '',
        client_id: clientContext?.members?.[0]?.client_id || clientContext?.id || '',
        name: '',
        surname: '',
        phone: '',
        email: '',
        doc_id: '',
        client_relationship: '',
        description: '',
        apartment_id: clientContext?.members[0]?.apartment_id || ''
      });
    }
  }, [memberData, clientContext, visible]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectType = (type) => {
    handleChange('client_relationship', type);
    setIsTypeDropdownOpen(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const isEditing = !!memberData;

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
              <Text style={styles.modalTitle}>{isEditing ? 'Editar Membro' : 'Novo Membro'}</Text>
              <Text style={styles.modalSubtitle}>
                {isEditing ? 'Atualize os dados do membro selecionado' : 'Adicione e associe um novo membro ao cliente'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#94A3B8" size={20} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <ScrollView style={styles.formBody} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Identificação do membro</Text>
            <Text style={styles.sectionSubtitle}>Informação pessoal e contacto</Text>

            <View style={[styles.rowGroup, isMobile && styles.rowGroupMobile]}>
              {/* Nome */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>Nome <Text style={styles.required}>*</Text></Text>
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
                <Text style={styles.label}>Apelido <Text style={styles.required}>*</Text></Text>
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
                <Text style={styles.label}>Telefone <Text style={styles.required}>*</Text></Text>
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
                <Text style={styles.label}>Doc. ID <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex.: 110100692835M"
                  placeholderTextColor="#94A3B8"
                  value={formData.doc_id}
                  onChangeText={(val) => handleChange('doc_id', val)}
                />
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Vínculo e acesso</Text>
            <Text style={styles.sectionSubtitle}>Relação com o cliente e situação no edifício</Text>

            <View style={[styles.rowGroup, { zIndex: 9999, position: 'relative' }, isMobile && styles.rowGroupMobile]}>
              {/* Tipo / Relação */}
              <View style={[styles.fieldContainer, { zIndex: 9999 }, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>Tipo / Relação <Text style={styles.required}>*</Text></Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                >
                  <Text style={formData.client_relationship ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
                    {formData.client_relationship || 'Seleccionar tipo'}
                  </Text>
                  <ChevronDown color="#64748B" size={16} />
                </TouchableOpacity>

                {isTypeDropdownOpen && (
                  <View style={styles.dropdownListContainer}>
                    <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled={true}>
                      {MEMBER_RELATIONSHIP.map((t) => (
                        <TouchableOpacity
                          key={t}
                          style={[
                            styles.dropdownOption,
                            formData.client_relationship === t && styles.dropdownOptionSelected,
                          ]}
                          onPress={() => handleSelectType(t)}
                        >
                          <Text style={[styles.dropdownOptionText, formData.client_relationship === t && styles.dropdownOptionTextSelected]}>
                            {t}
                          </Text>
                          {formData.client_relationship === t && <Check color="#0284C7" size={14} />}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Descrição / Observações */}
              <View style={[styles.fieldContainer, isMobile && styles.fieldContainerMobile]}>
                <Text style={styles.label}>Descrição / Notas</Text>
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
          </ScrollView>

          {/* Footer */}
          <View style={[styles.modalFooter, isMobile && styles.modalFooterMobile]}>
            <Text style={styles.requiredNotice}>Campos obrigatórios *</Text>
            <View style={[styles.footerButtonsGroup, isMobile && styles.footerButtonsGroupMobile]}>
              <TouchableOpacity style={[styles.cancelButton, isMobile && styles.fullWidthButton]} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton, isMobile && styles.fullWidthButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>{isEditing ? 'Atualizar Membro' : 'Guardar Membro'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// (Mantém os teus estilos atuais de modal do NewMemberModal)
const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(5, 25, 55, 0.65)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalOverlayMobile: { padding: 10, justifyContent: 'flex-end' },
  modalContainer: { width: '100%', maxWidth: 720, maxHeight: '90%', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', elevation: 8 },
  modalContainerMobile: { maxHeight: '95%', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  modalHeader: { backgroundColor: '#051937', paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTextContainer: { flex: 1, paddingRight: 10 },
  modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  modalSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  closeButton: { padding: 4 },
  formBody: { paddingHorizontal: 20, paddingVertical: 18 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  rowGroup: { flexDirection: 'row', gap: 16, marginBottom: 14, flexWrap: 'wrap' },
  rowGroupMobile: { flexDirection: 'column', gap: 14 },
  fieldContainer: { flex: 1, minWidth: 260 },
  fieldContainerMobile: { width: '100%', minWidth: '100%' },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 },
  required: { color: '#EF4444' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 40, fontSize: 13, color: '#0F172A', backgroundColor: '#FFFFFF' },
  textArea: { height: 72, textAlignVertical: 'top', paddingVertical: 8 },
  dropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 40, backgroundColor: '#FFFFFF' },
  dropdownPlaceholder: { fontSize: 13, color: '#94A3B8' },
  dropdownSelectedText: { fontSize: 13, color: '#0F172A' },
  dropdownListContainer: { position: 'absolute', top: 66, left: 0, right: 0, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, elevation: 5, zIndex: 99999 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownOptionSelected: { backgroundColor: '#F0F9FF' },
  dropdownOptionText: { fontSize: 13, color: '#334155' },
  dropdownOptionTextSelected: { color: '#0284C7', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#F8FAFC', flexWrap: 'wrap', gap: 10 },
  modalFooterMobile: { flexDirection: 'column', alignItems: 'stretch' },
  requiredNotice: { fontSize: 12, color: '#EF4444', fontWeight: '500' },
  footerButtonsGroup: { flexDirection: 'row', gap: 10 },
  footerButtonsGroupMobile: { flexDirection: 'column', width: '100%', gap: 8 },
  cancelButton: { backgroundColor: '#1E293B', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 6, alignItems: 'center' },
  cancelButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  saveButton: { backgroundColor: '#0284C7', paddingVertical: 10, paddingHorizontal: 22, borderRadius: 6, alignItems: 'center' },
  saveButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  fullWidthButton: { width: '100%' },
});