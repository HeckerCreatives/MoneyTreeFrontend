import axios, { AxiosError } from "axios";
import { NextRouter } from "next/router";
import toast from "react-hot-toast";

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string; data: string }>;

    if (axiosError.response) {
      const { status, data } = axiosError.response;

      switch (status) {
        case 401:
          window.location.replace('/');
          toast.error(data.data);
          break;

        case 400:
          toast.error(data.data);
          break;

        case 402:
          toast.error(data.data);
          break;

        case 403:
          toast.error(data.data);
          break;

        case 404:
          toast.error(data.data);
          break;

        default:
          toast.error(data.data);
          break;
      }
    } else {
      toast.error("Network error. Please try again.");
    }
  } else {
    toast.error("An unexpected error occurred.");
  }
};
