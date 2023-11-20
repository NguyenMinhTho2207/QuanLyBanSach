import axios from "axios";

export let createCategory = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/category/create-category`, data);
    return res.data;
}

export let getAllCategory = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all-category`);
    return res.data;
}