import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { X, Car, Check } from 'lucide-react-native';

export default function CommercialEntryModal({
    visible,
    onClose,
    availableSpaces = [],
    onConfirmEntry,
}) {
    const [plateNumber, setPlateNumber] = useState('');
    const [selectedSpaceId, setSelectedSpaceId] = useState('');
    const [balance, setBalance] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!plateNumber.trim() || !selectedSpaceId) return;
        try {
            setLoading(true);
            const entryData = {
                plate_number: plateNumber.trim().toUpperCase(),
                commercial_parking_space_id: Number(selectedSpaceId),
                balance: balance ? parseFloat(balance) : 0.00,
            };
            await onConfirmEntry(entryData);
            setPlateNumber('');
            setSelectedSpaceId('');
            setBalance('');
            onClose();
        } catch (error) {
            console.error('Erro ao registar entrada comercial:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Cabeçalho */}
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTitleRow}>
                            <Car color="#0284C7" size={20} />
                            <Text style={styles.modalTitle}>Registar Entrada de Veículo</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#64748B" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Input: Matrícula */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Matrícula do Veículo</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ex: AB-12-34-MC"
                            placeholderTextColor="#94A3B8"
                            value={plateNumber}
                            onChangeText={setPlateNumber}
                            autoCapitalize="characters"
                            autoFocus={true}
                        />
                    </View>

                    {/* Input: ID da Vaga / Seleção */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>ID da Vaga Comercial</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Digite ou selecione o ID da vaga..."
                            placeholderTextColor="#94A3B8"
                            value={selectedSpaceId}
                            onChangeText={setSelectedSpaceId}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Input: Saldo Inicial */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Saldo Inicial (MT)</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="0.00"
                            placeholderTextColor="#94A3B8"
                            value={balance}
                            onChangeText={setBalance}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Botões de Ação */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <>
                                    <Check color="#FFFFFF" size={16} />
                                    <Text style={styles.confirmButtonText}>Registar Entrada</Text>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '100%',
        maxWidth: 420,
        padding: 22,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    closeButton: {
        padding: 4,
    },
    inputGroup: {
        marginBottom: 14,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 42,
        fontSize: 13,
        color: '#0F172A',
        backgroundColor: '#FFFFFF',
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 10,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    cancelButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    confirmButton: {
        backgroundColor: '#0284C7',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    confirmButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});