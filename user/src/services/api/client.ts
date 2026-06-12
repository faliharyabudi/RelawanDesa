import axios from 'axios';
import { authInterceptor } from './interceptors';
export const API_URL = 'http://10.0.2.2:5000';
const apiClient = axios.create({ baseURL: API_URL, timeout: 10000 });
apiClient.interceptors.request.use(authInterceptor);
export default apiClient;