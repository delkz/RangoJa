'use server'

import { getCookie, hasCookie, setCookie } from "cookies-next";
import { api } from "./api"; 
import { cookies } from 'next/headers';
import { User } from '../../types/types'

interface validadeTokenReturn {
    isValid: boolean;
    userData: User | object;
    status?: string;
}

const validateToken = async (): Promise<validadeTokenReturn> => {
    if(!hasCookie('jwt',{cookies})) return {isValid: false, userData: {}};



    const jwt = getCookie('jwt', { cookies });

 
        const response = await api.post(
            '', 
            {
                query: `
                query {
                    validateToken {
                        id
                        email
                        name
                    }
                }
                `
            },
            {
                headers: {
                    "Authorization": jwt
                }
            }
        );

        const data = response?.data?.data;

        if (response?.data?.errors) {
            return {isValid: false, userData: {}, status: response.data.errors[0].message};
        }

        // Se a validação for bem-sucedida, salve os dados do usuário

        return {isValid: true, userData: data};


};

export default validateToken;
