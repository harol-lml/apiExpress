import { createApp } from "./index.js";
import { FilmModel } from "./models/mysql/film.js";

createApp({filmModel: FilmModel})