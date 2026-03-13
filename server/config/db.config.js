import mongoose from "mongoose";


async function connectDB() {

    try {
        const connectionInstance = await mongoose.connect(process.env.DB_URL)
        console.log(`DataBase is on host ${connectionInstance.connection.host} and the port is ${connectionInstance.connection.port}`)

    } catch (error) {
        console.log(`failed to connect to DB`)
        process.exit(1)
    }
}

export default connectDB;