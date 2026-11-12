import API_CONFIG from '../config/api.config';
import API_ENDPOINTS from '../config/api.endpoints';



export async function createMember(tokenData, client, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.CREATE}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      user_id: tokenData.user.id,
      client_id: client.id,
      apartment_id: params.apartment_id,
      doc_id: params.doc_id,
      name: params.name,
      surname: params.surname,
      phone: params.phone,
      email: params.email,
      client_relationship: params.client_relationship,
      description: params.description,
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}


export async function updateMember(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.UPDATE(params.id)}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      user_id: tokenData.user.id,
      doc_id: params.doc_id,
      name: params.name,
      surname: params.surname,
      phone: params.phone,
      email: params.email,
      description: params.description,
    }),
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || "Erro de persistencia de dados")
  }
  return data
}


export async function getMember(tokenData, params)  {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.GET(params.member_id)}`,
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

export async function listMembers(tokenData) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.LIST}`, {
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



export async function scanMember(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.SCAN(params)}`, {
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




export async function createMemberCheckInOut(tokenData, params) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CLIENTS.MEMBER.CHECK_IN_OUT.CREATE}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    },
    body: JSON.stringify({
      user_id: tokenData.user.id,
      member_id: params.member_id,
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









