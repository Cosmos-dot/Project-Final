
import api from './api';

export const analyzeEmail = async(headers)=>{
 return api.post('/analyze',headers);
};
