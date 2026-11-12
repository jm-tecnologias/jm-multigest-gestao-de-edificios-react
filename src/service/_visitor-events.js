import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';



export async function scanVisitor(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.VISITOR.SCAN(params)}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    }
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}


export async function listVisitors(tokenData) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.VISITOR.LIST}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    }
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}




export async function createVisitorCheckInOut(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.VISITOR.CHECK_IN_OUT.CREATE}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      user_id: tokenData.user.id,
      visitor_id: params.visitor_id,
      status: params.status,
      note: params.note
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}
