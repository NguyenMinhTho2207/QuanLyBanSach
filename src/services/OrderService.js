import { axiosJWT } from "./UserService";

export let createOrder = async (access_token, data) => {
    let res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create-order`, data, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let createOrderDetail = async (access_token, data) => {
    let res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create-order-details`, data, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}
 