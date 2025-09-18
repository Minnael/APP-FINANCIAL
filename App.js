
import React, { useState } from 'react';
import { Text, View, Button, TextInput, ScrollView } from 'react-native';
import { register, login, check, createProduct, listProducts } from './api';

export default function App() {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [result, setResult] = useState('');
  const [productName, setProductName] = useState('');
  const [products, setProducts] = useState([]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>Login:</Text>
      <TextInput value={loginInput} onChangeText={setLoginInput} placeholder="login" style={{ borderWidth: 1, width: 200, marginBottom: 8 }} />
      <Text>Senha:</Text>
      <TextInput value={passwordInput} onChangeText={setPasswordInput} placeholder="senha" secureTextEntry style={{ borderWidth: 1, width: 200, marginBottom: 8 }} />
      <Button title="Registrar" onPress={async () => {
        const res = await register(loginInput, passwordInput);
        setResult(JSON.stringify(res));
      }} />
      <Button title="Login" onPress={async () => {
        const res = await login(loginInput, passwordInput);
        setResult(JSON.stringify(res));
      }} />
      <Button title="Check Token" onPress={async () => {
        const res = await check();
        setResult(JSON.stringify(res));
      }} />
      <Text style={{ marginTop: 16 }}>Produto:</Text>
      <TextInput value={productName} onChangeText={setProductName} placeholder="Nome do produto" style={{ borderWidth: 1, width: 200, marginBottom: 8 }} />
      <Button title="Criar Produto" onPress={async () => {
        const res = await createProduct({ nome: productName, descricao: '', preco: 0, categoria: '' });
        setResult(JSON.stringify(res));
      }} />
      <Button title="Listar Produtos" onPress={async () => {
        const res = await listProducts();
        setProducts(res);
        setResult(JSON.stringify(res));
      }} />
      <Text style={{ marginTop: 16 }}>Resultado:</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 16 }}>{result}</Text>
      <Text>Produtos:</Text>
      {Array.isArray(products) && products.map((p, i) => (
        <Text key={i}>{p.nome}</Text>
      ))}
    </ScrollView>
  );
}
