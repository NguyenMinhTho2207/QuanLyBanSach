import axios from "axios";

export let getConfig = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/payment/config`);
    return res.data;
}