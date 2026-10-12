
import api from './api';

export const login = async(data)=>{
 return api.post('/auth/login',data);
};

export const register = async(data)=>{
 return api.post('/auth/register',data);
};
