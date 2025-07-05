import { BASE_URL_BACKEND } from "./api"
import { checkResponse } from "./response"
import { accessApplication } from "./api"

export const createUser = ({
    name,
    password,
    email,
    avatar
}) => {
    return fetch(`${BASE_URL_BACKEND}/signup`,{
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({name,password,email,avatar})
    }).then(checkResponse)
}

export const loginUser = ({
    email,
    password,
}) => {
    return fetch(`${BASE_URL_BACKEND}/signin`,{
        method: "POST",
        headers: {
            'Content-type': 'application/json',

        },
        body : JSON.stringify({email,password}),
    }).then(checkResponse);
}

export const currencyUser = () => {
    return fetch(`${BASE_URL_BACKEND}/users/me`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessApplication()}`
        }
    }).then(checkResponse);
}