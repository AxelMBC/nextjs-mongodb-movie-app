import mongoose, { Schema, models } from "mongoose";

const movieSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  ano: {
    type: Number,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  puntaje: {
    type: Number,
    required: true,
  },
  imagen: {
    type: String,
    required: true,
  },
});

export default models.Movie || mongoose.model("Movie", movieSchema);
