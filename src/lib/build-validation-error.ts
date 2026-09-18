import axios from "axios";
import { UseFormSetError } from "react-hook-form";

export default function buildValidationError(error: any, setError: UseFormSetError<any>) {
    if (axios.isAxiosError(error)) {
        Object.keys(error.response?.data.errors).map((key) => {
            setError(key, { message: error.response?.data.errors[key], type: 'manual' })
        });
    } else {
        console.error(error);
    }
}