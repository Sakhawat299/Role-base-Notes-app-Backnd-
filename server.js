require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes"); 
const noteRoutes = require("./routes/noteRoutes");  
const { logger } = require("./middleware/logger");

const app = express();
cors({
    origin: "http://localhost:3000", // Allow frontend URL
    credentials: true, // Allow cookies & authorization headers
  })


connectDB();


console.log(`Running in ${process.env.NODE_ENV} mode`);


app.use(express.json());
app.use(cors());
app.use(cookieParser());


if (process.env.NODE_ENV === "development") {  
    app.use(logger);
}


app.get("/", (req, res) => {
    res.send("Server is running...");
});


app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

console.log("Registered Routes:");
app._router.stack.forEach((middleware) => {
    if (middleware.route) { // If middleware is a route, print it
        console.log(middleware.route.methods, middleware.route.path);
    } else if (middleware.name === "router") { // If it's a router, print nested routes
        middleware.handle.stack.forEach((nestedRoute) => {
            if (nestedRoute.route) {
                console.log(nestedRoute.route.methods, nestedRoute.route.path);
            }
        });
    }
});


app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
