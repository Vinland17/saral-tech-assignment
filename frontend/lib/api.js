import axios from 'axios';

const BASE = 'http://localhost:1337/api';

export const registerUser = (data) =>
  axios.post(`${BASE}/auth/local/register`, data);

export const loginUser = (data) =>
  axios.post(`${BASE}/auth/local`, data);

export const getTodos = (userId, token) =>
  axios.get(
    `${BASE}/todos?populate=*`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const createTodo = (title, userId, token) =>
  axios.post(
    `${BASE}/todos`,
    { data: { title: title, isCompleted: false } },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const updateTodo = (documentId, isCompleted, token) =>
  axios.put(
    `${BASE}/todos/${documentId}`,
    { data: { isCompleted } },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deleteTodo = (documentId, token) =>
  axios.delete(
    `${BASE}/todos/${documentId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );