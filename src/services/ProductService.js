import axios from "axios";

export let getAllProduct = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/product/get-all-product`);
    return res.data;
}