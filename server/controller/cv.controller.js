import AsyncHandler from '../handler/AsyncHandler.js'
import Cv from '../model/cvModle.js'
import CustomError from '../handler/CustomError.js'
import User from '../model/user.model.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import deleteFromCloudinary from '../utils/deleteFromCloudinary.js';
import { ApiFeatures } from '../utils/apiFeatures.js';


const CreateCv = AsyncHandler(async (req, res, next) => {
    const userId = req.userId;

    const data = req.body;

    const user = await User.exists({ _id: userId });

    if (!user) throw new CustomError(404, 'User not found')

    let profileImage = null;

    if (req.file) {
        const result = await uploadToCloudinary({
            buffer: req.file.buffer,
            resource_type: "image",
            public_id: `profile_${userId}_${Date.now()}`
        });
        profileImage = { secure_url: result.secure_url, public_id: result.public_id };
    }

    const cv = await Cv.create({
        userId,
        ...data,
        profileImage
    })

    if (!cv) {
        throw new CustomError(500, 'Failed to create CV')
    }

    res.status(201).json({
        message: 'CV created successfully',
        data: cv
    })



})

const updateCv = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;


    const cv = await Cv.findById(id);

    if (!cv) {
        throw new CustomError(404, 'CV not found');
    }


    if (cv.userId.toString() !== userId.toString()) {
        throw new CustomError(403, 'Not authorized to update this CV');
    }


    const data = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== undefined && value !== null)
    );


    delete data.userId;
    delete data._id;


    if (req.file) {
        if (cv.profileImage && cv.profileImage.public_id) {
            await deleteFromCloudinary(cv.profileImage.public_id);
        }

        const result = await uploadToCloudinary({
            buffer: req.file.buffer,
            resource_type: "image",
            public_id: `profile_${userId}_${Date.now()}`
        });

        data.profileImage = {
            secure_url: result.secure_url,
            public_id: result.public_id
        };
    }


    Object.assign(cv, data);


    await cv.save();


    res.status(200).json({
        success: true,
        message: 'CV updated successfully',
        data: cv
    });
});

const getAllCvs = AsyncHandler(async (req, res, next) => {

    const userId = req.userId;

    // Only these fields can be used for filtering via query params
    const allowedFields = [
        "name",
        "email",
        "templateId",
        "label"
    ];

    const baseQuery = Cv.find({ userId });

    const features = new ApiFeatures(baseQuery, req.query, allowedFields)
        .filter()
        .search()
        .paginate();

    const cvs = await features.query;

    // Return empty array instead of 404 — user simply has no CVs yet
    res.status(200).json({
        success: true,
        message: cvs.length === 0 ? 'No CVs found' : 'CVs fetched successfully',
        data: cvs,
        result: cvs.length
    });

})

const SingleCv = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const findCv = await Cv.findById(id)

    if (!findCv) {
        throw new CustomError(404, "cv not found")
    }

    if (findCv.userId.toString() !== req.userId.toString()) {
        throw new CustomError(403, "Not authorized to view this CV")
    }

    res.status(200).json({
        success: true,
        message: 'CV fetched successfully',
        data: findCv
    })
})

const deleteCv = AsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    console.log(id)

    const findId = await Cv.findById(id)

    console.log(findId)

    if (!findId) {
        throw new CustomError(404, "Cv not found")
    }

    if (findId.userId.toString() !== req.userId.toString()) {
        throw new CustomError(403, "Not authorized to delete this CV")
    }

    await Cv.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: 'CV deleted successfully'
    })


})

export { CreateCv, updateCv, getAllCvs, SingleCv, deleteCv }