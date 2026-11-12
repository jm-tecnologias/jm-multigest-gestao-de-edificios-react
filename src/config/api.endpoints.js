
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/master/user/login',
  },

 



  MASTER: {
    BUILDING: {
      GET: (id) => `/master/building/get/${id}`
    },
  },

  BUILDING: {
    APARTMENT: {
      CREATE: '/api/apartment/create?database_name=building',
      UPDATE: (id) => `/api/apartment/update/${id}?database_name=building`,
      GET: (id) => `/api/apartment/get-apartment/${id}?database_name=building`,
      GET_CLIENT_APARTMENT: (id) => `/api/apartment/get-client-apartment/${id}?database_name=building`,
      LIST: '/api/apartment/list?database_name=building'
    },
    HISTORIC:{
      CREATE: '/api/historic/create?database_name=building'
    },
  },

  CLIENTS: {
    CLIENT:{
      CREATE: '/api/client/create?database_name=building',
      UPDATE: (id) => `/api/client/update/${id}?database_name=building`,
      LIST: '/api/client/list?database_name=building',
    },
    MEMBER: {
      CREATE: '/api/member/create?database_name=building',
      UPDATE: (id) => `/api/member/update/${id}?database_name=building`,
      LIST: '/api/member/list?database_name=building',
      GET: (id) => `/api/member/get-member/${id}?database_name=building`,
      SCAN: (token) => `/api/member/scan/${token}?database_name=building`,
      CHECK_IN_OUT: {
        CREATE: '/api/member/check-in-out/create?database_name=building',
      },
      VISITOR: {
        SCAN: (token) => `/api/visitor/scan/${token}?database_name=building`,
        LIST: '/api/visitor/list?database_name=building',
        CHECK_IN_OUT: {
          CREATE: `/api/visitor/check-in-out/create?database_name=building`,
        }
        
      }
    },
  },
};

export default API_ENDPOINTS;
