const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');

exports.getAllTours = async (req, res, next) => {
    try {
        // 1) Filtering
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Text Search (Title or Location)
        if (req.query.search) {
            queryObj.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { location: { $regex: req.query.search, $options: 'i' } },
                { summary: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // 2) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Tour.find(JSON.parse(queryStr));

        // 3) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // 4) Field Limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // 5) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit).populate({
            path: 'guidesAssigned',
            select: '-__v -passwordChangedAt'
        });

        // EXECUTE QUERY
        const tours = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getTour = async (req, res, next) => {
    console.log('--- getTour called ---');
    console.log('Params:', req.params);
    console.log('Type of next:', typeof next);

    try {
        const tour = await Tour.findById(req.params.id)
            .populate('reviews')
            .populate({
                path: 'guidesAssigned',
                select: '-__v -passwordChangedAt'
            });

        if (!tour) {
            console.log('No tour found with ID:', req.params.id);
            if (typeof next === 'function') {
                return next(new AppError('No tour found with that ID', 404));
            } else {
                return res.status(404).json({ status: 'fail', message: 'No tour found (and next is missing)' });
            }
        }

        console.log('Tour found successfully');
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        console.error('Error in getTour catch block:', err);
        if (typeof next === 'function') {
            return next(err);
        } else {
            // Fallback if next is somehow missing
            console.error('CRITICAL: next is not a function in catch block');
            return res.status(500).json({
                status: 'error',
                message: 'Internal Server Error (next missing)',
                originalError: err.message
            });
        }
    }
};

exports.createTour = async (req, res, next) => {
    try {
        if (req.file) req.body.imageCover = req.file.filename;
        const newTour = await Tour.create({
            ...req.body,
            createdBy: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateTour = async (req, res, next) => {
    try {
        if (req.file) req.body.imageCover = req.file.filename;
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!tour) {
            return next(new AppError('No tour found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteTour = async (req, res, next) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);

        if (!tour) {
            return next(new AppError('No tour found with that ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};

exports.getTourStats = async (req, res, next) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMonthlyPlan = async (req, res, next) => {
    try {
        const year = req.params.year * 1; // 2021

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$title' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        next(err);
    }
};
