import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Building, User, Lock, Eye, EyeOff, ChevronDown, Check } from 'lucide-react-native';

import localBackgroundImage from '../assets/background.jpg';
import { login } from '../service/_auth';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('JAT');
  const [password, setPassword] = useState('Informatico@12');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);


  // 1. Criamos uma função de alerta universal
  const exibirAlerta = (titulo, mensagem) => {
    if (Platform.OS === 'web') {
      // Se for Web, usa o alert padrão do navegador
      alert(`${titulo}\n\n${mensagem}`);
    } else {
      // Se for Mobile (iOS/Android), usa o Alert do React Native
      Alert.alert(titulo, mensagem);
    }
  };


  const handleLogin = async () => {

    if (!username.trim()) {
      exibirAlerta('Atenção', 'Introduza o nome de utilizador.');

      return;
    }

    if (!password.trim()) {
      exibirAlerta('Atenção', 'Introduza a palavra-passe.');
      return;
    }

    const data = await login(username, password)
    navigation.replace('Dashboard', {
      loginData: data
    });
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#051937" />

      <ImageBackground
        source={localBackgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentWrapper}>

                {/* Lado Esquerdo: Branding e Texto Promocional */}
                <View style={styles.leftContainer}>
                  <View style={styles.brandContainer}>
                    <View style={styles.logoBox}>
                      <Building color="#FFFFFF" size={26} />
                    </View>
                    <View>
                      <Text style={styles.brandTitle}>JM Condomínio</Text>
                      <Text style={styles.brandSubtitle}>Gestão de Edifícios</Text>
                    </View>
                  </View>

                  <View style={styles.heroTextContainer}>
                    <Text style={styles.heroTitle}>
                      Segurança, organização{'\n'}e tranquilidade.
                    </Text>
                    <Text style={styles.heroSubtitle}>
                      O seu condomínio, mais conectado.
                    </Text>
                  </View>
                </View>

                {/* Lado Direito: Card de Login */}
                <View style={styles.rightContainer}>
                  <View style={styles.loginCard}>
                    <Text style={styles.loginTitle}>Iniciar Sessão</Text>
                    <Text style={styles.loginSubtitle}>Aceda à sua conta para continuar</Text>

                    {/* Campo Utilizador */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Utilizador</Text>
                      <View style={styles.inputField}>
                        <User color="#94A3B8" size={18} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Digite o seu utilizador"
                          placeholderTextColor="#94A3B8"
                          value={username}
                          onChangeText={setUsername}
                        />
                      </View>
                    </View>

                    {/* Campo Palavra-passe */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Palavra-passe</Text>
                      <View style={styles.inputField}>
                        <Lock color="#94A3B8" size={18} />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Digite a sua palavra-passe"
                          placeholderTextColor="#94A3B8"
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ? (
                            <EyeOff color="#94A3B8" size={18} />
                          ) : (
                            <Eye color="#94A3B8" size={18} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Checkbox Manter sessão ativa */}
                    <View style={styles.rememberRow}>
                      <TouchableOpacity
                        style={[styles.checkbox, rememberMe && styles.checkboxActive]}
                        onPress={() => setRememberMe(!rememberMe)}
                      >
                        {rememberMe && <Check color="#FFFFFF" size={12} />}
                      </TouchableOpacity>
                      <Text style={styles.rememberText} onPress={() => setRememberMe(!rememberMe)}>
                        Manter sessão ativa
                      </Text>
                    </View>

                    {/* Botão Entrar */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                      <Text style={styles.loginButtonText}>Entrar</Text>
                    </TouchableOpacity>

                    {/* Link Recuperar Palavra-passe */}
                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                      <Text style={styles.forgotPasswordText}>Esqueceu a palavra-passe?</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051937',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 25, 55, 0.8)',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    flexWrap: 'wrap',
    gap: 40,
  },
  leftContainer: {
    flex: 1,
    minWidth: 280,
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  heroTextContainer: {
    marginBottom: 20,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: '#94A3B8',
    fontSize: 15,
  },
  rightContainer: {
    width: 420,
    maxWidth: '100%',
    alignSelf: 'center',
  },
  loginCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  dropdownField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: '#FFFFFF',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  inputIconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    height: '100%',
  },
  dropdownText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#0284C7',
  },
  rememberText: {
    fontSize: 13,
    color: '#334155',
  },
  loginButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '500',
  },
});




// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   ImageBackground,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { Building, User, Lock, Eye, EyeOff, Check } from 'lucide-react-native';

// import localBackgroundImage from '../assets/background.jpg';
// import { login } from '../service/auth';

// export default function LoginScreen({ navigation }) {
//   const [username, setUsername] = useState('JAT');
//   const [password, setPassword] = useState('Informatico@12');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(true);

//   // Função de alerta universal
//   const exibirAlerta = (titulo, mensagem) => {
//     if (Platform.OS === 'web') {
//       window.alert(`${titulo}\n\n${mensagem}`);
//     } else {
//       // Importado condicionalmente ou via RN se necessário, mas podes manter se importares o Alert do react-native
//       alert(`${titulo}: ${mensagem}`);
//     }
//   };

//   const handleLogin = async () => {
//     if (!username.trim()) {
//       exibirAlerta('Atenção', 'Introduza o nome de utilizador.');
//       return;
//     }

//     if (!password.trim()) {
//       exibirAlerta('Atenção', 'Introduza a palavra-passe.');
//       return;
//     }

//     try {
//       const data = await login(username, password);

//       // Se "Manter sessão ativa" estiver marcado, grava no localStorage (para persistir no refresh)
//       if (rememberMe && typeof window !== 'undefined' && window.localStorage) {
//         localStorage.setItem('loginData', JSON.stringify(data));
//       }

//       navigation.replace('Dashboard', {
//         loginData: data,
//       });
//     } catch (error) {
//       console.error('Erro no login:', error);
//       exibirAlerta('Erro de Autenticação', error.message || 'Credenciais inválidas ou erro de ligação.');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#051937" />

//       <ImageBackground
//         source={localBackgroundImage}
//         style={styles.backgroundImage}
//         resizeMode="cover"
//       >
//         <View style={styles.overlay}>
//           <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={styles.keyboardView}
//           >
//             <ScrollView
//               contentContainerStyle={styles.scrollContainer}
//               showsVerticalScrollIndicator={false}
//             >
//               <View style={styles.contentWrapper}>

//                 {/* Lado Esquerdo: Branding e Texto Promocional */}
//                 <View style={styles.leftContainer}>
//                   <View style={styles.brandContainer}>
//                     <View style={styles.logoBox}>
//                       <Building color="#FFFFFF" size={26} />
//                     </View>
//                     <View>
//                       <Text style={styles.brandTitle}>JM Condomínio</Text>
//                       <Text style={styles.brandSubtitle}>Gestão de Edifícios</Text>
//                     </View>
//                   </View>

//                   <View style={styles.heroTextContainer}>
//                     <Text style={styles.heroTitle}>
//                       Segurança, organização{'\n'}e tranquilidade.
//                     </Text>
//                     <Text style={styles.heroSubtitle}>
//                       O seu condomínio, mais conectado.
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Lado Direito: Card de Login */}
//                 <View style={styles.rightContainer}>
//                   <View style={styles.loginCard}>
//                     <Text style={styles.loginTitle}>Iniciar Sessão</Text>
//                     <Text style={styles.loginSubtitle}>Aceda à sua conta para continuar</Text>

//                     {/* Campo Utilizador */}
//                     <View style={styles.inputGroup}>
//                       <Text style={styles.label}>Utilizador</Text>
//                       <View style={styles.inputField}>
//                         <User color="#94A3B8" size={18} />
//                         <TextInput
//                           style={styles.textInput}
//                           placeholder="Digite o seu utilizador"
//                           placeholderTextColor="#94A3B8"
//                           value={username}
//                           onChangeText={setUsername}
//                           autoCapitalize="none"
//                         />
//                       </View>
//                     </View>

