
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    LayoutDashboard,
    Home,
    Users,
    Car,
    ParkingSquare,
    ShieldCheck,
    ChevronDown,
} from 'lucide-react-native';

const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, route: 'Dashboard' },
    { label: 'Apartamentos', icon: Home, route: 'Apartamentos' },
    { label: 'Clientes', icon: Users, route: 'Clientes' },
    { label: 'Parque Residencial', icon: Car, route: 'Parque Residencial' },
    { label: 'Parque Comercial', icon: ParkingSquare, route: 'Parque Comercial' },
    { label: 'Segurança', icon: ShieldCheck, route: 'Segurança' },
];

export default function Sidebar({ activeMenu, loginData, isOpen = true, onCloseMobile }) {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    
    // Consideramos mobile se a largura for inferior a 768px
    const isMobile = width < 768;

    const handlePress = (item) => {
        if (item.route) {
            navigation.navigate(item.route, { loginData });
            // Se estiver em mobile, fecha o menu automaticamente após o clique
            if (isMobile && onCloseMobile) {
                onCloseMobile();
            }
        }
    };

    // Se for mobile e estiver fechado, não renderiza nada
    if (isMobile && !isOpen) {
        return null;
    }

    return (
        <View style={[styles.sidebarWrapper, isMobile && styles.mobileSidebarWrapper]}>
            <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.label;
                    return (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.menuItem, isActive && styles.activeMenuItem]}
                            onPress={() => handlePress(item)}
                        >
                            <Icon 
                                color={isActive ? '#FFFFFF' : '#94A3B8'} 
                                size={isActive ? 19 : 18} 
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <Text style={[styles.menuItemText, isActive && styles.activeMenuItemText]} numberOfLines={1}>
                                {item.label}
                            </Text>
                            {item.hasSub && <ChevronDown color="#FFFFFF" size={14} style={{ marginLeft: 'auto' }} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sidebarWrapper: {
        width: 200,
        minWidth: 200,
        maxWidth: 200,
        backgroundColor: '#051937',
        flexShrink: 0,
        height: '100%',
    },
    mobileSidebarWrapper: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        width: 240,
        maxWidth: 240,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    sidebar: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        gap: 10,
        marginBottom: 4,
    },
    activeMenuItem: {
        backgroundColor: '#0284C7',
    },
    menuItemText: {
        color: '#94A3B8',
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    activeMenuItemText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});