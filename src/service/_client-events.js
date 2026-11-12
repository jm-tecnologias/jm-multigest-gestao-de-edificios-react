import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';



export async function createClient(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.CLIENT.CREATE}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      user_id: tokenData.user.id,
      surname: `${params.surname}, ${params.name}`,
      num_members: params.num_members,
      description: params.description,
      building_id: tokenData.user.building_id

    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}



export async function updateClient(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.CLIENT.UPDATE(params.client_id)}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      user_id: tokenData.user.id,
      surname: `${params.surname}, ${params.name}`,
      description: params.description,
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}





export async function listClients(tokenData) {

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.CLIENT.LIST}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `Erro HTTP: ${response.status}`
    );
  }

  return response.json();
}