const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next(
                new AppError(
                    'This route is not for password updates. Please use /updateMyPassword.',
                    400
                )
            );
        }

        // 2) Filtered out unwanted fields names that are not allowed to be updated
        const filteredBody = {};
        const allowedFields = ['name', 'email'];
        Object.keys(req.body).forEach(el => {
            if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
        });

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        // next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        // next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new AppError('No user found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    //
     }
};
