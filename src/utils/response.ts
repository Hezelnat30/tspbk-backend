import { Response } from "express";
import { HTTP_STATUS } from "./constant";
import * as yup from "yup";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

type Pagination = {
  totalPages: number;
  current: number;
  totalData: number;
};

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
    console.error("Error details:", error);

    if (error instanceof yup.ValidationError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        meta: {
          statusCode: HTTP_STATUS.BAD_REQUEST,
          message: `Validation Error: ${error.path} - ${error.message}`,
        },
        data: null,
      });
    }

    if (error instanceof mongoose.Error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        meta: {
          statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          message: message || "Database Error",
        },
        data: error.name,
      });
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      meta: {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: message || "An unexpected error occurred",
      },
      data: process.env.NODE_ENV === "development" ? error : null,
    });
  },

  UNAUTHORIZED(res: Response, error?: any, message: string = "Unauthorized") {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        meta: {
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          message: "Token expired, please signin again.",
        },
        data: null,
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        meta: {
          statusCode: HTTP_STATUS.UNAUTHORIZED,
          message: "Invalid token, please signin again.",
        },
        data: null,
      });
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      meta: {
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message,
      },
      data: null,
    });
  },
  PAGINATION(
    res: Response,
    data: any[],
    pagination: Pagination,
    message: string
  ) {
    return res.status(200).json({
      success: true,
      meta: {
        statusCode: 200,
        message,
      },
      data,
      pagination,
    });
  },
};
