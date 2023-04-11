const mongoose = require("mongoose")
const DB_URL = process.env.DB_URL


const connectDatabase = () => {
    mongoose.connect(DB_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
    .then((data) => {
        console.log(`Mongodb connected with HOST : ${data.connection.host}`)
    })
}

module.exports = connectDatabase