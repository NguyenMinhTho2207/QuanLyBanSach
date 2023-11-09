import axios from "axios"

export let loginUser = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data);
    return res.data;
}

export let signUpUser = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data);
    return res.data;
}

export let getDetailsUser = async (id, access_token) => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/user/get-details-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    });
    return res.data;
}