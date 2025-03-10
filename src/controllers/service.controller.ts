import { Request, Response } from "express";
import response from "../utils/response";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import ServiceModel, { Service, TService } from "../models/service.model";
import { serviceDAO, updateServiceSchema } from "../utils/schema";
import WorshipLeaderModel from "../models/worshipLeader.model";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import SongModel from "../models/song.model";

export default {
  async addService(req: IReqUser, res: Response) {
    try {
      const payload = {
        ...req.body,
        musicDirector: req.user?.username,
      } as TService;
      const validate = await serviceDAO.validate(payload);
      const { date, worshipLeader, songList } = validate;

      const existService = await ServiceModel.findOne({ date });
      if (existService) {
        return response.ERROR(res, null, "Service already exists");
      }
      if (!mongoose.Types.ObjectId.isValid(worshipLeader)) {
        return response.ERROR(res, null, "Invalid worship leader ID format");
      }
      const worshipLeaderId = new mongoose.Types.ObjectId(worshipLeader);

      const existWorshipLeader = await WorshipLeaderModel.findById(
        worshipLeaderId
      );
      if (!existWorshipLeader) {
        return response.ERROR(res, null, "Worship leader not found");
      }

      if (
        !Array.isArray(songList) ||
        songList.length === 0 ||
        songList.some(
          (song) => !mongoose.Types.ObjectId.isValid(song!) || !song
        )
      ) {
        return response.ERROR(res, null, "Add at least one song");
      }

      const existSong = await SongModel.find({ _id: { $in: songList } });
      if (existSong.length !== songList.length) {
        return response.ERROR(
          res,
          null,
          "Some songs do not exist in the bank song"
        );
      }

      const result = await ServiceModel.create(payload);

      const serviceResponse = await ServiceModel.findById(result._id)
        .populate("worshipLeader", "name")
        .populate("songList", "-__v");

      return response.SUCCESS(
        res,
        201,
        serviceResponse,
        "Service added successfully"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to add service");
    }
  },
  async deleteService(req: IReqUser, res: Response) {
    try {
      const { id } = req.params as { id: string };

      const existService = await ServiceModel.findById(id);

      if (!existService) {
        return response.ERROR(res, null, "Service not found");
      }

      const result = await ServiceModel.findByIdAndDelete(id);

      return response.SUCCESS(res, 200, result, "Service deleted successfully");
    } catch (error) {
      return response.ERROR(res, error, "Failed to delete service");
    }
  },
  async updateService(req: IReqUser, res: Response) {
    try {
      const { id } = req.params as { id: string };

      await updateServiceSchema.validate(req.body);
      const existService = await ServiceModel.findById(id);
      if (!existService) {
        return response.ERROR(res, null, "Service not found");
      }

      const result = await ServiceModel.findByIdAndUpdate(id, req.body, {
        new: true,
      })
        .populate("worshipLeader", "-__v -joinDate -isActive")
        .populate("songList", "-__v");
      return response.SUCCESS(res, 200, result, "Service updated successfully");
    } catch (error) {
      return response.ERROR(res, error, "Failed to update service");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const currentPage = Number(page);
      const limitNum = Number(limit);

      let filterQuery: FilterQuery<Service> = {};

      if (search) {
        filterQuery = {
          $or: [
            { musicDirector: { $regex: search, $options: "i" } },
            { "worshipLeader.name": { $regex: search, $options: "i" } },
          ],
        };
      }
      const aggregatePipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "worshipleaders",
            localField: "worshipLeader",
            foreignField: "_id",
            as: "worshipLeader",
          },
        },
        {
          $unwind: {
            path: "$worshipLeader",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Step 3: Join Collections
        {
          $lookup: {
            from: "songs",
            localField: "songList",
            foreignField: "_id",
            as: "songList",
          },
        },
      ];

      if (search) {
        aggregatePipeline.push({ $match: filterQuery });
      }

      aggregatePipeline.push({
        $project: {
          "worshipLeader.__v": 0,
          "worshipLeader.joinDate": 0,
          "worshipLeader.isActive": 0,
          "songList.__v": 0,
        },
      });

      const countPipeline = [...aggregatePipeline];

      aggregatePipeline.push(
        { $sort: { createdAt: -1 } },
        { $skip: (currentPage - 1) * limitNum },
        { $limit: limitNum }
      );

      const result = await ServiceModel.aggregate(aggregatePipeline);

      const countResult = await ServiceModel.aggregate([
        ...countPipeline,
        { $count: "total" },
      ]);

      const totalDoc = countResult.length > 0 ? countResult[0].total : 0;

      return response.PAGINATION(
        res,
        result,
        {
          current: currentPage,
          totalData: totalDoc,
          totalPages: Math.ceil(totalDoc / limitNum),
        },
        totalDoc === 0 ? "No services found" : "Success to find all services"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to find all services");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { date } = req.body as unknown as { date: string };

      if (!date) return response.ERROR(res, null, "Date is required");

      const result = await ServiceModel.findOne({ date })
        .populate("worshipLeader", "-__v")
        .populate("songList", "-__v");

      if (!result) return response.ERROR(res, null, "Service not found");

      return response.SUCCESS(res, 200, result, "Success to find a service");
    } catch (error) {
      return response.ERROR(res, error, "Failed to find a service");
    }
  },
};
