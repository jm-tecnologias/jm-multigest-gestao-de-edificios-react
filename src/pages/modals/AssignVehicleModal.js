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

export default function AssignVehicleModal({
    visible,
    onClose,
    selectedSpace,
    onConfirmAssignment,
}) {
    const [vehicleId, setVehicleId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!vehicleId.trim()) return;
        try {
            setLoading(true);
            await onConfirmAssignment(selectedSpace.id, vehicleId.trim());
            setVehicleId('');
            onClose();
        } catch (error) {
            console.error('Erro ao associar veículo:', error);
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
                    {/* Cabeçalho do Modal */}
                    <View style={styles.modalHeader}>
                        <View style={styles.headerTitleRow}>
                            <Car color="#0284C7" size={20} />
                            <Text style={styles.modalTitle}>Associar Veículo ao Lugar</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#64748B" size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Informações do Lugar Selecionado */}
                    {selectedSpace && (
                        <View style={styles.spaceInfoBox}>
                            <Text style={styles.spaceInfoText}>
                                Lugar: <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{selectedSpace.number}</Text> (Piso {selectedSpace.floor})
                            </Text>
                            <Text style={styles.spaceInfoText}>
                                Tipo: <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>{selectedSpace.type}</Text>
                            </Text>
                        </View>
                    )}

                    {/* Input para ID ou Matrícula do Veículo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>ID ou Matrícula do Veículo</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Digite o ID ou Matrícula..."
                            placeholderTextColor="#94A3B8"
                            value={vehicleId}
                            onChangeText={setVehicleId}
                            autoFocus={true}
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
                                    <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    spaceInfoBox: {
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 4,
    },
    spaceInfoText: {
        fontSize: 13,
        color: '#475569',
    },
    inputGroup: {
        marginBottom: 20,
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