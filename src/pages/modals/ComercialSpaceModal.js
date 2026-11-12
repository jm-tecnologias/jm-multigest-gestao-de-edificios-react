import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { X, PlusCircle, Check } from 'lucide-react-native';

export default function ComercialSpaceModal({
    visible,
    onClose,
    onSaveSpace,
}) {
    const [floor, setFloor] = useState('');
    const [number, setNumber] = useState('');
    const [type, setType] = useState('Normal'); // 'Normal' ou 'VIP'
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!number.trim()) return;
        try {
            setLoading(true);
            const spaceData = {
                floor: floor.trim() || 'P1',
                number: number.trim(),
                type: type,
                state: 'Livre',
            };
            await onSaveSpace(spaceData);
            setFloor('');
            setNumber('');
            setType('Normal');
            onClose();
        } catch (error) {
            console.error('Erro ao salvar vaga residencial:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTitleRow}>
                            <PlusCircle color="#0284C7" size={20} />
                            <Text style={styles.modalTitle}>Adicionar Nova Vaga Comercial</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#64748B" size={20} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Piso (ex: P1, P2)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="P1"
                            placeholderTextColor="#94A3B8"
                            value={floor}
                            onChangeText={setFloor}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Número da Vaga</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ex: 101"
                            placeholderTextColor="#94A3B8"
                            value={number}
                            onChangeText={setNumber}
                            autoFocus={true}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Tipo de Vaga</Text>
                        <View style={styles.typeSelectorRow}>
                            <TouchableOpacity
                                style={[styles.typeOption, type === 'Normal' && styles.typeOptionActive]}
                                onPress={() => setType('Normal')}
                            >
                                <Text style={[styles.typeOptionText, type === 'Normal' && styles.typeOptionTextActive]}>Normal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.typeOption, type === 'VIP' && styles.typeOptionActive]}
                                onPress={() => setType('VIP')}
                            >
                                <Text style={[styles.typeOptionText, type === 'VIP' && styles.typeOptionTextActive]}>VIP</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleSave} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <>
                                    <Check color="#FFFFFF" size={16} />
                                    <Text style={styles.confirmButtonText}>Guardar Vaga</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, width: '100%', maxWidth: 420, padding: 22, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    closeButton: { padding: 4 },
    inputGroup: { marginBottom: 14 },
    inputLabel: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 },
    textInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, height: 42, fontSize: 13, color: '#0F172A', backgroundColor: '#FFFFFF' },
    typeSelectorRow: { flexDirection: 'row', gap: 10 },
    typeOption: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingVertical: 10, alignItems: 'center', backgroundColor: '#FFFFFF' },
    typeOptionActive: { backgroundColor: '#0284C7', borderColor: '#0284C7' },
    typeOptionText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    typeOptionTextActive: { color: '#FFFFFF' },
    modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 10 },
    cancelButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' },
    cancelButtonText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    confirmButton: { backgroundColor: '#0284C7', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
    confirmButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },
});