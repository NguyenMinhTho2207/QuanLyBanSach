import axios from "axios";
import { axiosJWT } from "./UserService";

export let createCategory = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/category/create-category`, data);
    return res.data;
}

export let getAllCategory = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-all-category`);
    return res.data;
}

export let getDetailsCategory = async (id) => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/category/get-details-category/${id}`);
    return res.data;
}

export let updateCategory = async (id, access_token, data) => {
    let res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/category/update-category/${id}`, data, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let deleteCategory = async (id, access_token) => {
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/category/delete-category/${id}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let deleteMultipleCategories = async (data, access_token) => {
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/category/delete-multiple-categories/`, {
        data: data,
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}