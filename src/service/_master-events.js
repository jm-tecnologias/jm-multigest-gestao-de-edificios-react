import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';

export async function getBuildingDate(tokenData, data) {
  const response = await fetch(
     `${API_CONFIG.BASE_URL}${API_ENDPOINTS.MASTER.BUILDING.GET(data.building_id)}`,
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