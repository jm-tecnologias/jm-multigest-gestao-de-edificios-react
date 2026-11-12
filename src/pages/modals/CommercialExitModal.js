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
import { X, LogOut, Check, AlertCircle } from 'lucide-react-native';

export default function CommercialExitModal({
    visible,
    onClose,
    onConfirmExit,
}) {
    const [plateNumber, setPlateNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [parkingDetails, setParkingDetails] = useState(null);

    // Simulação de busca de dados do veículo ao digitar a matrícula
    const handleSearchPlate = (text) => {
        const upperText = text.toUpperCase();
        setPlateNumber(upperText);
        
        // Simulação de dados encontrados (numa aplicação real, farias uma chamada à API ou filtrarias o state)
        if (upperText.length >= 4) {
            setParkingDetails({
                plate_number: upperText,
                space_number: '101',
                time_in: '09:30',
                hours_parked: 3.5,
                balance: 15.50,
                amount_to_pay: 35.00
            });
        } else {
            setParkingDetails(null);
        }
    };

    const handleConfirm = async () => {
        if (!plateNumber.trim()) return;
        try {
            setLoading(true);
            const exitData = {
                plate_number: plateNumber.trim().toUpperCase(),
                state: 'Check Out',
            };
            await onConfirmExit(plateNumber.trim(), exitData);
            setPlateNumber('');
            setParkingDetails(null);
            onClose();
        } catch (error) {
            console.error('Erro ao registar saída comercial:', error);
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
                            <LogOut color="#EF4444" size={20} />
                            <Text style={styles.modalTitle}>Checkout / Saída de Veículo</Text>
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
                            placeholder="Digite a matrícula (ex: AB-12-34)"
                            placeholderTextColor="#94A3B8"
                            value={plateNumber}
                            onChangeText={handleSearchPlate}
                            autoCapitalize="characters"
                            autoFocus={true}
                        />
                    </View>

                    {/* Informações Calculadas da Sessão */}
                    {parkingDetails ? (
                        <View style={styles.detailsBox}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Vaga Atribuída:</Text>
                                <Text style={styles.detailValue}>{parkingDetails.space_number}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Hora de Entrada:</Text>
                                <Text style={styles.detailValue}>{parkingDetails.time_in}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Tempo Permanência:</Text>
                                <Text style={styles.detailValue}>{parkingDetails.hours_parked} horas</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Saldo Atual:</Text>
                                <Text style={[styles.detailValue, { color: '#10B981' }]}>{parkingDetails.balance.toFixed(2)} MT</Text>
                            </View>
                            <View style={[styles.detailRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8, marginTop: 4 }]}>
                                <Text style={[styles.detailLabel, { fontWeight: 'bold', color: '#0F172A' }]}>Total a Pagar:</Text>
                                <Text style={[styles.detailValue, { fontWeight: 'bold', color: '#EF4444', fontSize: 15 }]}>
                                    {parkingDetails.amount_to_pay.toFixed(2)} MT
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.infoEmptyBox}>
                            <AlertCircle color="#94A3B8" size={18} />
                            <Text style={styles.infoEmptyText}>Digite a matrícula para calcular o tempo e saldo.</Text>
                        </View>
                    )}

                    {/* Botões de Ação */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.confirmButton, !parkingDetails && { opacity: 0.5 }]} 
                            onPress={handleConfirm} 
                            disabled={loading || !parkingDetails}
                        >
                            {loading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <>
                                    <Check color="#FFFFFF" size={16} />
                                    <Text style={styles.confirmButtonText}>Concluir Saída</Text>
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
    detailsBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#64748B',
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '500',
        color: '#0F172A',
    },
    infoEmptyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F1F5F9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoEmptyText: {
        fontSize: 12,
        color: '#64748B',
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
        backgroundColor: '#EF4444',
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