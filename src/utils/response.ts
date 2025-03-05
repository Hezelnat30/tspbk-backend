import { Request, Response } from "express";
import mongoose from "mongoose";
import * as yup from "yup";
import { HTTP_STATUS } from "./interface";

export default {
  SUCCESS(
    res: Response,
    statusCode: number = HTTP_STATUS.OK,
    data: any,
    message: string
  ) {
    res.status(statusCode).json({
      success: true,
      meta: { statusCode, message },
      data,
    });
  },
  ERROR(res: Response, error: unknown, message: string) {
    if (error instanceof yup.ValidationError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        meta: {
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message,
        },
        data: `${error.path} - ${error.message}`,
      });
    }
    if (error instanceof mongoose.Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        meta: {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: message ?? error.message,
        },
        data: error.name,
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      meta: {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message,
      },
      data: error,
    });
  },
  UNAUTHORIZED(res: Response, message: string = "Unauthorized") {
    res.status(HTTP_STATUS.FORBIDDEN).json({
      success: false,
      meta: {
        statusCode: HTTP_STATUS.FORBIDDEN,
        message,
      },
      data: null,
    });
  },
};
