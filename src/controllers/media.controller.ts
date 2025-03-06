import { Response } from "express";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import uploader from "../utils/uploader";

export default {
  async single(req: IReqUser, res: Response) {
    try {
      const { file } = req;
      if (!file) return response.ERROR(res, null, "File is not exist");
      const result = await uploader.uploadSingle(file);
      return response.SUCCESS(res, 200, result, "File uploaded successfully");
    } catch (error) {
      return response.ERROR(res, error, "Failed to upload file");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      return response.SUCCESS(res, 200, result, "File removed successfully");
    } catch (error) {
      return response.ERROR(res, error, "Failed to remove file");
    }
  },
};
