export const ENDPOINTS = {
  AUTH: { LOGIN: '/api/login', REGISTER: '/api/register', ME: '/api/me' },
  ACTIVITIES: { GET_ALL: '/api/activities', GET_ONE: (id: string) => `/api/activities/${id}`, CREATE: '/api/activities' },
  VOLUNTEERS: { REGISTER: '/api/volunteers/register', CANCEL: '/api/volunteers/cancel' }
};