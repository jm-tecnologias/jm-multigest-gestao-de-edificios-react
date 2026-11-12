import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';



export async function createHistoric(tokenData, member, params) {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BUILDING.HISTORIC.CREATE}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
            client_id: member.client_id,
            user_id: tokenData.user.id,
            apartment_id: params.apartment_id,
            occupational_date: params.occupational_date,
            num_members: params.num_members,
            final_date: params.final_date,
        }),
    })
    const data = await response.json()
    if (!response.ok) {
        console.error("Detalhes do erro da API:", JSON.stringify(data, null, 2));
        throw new Error(typeof data.detail === 'string' ? data.detail : JSON.stringify(data));
    }
    return data
}