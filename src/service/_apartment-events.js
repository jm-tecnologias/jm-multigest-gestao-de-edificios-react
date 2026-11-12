import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';

export async function createApartment(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.APARTMENT.CREATE}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      floor: params.floor,
      number: params.number,
      type: params.type,
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

export async function updateApartment(tokenData, id, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.APARTMENT.UPDATE(id)}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      floor: params.floor,
      number: params.number,
      type: params.type,
      description: params.description,

    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}


export async function getApartment(tokenData, id) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.APARTMENT.GET(id)}`,
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

export async function getClientApartment(tokenData, id) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.APARTMENT.GET_CLIENT_APARTMENT(id)}`,
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

export async function listApartments(tokenData) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.APARTMENT.LIST}`,
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