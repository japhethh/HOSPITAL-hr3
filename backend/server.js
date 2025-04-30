require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");
const hrRoutes = require("./routes/hrRoutes");
const attendanceRoute = require("./routes/attendanceRoute");
const payrollRoutes = require("./routes/payrollRouter");

//Middlewares
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://hr3.nodadogenhospital.com",
  },
});

app.use(
  cors({
    origin: "https://hr3.nodadogenhospital.com",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`PATH: ${req.path} METHOD: ${req.method}`);
  next();
});
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/auth-api", authRoutes);
app.use("/accounts", accountRoutes);
app.use("/api", hrRoutes);
app.use("/api/attendance-face", attendanceRoute);
app.use("/api/payroll", payrollRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);

      io.on("connection", (socket) => {
        console.log(`Client Connected: ${socket.id}`);

        socket.on("disconnect", () => {
          console.log(`Client disconnected ${socket.id}`);
        });
      });
    });
  })

  .catch((err) => console.log(err));
