import cloudinary from "../config/cloudinary.config.js";

const deleteFromCloudinary = async (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};

export default deleteFromCloudinary;
