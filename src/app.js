const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route");
const cookieParser = require("cookie-parser");
const passport = require('./config/passport');
const songRoutes = require("./routes/song.route");
const searchRoutes = require("./routes/search.route");
const playlistRoutes = require("./routes/playlist.route");
const genreRoutes = require("./routes/genre.route");
const userRoutes = require("./routes/user.route");
const reportRoutes = require("./routes/report.route");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/report", reportRoutes);

module.exports = app;
