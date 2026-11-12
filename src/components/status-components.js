import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
} from 'react-native';

export function Loading() {
    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.centerContainer}>

                <Text style={styles.loadingText}>
                    A carregar dados...
                </Text>

            </View>

        </SafeAreaView>
    );
}

export function Erro(message) {
    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.centerContainer}>

                <Text style={styles.errorTitle}>
                    Erro ao carregar dados ...
                </Text>

                <Text style={styles.errorText}>
                    {typeof message === 'object' ? JSON.stringify(message) : message || "Erro desconhecido"}
                </Text>

            </View>

        </SafeAreaView>
    );
}



export function NoData() {
    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.centerContainer}>

                <Text>
                    Nenhum dado encontrado sobre o Anfitrião, Apartamento ou Edificio...
                </Text>

            </View>

        </SafeAreaView>
    );
}



// ===========================================================
// ESTILOS
// ===========================================================

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#faf8ff',
    },
    loadingText: {
        fontSize: 16,
        color: '#64748b',
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#dc2626',
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },

});