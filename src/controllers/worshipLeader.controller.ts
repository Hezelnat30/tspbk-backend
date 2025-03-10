import { Response } from "express";
import { IPaginationQuery, IReqUser, WorshipLeader } from "../utils/interface";
import response from "../utils/response";
import {
  addWorshipLeaderSchema,
  updateWorshipLeaderSchema,
} from "../utils/schema";
import WorshipLeaderModel from "../models/worshipLeader.model";
import { FilterQuery } from "mongoose";

export default {
  async addWorshipLeader(req: IReqUser, res: Response) {
    try {
      const { name, gender, joinDate, imageUrl } =
        req.body as unknown as WorshipLeader;
      await addWorshipLeaderSchema.validate({
        name,
        gender,
        joinDate,
        imageUrl,
      });

      const result = await WorshipLeaderModel.create({
        name,
        gender,
        joinDate,
        imageUrl,
      });

      return response.SUCCESS(
        res,
        201,
        result,
        "Worship leader added successfully"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to add worship leader");
    }
  },
  async updateWorshipLeader(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      await updateWorshipLeaderSchema.validate(req.body);
      const existWorshipLeader = await WorshipLeaderModel.findById(id);
      if (!existWorshipLeader) {
        return response.ERROR(res, null, "Worship leader not found");
      }

      const result = await WorshipLeaderModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      return response.SUCCESS(
        res,
        200,
        result,
        "Worship leader updated successfully"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to update worship leader");
    }
  },
  async deleteWorshipLeader(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const existWorshipLeader = await WorshipLeaderModel.findById(id);
      if (!existWorshipLeader) {
        return response.ERROR(res, null, "Worship leader not found");
      }

      const result = await WorshipLeaderModel.findByIdAndDelete(id);

      return response.SUCCESS(
        res,
        200,
        null,
        "Worship leader deleted successfully"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to delete worship leader");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
        gender,
      } = req.query as unknown as IPaginationQuery & {
        gender?: string;
      };

      const query: FilterQuery<WorshipLeader> = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      if (gender) {
        query.gender = gender;
      }

      const result = await WorshipLeaderModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const totalDoc = await WorshipLeaderModel.countDocuments(query);
      const currentPage = Number(page);

      return response.PAGINATION(
        res,
        result,
        {
          totalPages: Math.ceil(totalDoc / limit),
          current: currentPage,
          totalData: totalDoc,
        },
        `${
          totalDoc === 0
            ? "Worship leaders not found"
            : "Success to find all worship leaders"
        }`
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to find all worship leaders");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const result = await WorshipLeaderModel.findById(id);

      if (!result) return response.ERROR(res, null, "Worship leader not found");

      return response.SUCCESS(
        res,
        200,
        result,
        "Success to find a worship leader"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to find worship leader");
    }
  },
};
