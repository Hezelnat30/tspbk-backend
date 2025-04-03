import { Request, Response } from "express";
import { IPaginationQuery, IReqUser, Song } from "../utils/interface";
import { addSongSchema, updateSongSchema } from "../utils/schema";
import SongModel from "../models/song.model";
import response from "../utils/response";
import { FilterQuery } from "mongoose";

export default {
  async addSong(req: IReqUser, res: Response) {
    try {
      const { artist, title, youtubeUrl, chordImageUrl } =
        req.body as unknown as Song;
      await addSongSchema.validate({
        artist,
        title,
        youtubeUrl,
        chordImageUrl,
      });

      const existSong = await SongModel.findOne({
        title,
      });

      if (existSong) return response.ERROR(res, null, "Song already exists");

      const result = await SongModel.create({
        artist,
        title,
        youtubeUrl,
        chordImageUrl,
      });

      return response.SUCCESS(res, 201, result, "Song added successfully");
    } catch (error) {
      response.ERROR(res, error, "Failed to add song");
    }
  },
  async updateSong(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      await updateSongSchema.validate(req.body);
      const result = await SongModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return response.SUCCESS(res, 200, result, "Song updated successfully");
    } catch (error) {
      return response.ERROR(res, error, "Failed to update song");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<Song> = {};

      if (search) {
        Object.assign(query, {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { artist: { $regex: search, $options: "i" } },
          ],
        });
      }

      const currentPage = Number(page);
      const result = await SongModel.find(query)
        .limit(limit)
        .skip((currentPage - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const totalDoc = await SongModel.countDocuments(query);

      if (totalDoc === 0)
        return response.PAGINATION(
          res,
          result,
          {
            current: Number(page),
            totalPages: Math.ceil(totalDoc / limit),
            totalData: totalDoc,
          },
          "No song found"
        );

      return response.PAGINATION(
        res,
        result,
        {
          current: currentPage,
          totalPages: Math.ceil(totalDoc / limit),
          totalData: totalDoc,
        },
        "Success to find all song"
      );
    } catch (error) {
      return response.ERROR(res, error, "Failed to find all song");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      const result = await SongModel.findById(id);

      if (!result) return response.ERROR(res, null, "Song not found");

      return response.SUCCESS(res, 200, result, "Success to find a song");
    } catch (error) {
      return response.ERROR(res, error, "Failed to find a song");
    }
  },
  async deleteSong(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      const existSong = await SongModel.findById(id);

      if (!existSong) return response.ERROR(res, null, "Song not found");

      const result = await SongModel.findByIdAndDelete(id);

      return response.SUCCESS(res, 200, result, "Song deleted successfully");
    } catch (error) {
      return response.ERROR(res, error, "Failed to delete song");
    }
  },
  async getSongsByWorshipLeader(req: IReqUser, res: Response) {},
};
