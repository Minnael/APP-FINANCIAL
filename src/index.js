import React, { useState, useEffect } from 'react';
import { Text, View, Button, TextInput, ScrollView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { register, login, check, createProduct, listProducts } from './api';

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [result, setResult] = useState('');

  // Checa se já está autenticado ao entrar na tela
  useEffect(() => {
    (async () => {
      const res = await check();
      if (res && !res.error) {
        navigation.replace('Produtos');
      }
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#181A20' }}>
      <View style={{ width: '100%', maxWidth: 340, backgroundColor: '#23262F', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24, letterSpacing: 1 }}>Login</Text>
        <TextInput value={loginInput} onChangeText={setLoginInput} placeholder="Usuário" placeholderTextColor="#888" style={{ borderWidth: 0, backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: 16, padding: 14, borderRadius: 8, fontSize: 16 }} />
        <TextInput value={passwordInput} onChangeText={setPasswordInput} placeholder="Senha" placeholderTextColor="#888" secureTextEntry style={{ borderWidth: 0, backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: 16, padding: 14, borderRadius: 8, fontSize: 16 }} />
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Button title="Entrar" color="#2563eb" onPress={async () => {
            const res = await login(loginInput, passwordInput);
            setResult(JSON.stringify(res));
            if (!res.error) {
              navigation.replace('Produtos');
            } else {
              Alert.alert('Erro', res.message || 'Login inválido!');
            }
          }} />
        </View>
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Button title="Registrar" color="#22d3ee" onPress={async () => {
            const res = await register(loginInput, passwordInput);
            setResult(JSON.stringify(res));
            if (!res.error) {
              Alert.alert('Registrado com sucesso!');
            }
          }} />
        </View>
        {/* Removido botão Check Token e label Resultado */}
        {/* Exibe mensagem de erro de login, se houver */}
        {result && JSON.parse(result).error && (
          <Text style={{ color: '#ff5252', marginTop: 8, fontSize: 14 }}>{JSON.parse(result).message || 'Login inválido!'}</Text>
        )}
      </View>
    </ScrollView>
  );
}

function ProdutosScreen({ navigation }) {
  const [productName, setProductName] = useState('');
  const [productDescricao, setProductDescricao] = useState('');
  const [productPreco, setProductPreco] = useState('');
  const [productCategoria, setProductCategoria] = useState('');
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState('');

  // Carrega produtos ao entrar na tela
  useEffect(() => {
    (async () => {
      const res = await listProducts();
      if (res && res.produtos) setProducts(res.produtos);
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#181A20' }}>
      <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#23262F', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#fff', marginBottom: 20, letterSpacing: 1 }}>Cadastro de Produto</Text>
        <TextInput value={productName} onChangeText={setProductName} placeholder="Nome do produto" placeholderTextColor="#888" style={{ borderWidth: 0, backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: 12, padding: 14, borderRadius: 8, fontSize: 16 }} />
        <TextInput value={productDescricao} onChangeText={setProductDescricao} placeholder="Descrição" placeholderTextColor="#888" style={{ borderWidth: 0, backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: 12, padding: 14, borderRadius: 8, fontSize: 16 }} />
        <TextInput value={productPreco} onChangeText={setProductPreco} placeholder="Preço" placeholderTextColor="#888" keyboardType="numeric" style={{ borderWidth: 0, backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: 12, padding: 14, borderRadius: 8, fontSize: 16 }} />
        <TextInput value={productCategoria} onChangeText={setProductCategoria} placeholder="Categoria" placeholderTextColor="#888" style={{ borderWidth: 0, backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: 16, padding: 14, borderRadius: 8, fontSize: 16 }} />
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Button title="Criar Produto" color="#2563eb" onPress={async () => {
            const precoNumber = parseFloat(productPreco);
            const res = await createProduct({
              nome: productName,
              descricao: productDescricao,
              preco: isNaN(precoNumber) ? 0 : precoNumber,
              categoria: productCategoria
            });
            if (!res.error) {
              Alert.alert('Cadastrado com Sucesso!');
            }
            // Atualiza lista após criar
            const lista = await listProducts();
            if (lista && lista.produtos) setProducts(lista.produtos);
          }} />
        </View>
        <View style={{ width: '100%', marginBottom: 12 }}>
          <Button title="Listar Produtos" color="#6366f1" onPress={() => {
            navigation.navigate('ListagemProdutos');
          }} />
        </View>
      </View>
    </ScrollView>
  );
}

function ListagemProdutosScreen() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await listProducts();
      if (res && res.produtos) setProducts(res.produtos);
    })();
  }, []);
  function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function formatPreco(preco) {
    if (typeof preco !== 'number') preco = Number(preco);
    if (isNaN(preco)) return '';
    return preco.toFixed(2).replace('.', ',');
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#181A20' }}>
      <View style={{ width: '100%', maxWidth: 400, backgroundColor: '#23262F', borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24, color: '#fff', marginBottom: 20, letterSpacing: 1 }}>Produtos Cadastrados</Text>
        <View style={{ width: '100%', marginTop: 8 }}>
          {Array.isArray(products) && products.length === 0 && (
            <Text style={{ color: '#fff', opacity: 0.7 }}>Nenhum produto cadastrado.</Text>
          )}
          {Array.isArray(products) && products.map((p, i) => (
            <View key={i} style={{ backgroundColor: '#181A20', borderRadius: 8, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#23262F' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{p.nome}</Text>
              <Text style={{ color: '#fff', opacity: 0.8, fontSize: 15, marginTop: 2 }}>R$ {formatPreco(p.preco)}</Text>
              <Text style={{ color: '#fff', opacity: 0.7, fontSize: 13, marginTop: 2 }}>{p.descricao}</Text>
              <Text style={{ color: '#fff', opacity: 0.6, fontSize: 12, marginTop: 2 }}>{formatDate(p.createdAt)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Produtos" 
          component={ProdutosScreen} 
          options={({ navigation }) => ({
            title: 'Produtos',
            headerStyle: { backgroundColor: '#fff' },
            headerTitleStyle: { color: '#181A20', fontWeight: 'bold', fontSize: 22 },
            headerRight: () => (
              <View style={{ marginRight: 10 }}>
                <Button title="Logout" color="#ff5252" onPress={async () => {
                  await fetch('http://localhost:3000/api/logout', { method: 'POST', credentials: 'include' });
                  navigation.replace('Login');
                }} />
              </View>
            ),
          })}
        />
        <Stack.Screen name="ListagemProdutos" component={ListagemProdutosScreen} options={{ title: 'Produtos' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
