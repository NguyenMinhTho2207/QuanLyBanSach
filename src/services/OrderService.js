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

export let getOrderByUserId = async (id, access_token) => {
    let res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let getDetailsOrder = async (id, access_token) => {
    let res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-details-order/${id}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export const cancelOrder = async (id, access_token, orderItems, userId ) => {
    console.log("userId: ", userId)
    const data = {orderItems}
    console.log("data: ", data)
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/cancel-order/${id}`, {data}, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    })
    return res.data
}
 