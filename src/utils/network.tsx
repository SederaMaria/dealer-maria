import Axios from 'axios';
import Cookies from 'js-cookie'
import { logout } from './authenticate';

const LOS_API : string | undefined = process.env.REACT_APP_LOS_API 
const auth_token = Cookies.get('authToken')

// https://axios-http.com/docs/interceptors
Axios.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response.status === 401) {
        logout()
        window.location.href = '/login'
    } else {
        return Promise.reject(error);
    }
  }
)

export const GET = (url: string) => {
    return Axios.get(`${LOS_API}${url}`, {
        headers: {
            Authorization: ` Token ${auth_token}`,
            Accept: "application/json"
        }
    })
}


export const DELETE = (url: string) => {
    return Axios.delete(`${LOS_API}${url}`, {
        headers: {
            Authorization: ` Token ${auth_token}`,
            Accept: "application/json"
        }
    })
}

export const POST = (url: string, data: object | undefined) => {
    return Axios.post(`${LOS_API}${url}`, data, {
        headers: {
            Authorization: ` Token ${auth_token}`,
            Accept: "application/json"
        }
    })
}

export const PUT = (url: string, data: object | undefined) => {
    return Axios.put(`${LOS_API}${url}`, data, {
        headers: {
            Authorization: ` Token ${auth_token}`,
            Accept: "application/json"
        }
    })
}


export const PATCH = (url: string, data: object | undefined) => {
    return Axios.patch(`${LOS_API}${url}`, data, {
        headers: {
            Authorization: ` Token ${auth_token}`,
            Accept: "application/json"
        }
    })
}