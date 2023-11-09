import axios from "axios"

export let loginUser = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-in`, data);
    return res.data;
}

export let signUpUser = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/user/sign-up`, data);
    return res.data;
}