const app = require("./app.js")
//config
const dotenv = require("dotenv")
dotenv.config({path : "./config/config.env"})
const connectDatabase = require("./config/database.js")
const PORT = process.env.PORT || 5050

//HANDLING UNCAUGHT ERROR
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`)
    console.log(`shutting down the sever due to Uncaught Error`)

    server.close(() => {
        process.exit(1)
    })
})


connectDatabase()

const server = app.listen(PORT, () => console.log(`The server is running on PORT ${PORT}`))



//HADNLING UNHANDLED REJECTION
process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`)
    console.log(`shutting down the sever due to unhandled promise rejection`)

    server.close(() => {
        process.exit(1)
    })
})