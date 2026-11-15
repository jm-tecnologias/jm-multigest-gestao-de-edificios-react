import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Building, Search, Bell, ChevronDown, Menu } from 'lucide-react-native';

export default function Navbar({ 
  onToggleSidebar,
  loginData, 
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768; // Define o limite para mobile abaixo de 768px

  return (
    <View style={styles.topNavbar}>
      <View style={styles.brandContainer}>
        {/* Botão de Menu Hambúrguer para Mobile */}
        {onToggleSidebar && (
          <TouchableOpacity 
            style={styles.menuToggleButton} 
            onPress={onToggleSidebar}
          >
            <Menu color="#FFFFFF" size={22} />
          </TouchableOpacity>
        )}

        <Building color="#FFFFFF" size={24} />
        
        {/* Oculta o subtítulo em telemóveis para economizar espaço */}
        <View style={styles.brandTextContainer}>
          <Text style={styles.brandTitle} numberOfLines={1}>JM Condomínio</Text>
          {!isMobile && <Text style={styles.brandSubtitle}>Gestão de Edifícios</Text>}
        </View>
      </View>

      <View style={styles.userProfileContainer}>
        {!isMobile && (
          <TouchableOpacity style={styles.iconButton}>
            <Bell color="#FFFFFF" size={20} />
          </TouchableOpacity>
        )}
        
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{loginData?.user.name[0]}{loginData?.user.surname[0]}</Text>
          </View>
          
          {/* Oculta o nome e cargo em mobile, mostrando apenas o avatar e a seta */}
          {!isMobile && (
            <View style={styles.userTextContainer}>
              <Text style={styles.userName} numberOfLines={1}>{loginData?.user.name} {loginData?.user.surname}</Text>
              <Text style={styles.userRole} numberOfLines={1}>{loginData?.user?.role}</Text>
            </View>
          )}

          <ChevronDown color="#FFFFFF" size={16} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topNavbar: {
    height: 60,
    backgroundColor: '#051937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  brandContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuToggleButton: { padding: 4, marginRight: 2 },
  brandTextContainer: { justifyContent: 'center' },
  brandTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  brandSubtitle: { color: '#94A3B8', fontSize: 10 },
  // globalSearchContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
  //   borderRadius: 8,
  //   paddingHorizontal: 10,
  //   height: 36,
  //   flex: 1,
  //   maxWidth: 350,
  //   marginHorizontal: 10,
  // },
  globalSearchInput: { color: '#FFFFFF', marginLeft: 6, flex: 1, fontSize: 13 },
  userProfileContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: { padding: 4 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D97706', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  userTextContainer: { alignItems: 'flex-start' },
  userName: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  userRole: { color: '#94A3B8', fontSize: 10 },
});