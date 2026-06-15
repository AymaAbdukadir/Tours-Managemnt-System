const Review = require('./../models/reviewModel');
const AppError = require('./../utils/appError');

exports.setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllReviews = async (req, res, next) => {
    try {
        letfilter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const reviews = await Review.find(filter);

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createReview = async (req, res, next) => {
    try {
        const newReview = await Review.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                review: newReview
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return next(new AppError('No review found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!review) {
            return next(new AppError('No review found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                review
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new AppError('No review found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                review
            }
        });
    } catch (err) {
        next(err);
    }
};
