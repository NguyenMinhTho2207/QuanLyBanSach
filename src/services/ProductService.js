import axios from "axios";
import { axiosJWT } from "./UserService";

export let createProduct = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create-product`, data);
    return res.data;
}

export let getAllProduct = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-product`);
    return res.data;
}

export let getDetailsProduct = async (id) => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-details-product/${id}`);
    return res.data;
}

export let updateProduct = async (id, access_token, data) => {
    let res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/product/update-product/${id}`, data, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let deleteProduct = async (id, access_token) => {
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-product/${id}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let deleteMultipleProducts = async (data, access_token) => {
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/product/delete-multiple-products/`, {
        data: data,
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}