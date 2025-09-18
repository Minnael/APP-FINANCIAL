// api.js - utilitários para consumir a API AuthFake

const API_URL = 'http://localhost:3000/api'; // Altere para o IP do seu PC se testar no celular

export async function register(login, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password })
  });
  return res.json();
}

export async function login(login, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ login, password })
  });
  return res.json();
}

export async function check() {
  const res = await fetch(`${API_URL}/check`, {
    method: 'POST',
    credentials: 'include'
  });
  return res.json();
}

export async function createProduct(produto) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(produto)
  });
  return res.json();
}

export async function listProducts() {
  const res = await fetch(`${API_URL}/products`, {
    method: 'GET',
    credentials: 'include'
  });
  return res.json();
}
