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
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#000' }}>
      <Text style={{ color: '#fff' }}>Login:</Text>
      <TextInput value={loginInput} onChangeText={setLoginInput} placeholder="login" placeholderTextColor="#888" style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#fff', color: '#000', width: 200, marginBottom: 8, padding: 8, borderRadius: 4 }} />
      <Text style={{ color: '#fff' }}>Senha:</Text>
      <TextInput value={passwordInput} onChangeText={setPasswordInput} placeholder="senha" placeholderTextColor="#888" secureTextEntry style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#fff', color: '#000', width: 200, marginBottom: 8, padding: 8, borderRadius: 4 }} />
      <View style={{ width: 200, marginBottom: 8 }}>
        <Button title="Registrar" color="#007bff" onPress={async () => {
          const res = await register(loginInput, passwordInput);
          setResult(JSON.stringify(res));
          if (!res.error) {
            Alert.alert('Registrado com sucesso!');
          }
        }} />
      </View>
      <View style={{ width: 200, marginBottom: 8 }}>
        <Button title="Login" color="#007bff" onPress={async () => {
          const res = await login(loginInput, passwordInput);
          setResult(JSON.stringify(res));
          if (!res.error) {
            navigation.replace('Produtos');
          }
        }} />
      </View>
      <View style={{ width: 200, marginBottom: 8 }}>
        <Button title="Check Token" color="#007bff" onPress={async () => {
          const res = await check();
          setResult(JSON.stringify(res));
          if (res && !res.error) {
            navigation.replace('Produtos');
          }
        }} />
      </View>
      <Text style={{ marginTop: 16, color: '#fff' }}>Resultado:</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 16, color: '#fff' }}>{result}</Text>
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#000' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>Cadastro de Produto</Text>
      <TextInput value={productName} onChangeText={setProductName} placeholder="Nome do produto" placeholderTextColor="#888" style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#fff', color: '#000', width: 200, marginBottom: 8, padding: 8, borderRadius: 4 }} />
      <TextInput value={productDescricao} onChangeText={setProductDescricao} placeholder="Descrição" placeholderTextColor="#888" style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#fff', color: '#000', width: 200, marginBottom: 8, padding: 8, borderRadius: 4 }} />
      <TextInput value={productPreco} onChangeText={setProductPreco} placeholder="Preço" placeholderTextColor="#888" keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#fff', color: '#000', width: 200, marginBottom: 8, padding: 8, borderRadius: 4 }} />
      <TextInput value={productCategoria} onChangeText={setProductCategoria} placeholder="Categoria" placeholderTextColor="#888" style={{ borderWidth: 1, borderColor: '#fff', backgroundColor: '#fff', color: '#000', width: 200, marginBottom: 8, padding: 8, borderRadius: 4 }} />
      <View style={{ width: 200, marginBottom: 8 }}>
        <Button title="Criar Produto" color="#007bff" onPress={async () => {
          const precoNumber = parseFloat(productPreco);
          const res = await createProduct({
            nome: productName,
            descricao: productDescricao,
            preco: isNaN(precoNumber) ? 0 : precoNumber,
            categoria: productCategoria
          });
          setResult(JSON.stringify(res));
          // Atualiza lista após criar
          const lista = await listProducts();
          if (lista && lista.produtos) setProducts(lista.produtos);
        }} />
      </View>
      <View style={{ width: 200, marginBottom: 8 }}>
        <Button title="Listar Produtos" color="#007bff" onPress={async () => {
          const res = await listProducts();
          setProducts(res.produtos || []);
          setResult(JSON.stringify(res));
        }} />
      </View>
      <Text style={{ marginTop: 16, fontWeight: 'bold', color: '#fff' }}>Produtos:</Text>
      {Array.isArray(products) && products.map((p, i) => (
        <Text key={i} style={{ color: '#fff' }}>{p.nome} - R$ {p.preco} - {p.categoria}</Text>
      ))}
      <Text style={{ marginTop: 16, color: '#fff' }}>Resultado:</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 16, color: '#fff' }}>{result}</Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Produtos" component={ProdutosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
