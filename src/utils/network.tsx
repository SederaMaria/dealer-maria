import Axios from 'axios';

const LOS_API : string | undefined = process.env.REACT_APP_LOS_API 
const auth_token = window.localStorage.getItem('auth_token');

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