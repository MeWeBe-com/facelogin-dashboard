import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "";

const axiosConfig = axios.create({
    baseURL: BASE_URL
});

// GET request
const get = async (url: string) => {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    try {
        const res: any = await toast.promise(
            axiosConfig.get(url, { headers: headers }),
            {
                pending: 'Please Wait...',
            }
        );
        return res.data;
    } catch (e) {
        console.log(e)
    }
}

// POST request
const post = async (url: string, data: any) => {
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    try {
        const res: any = await toast.promise(
            axiosConfig.post(url, data, { headers: headers }),
            {
                pending: 'Please Wait...',
            }
        );
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// File Upload (multipart/form-data)
const fileUpload = async (url: string, formData: FormData) => {
    let headers = {
        "Content-Type": "multipart/form-data"
    }
    try {
        const res: any = await toast.promise(
            axiosConfig.post(url, formData, { headers: headers, }),
            {
                pending: 'Please Wait...',
            }
        );
        return res.data;
    } catch (error) {
        return handleError(error);
    }
};

// Centralized Error Handling
const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.response?.data || error.message);
        return error.response?.data || { message: error.message };
    }
    console.error("Unexpected Error:", error);
    return { message: "An unexpected error occurred" };
};

// Exporting API functions
const Http = { get, post, fileUpload };
export default Http;
