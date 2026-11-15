import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';


export async function listCategories(tokenData) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.CATEGORY.LIST}`,
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

export async function getCategory(tokenData, id) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.CATEGORY.GET(id)}`,
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