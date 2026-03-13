import app from "./app.js";

const PORT = process.env.PORT || 1000;

app.listen(PORT, ()=>{
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
});