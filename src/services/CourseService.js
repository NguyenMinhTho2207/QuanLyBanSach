import axios from "axios";
import { axiosJWT } from "./UserService";

export let createCourse = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/course/create-course`, data);
    return res.data;
}

export let getAllCourse = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all-course`);
    return res.data;
}

export let getDetailsCourse = async (id) => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-details-course/${id}`);
    return res.data;
}

export let updateCourse = async (id, access_token, data) => {
    let res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/course/update-course/${id}`, data, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let deleteCourse = async (id, access_token) => {
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/course/delete-course/${id}`, {
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

export let deleteMultipleCourses = async (data, access_token) => {
    let res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/course/delete-multiple-courses/`, {
        data: data,
        headers: {
            authorization: `Bearer ${access_token}`,
        }
    });
    return res.data;
}

// register course
export let registerCourse = async (data) => {
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/course/register-course`, data);
    return res.data;
}

export let getRegisterCourse = async (userId, courseId) => {
    var data = {userId, courseId};
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/course/get-register-course/`, data);

    return res.data;
}

export let getAllRegisterCourse = async () => {
    let res = await axios.get(`${process.env.REACT_APP_API_URL}/course/get-all-register-course/`);

    return res.data;
}

export let cancelRegisterCourse = async (userId, courseId) => {
    var data = {userId, courseId};
    let res = await axios.post(`${process.env.REACT_APP_API_URL}/course/cancel-register-course/`, data);

    return res.data;
}