//                     {/* Campo Palavra-passe */}
//                     <View style={styles.inputGroup}>
//                       <Text style={styles.label}>Palavra-passe</Text>
//                       <View style={styles.inputField}>
//                         <Lock color="#94A3B8" size={18} />
//                         <TextInput
//                           style={styles.textInput}
//                           placeholder="Digite a sua palavra-passe"
//                           placeholderTextColor="#94A3B8"
//                           secureTextEntry={!showPassword}
//                           value={password}
//                           onChangeText={setPassword}
//                         />
//                         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                           {showPassword ? (
//                             <EyeOff color="#94A3B8" size={18} />
//                           ) : (
//                             <Eye color="#94A3B8" size={18} />
//                           )}
//                         </TouchableOpacity>
//                       </View>
//                     </View>

//                     {/* Checkbox Manter sessão ativa */}
//                     <View style={styles.rememberRow}>
//                       <TouchableOpacity
//                         style={[styles.checkbox, rememberMe && styles.checkboxActive]}
//                         onPress={() => setRememberMe(!rememberMe)}
//                       >
//                         {rememberMe && <Check color="#FFFFFF" size={12} />}
//                       </TouchableOpacity>
//                       <Text style={styles.rememberText} onPress={() => setRememberMe(!rememberMe)}>
//                         Manter sessão ativa
//                       </Text>
//                     </View>

//                     {/* Botão Entrar */}
//                     <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//                       <Text style={styles.loginButtonText}>Entrar</Text>
//                     </TouchableOpacity>

//                     {/* Link Recuperar Palavra-passe */}
//                     <TouchableOpacity style={styles.forgotPasswordContainer}>
//                       <Text style={styles.forgotPasswordText}>Esqueceu a palavra-passe?</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//               </View>
//             </ScrollView>
//           </KeyboardAvoidingView>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#051937',
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(5, 25, 55, 0.8)',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   contentWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     maxWidth: 1100,
//     alignSelf: 'center',
//     flexWrap: 'wrap',
//     gap: 40,
//   },
//   leftContainer: {
//     flex: 1,
//     minWidth: 280,
//     justifyContent: 'center',
//   },
//   brandContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 40,
//   },
//   logoBox: {
//     width: 48,
//     height: 48,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255, 255, 255, 0.15)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   brandTitle: {
//     color: '#FFFFFF',
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   brandSubtitle: {
//     color: '#94A3B8',
//     fontSize: 12,
//     letterSpacing: 0.5,
//   },
//   heroTextContainer: {
//     marginBottom: 20,
//   },
//   heroTitle: {
//     color: '#FFFFFF',
//     fontSize: 32,
//     fontWeight: 'bold',
//     lineHeight: 40,
//     marginBottom: 12,
//   },
//   heroSubtitle: {
//     color: '#94A3B8',
//     fontSize: 15,
//   },
//   rightContainer: {
//     width: 420,
//     maxWidth: '100%',
//     alignSelf: 'center',
//   },
//   loginCard: {
//     width: '100%',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 28,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.25,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   loginTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#0F172A',
//     marginBottom: 4,
//   },
//   loginSubtitle: {
//     fontSize: 12,
//     color: '#64748B',
//     marginBottom: 20,
//   },
//   inputGroup: {
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#334155',
//     marginBottom: 6,
//   },
//   inputField: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#CBD5E1',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     height: 42,
//     backgroundColor: '#FFFFFF',
//     gap: 10,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 13,
//     color: '#0F172A',
//     height: '100%',
//   },
//   rememberRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//     gap: 8,
//   },
//   checkbox: {
//     width: 18,
//     height: 18,
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#0284C7',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   checkboxActive: {
//     backgroundColor: '#0284C7',
//   },
//   rememberText: {
//     fontSize: 13,
//     color: '#334155',
//   },
//   loginButton: {
//     backgroundColor: '#0284C7',
//     borderRadius: 8,
//     height: 46,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 6,
//     marginBottom: 14,
//   },
//   loginButtonText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   forgotPasswordContainer: {
//     alignItems: 'center',
//   },
//   forgotPasswordText: {
//     color: '#0284C7',
//     fontSize: 13,
//     fontWeight: '500',
//   },
// });