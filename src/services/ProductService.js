import axios from "axios";

export let createProduct = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create-product`, data);
    return res.data;
}

export let getAllProduct = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-product`);
    return res.data;
}