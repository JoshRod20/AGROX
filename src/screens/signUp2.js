
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signUpStyle } from '../styles/signUpStyle';
import { db } from '../services/database';
import { collection, getDocs, query } from 'firebase/firestore';

function generateUserId(usersLength) {
  // Generates a userId like U0001, U0002, etc.
  const num = usersLength + 1;
  return `U${num.toString().padStart(4, '0')}`;
}

const SignUp2 = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [department, setDepartment] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [community, setCommunity] = useState('');
  const [loading, setLoading] = useState(false);

  // Ejemplo de datos para los selectores
  const departments = [
    'Boaco', 'Carazo', 'Chinandega', 'Chontales', 'Estelí', 'Granada',
    'Jinotega', 'León', 'Madriz', 'Managua', 'Masaya', 'Matagalpa',
    'Nueva Segovia', 'Río San Juan', 'Rivas', 'RAAN', 'RAAS'
  ];
  const municipalities = ['Municipio 1', 'Municipio 2', 'Municipio 3'];
  const communities = ['Comunidad 1', 'Comunidad 2', 'Comunidad 3'];

  return (
    <SafeAreaView style={signUpStyle.container}>
      <Text style={signUpStyle.title}>Registro</Text>
      <Text style={signUpStyle.signUpTitle}>Crea una cuenta de <Text style={signUpStyle.signUpLinkTitle}>AGROX</Text></Text>
      {/* Nombre */}
      <Text style={signUpStyle.label}>Nombre</Text>
      <TextInput
        style={signUpStyle.input}
        placeholder="Ingrese su nombre"
        value={name}
        onChangeText={setName}
      />
      {/* Contraseña */}
      <Text style={signUpStyle.label}>Contraseña</Text>
      <View style={signUpStyle.inputPasswordContainer}>
        <TextInput
          style={signUpStyle.inputPassword}
          placeholder="Ingrese su contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="#888" />
        </TouchableOpacity>
      </View>
      {/* Departamento */}
      <Text style={signUpStyle.label}>Departamento</Text>
      <View style={signUpStyle.input}>
        <Picker
          selectedValue={department}
          onValueChange={setDepartment}
        >
          <Picker.Item label="Seleccione un departamento" value="" />
          {departments.map((dep) => (
            <Picker.Item key={dep} label={dep} value={dep} />
          ))}
        </Picker>
      </View>
      {/* Municipio */}
      <Text style={signUpStyle.label}>Municipio</Text>
      <View style={signUpStyle.input}>
        <Picker
          selectedValue={municipality}
          onValueChange={setMunicipality}
        >
          <Picker.Item label="Seleccione un municipio" value="" />
          {municipalities.map((mun) => (
            <Picker.Item key={mun} label={mun} value={mun} />
          ))}
        </Picker>
      </View>
      {/* Comunidad o Comarca */}
      <Text style={signUpStyle.label}>Comunidad o comarca</Text>
      <View style={signUpStyle.input}>
        <Picker
          selectedValue={community}
          onValueChange={setCommunity}
        >
          <Picker.Item label="Seleccione una comunidad" value="" />
          {communities.map((com) => (
            <Picker.Item key={com} label={com} value={com} />
          ))}
        </Picker>
      </View>
      {/* Botón siguiente */}
      <TouchableOpacity
        style={signUpStyle.button}
        onPress={async () => {
          if (!name || !password || !department || !municipality || !community) {
            Alert.alert('Campos incompletos', 'Por favor, complete todos los campos.');
            return;
          }
          setLoading(true);
          try {
            // Obtener cantidad de usuarios para generar userId único
            const usersSnap = await getDocs(query(collection(db, 'Users')));
            const userId = generateUserId(usersSnap.size);
            navigation.navigate('SignUp', {
              userId,
              name,
              password,
              department,
              municipality,
              community,
            });
          } catch (e) {
            Alert.alert('Error', e.message || 'Error al generar ID de usuario');
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
      >
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={signUpStyle.button}
        >
          <Text style={signUpStyle.buttonText}>{loading ? 'Cargando...' : 'Siguiente'}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUp2;