import mongoose from "mongoose";
import { Song } from "../utils/interface";

const Schema = mongoose.Schema;

const SongSchema = new Schema<Song>({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  youtubeUrl: {
    type: String,
    required: true,
    unique: true,
  },
  chordImageUrl: {
    type: String,
    required: true,
  },
});

const SongModel = mongoose.model("Song", SongSchema);
export default SongModel;
