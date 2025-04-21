import api from './api';

export async function getMenu() {
  const response = await api.get('/menu');
  return response.data;
}
