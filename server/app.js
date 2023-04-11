const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

const errorMiddleware = require("./middleware/error")

const productRoutes = require("./routes/productRoutes.js")
const userRoutes = require("./routes/userRoutes.js")
const orderRoutes = require("./routes/orderRoutes.js")

app.use(express.json())
app.use(cookieParser())
app.use("/api", productRoutes)
app.use("/api", userRoutes)
app.use("/api", orderRoutes)

app.use(errorMiddleware)



module.exports = app