import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';

export async function login(username, password){
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                username,
                password
            }),
        }
    )
    const data = await response.json()
    if(!response.ok){
        throw new Error(data.detail || "Erro ao iniciar Sessão");
    }
    return data
}

