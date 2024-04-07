import type { NextApiResponse } from "next";
import { ApiResponseType } from "@/lib/types";

export const apiResponse = ({ success, message, result }: ApiResponseType) => {
  return {
    success,
    message,
    result,
  };
};

export const errorHandler = (error: any) => {
  return apiResponse({
    success: false,
    message: error?.message ?? "Something went wrong!",
    result: null,
  });
};

export const successHandler = (result: any, message: string) => {
  return apiResponse({
    success: true,
    message,
    result,
  });
};

export const handleInvalidRoute = (res: NextApiResponse) => {
  return res.status(404).end("Route Not Found!");
};

export const handleApiRouteError = (res: NextApiResponse, error: any) => {
  return res.status(500).json(errorHandler(error));
};

export const handleApiAuthError = (res: NextApiResponse) => {
  const error = new Error("Unauthorized Access!");
  return res.status(401).json(errorHandler(error));
};

export const handleApiClientError = (res: NextApiResponse) => {
  const error = new Error("Wrong Parameters Provided!");
  return res.status(400).json(errorHandler(error));
};
