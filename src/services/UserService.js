import axios from "axios"

export const axiosJWT = axios.create();

export let loginUser = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data);
    return res.data;
}

export let signUpUser = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data);
    return res.data;
}

export let getDetailsUser = async (id, access_token) => {
    let res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/user/get-details-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let refreshToken = async () => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/refresh-token`, {
        withCredentials: true // nếu có cookie tự động truyền xuống backend
    });
    return res.data;
}

export let logoutUser = async () => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
    return res.data;
}

export let updateUser = async (id, data, access_token) => {
    let res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

