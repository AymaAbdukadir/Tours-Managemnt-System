const Booking = require('./../models/bookingModel');
const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');

exports.createBooking = async (req, res, next) => {
    try {
        const { tour, bookingDate } = req.body;

        // 1) Get the tour
        const tourDoc = await Tour.findById(tour);
        if (!tourDoc) {
            return next(new AppError('No tour found with that ID', 404));
        }

        // 2) Check if seats available
        if (tourDoc.availableSeats <= 0) {
            return next(new AppError('No seats available for this tour!', 400));
        }

        // 3) Create booking
        const booking = await Booking.create({
            tour,
            user: req.user.id,
            price: tourDoc.price,
            bookingDate
        });

        // 4) Update tour available seats
        tourDoc.availableSeats -= 1;
        await tourDoc.save();

        res.status(201).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateBookingStatus = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, paymentStatus: req.body.paymentStatus },
            {
                new: true,
                runValidators: true
            }
        );

        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return next(new AppError('No booking found with that ID', 404));
        }

        // Check if user owns this booking or is admin
        // Note: booking.user is populated, so we need to access _id or id
        const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();

        if (bookingUserId !== req.user.id && req.user.role !== 'admin') {
            return next(new AppError('You do not have permission to delete this booking', 403));
        }

        // Get tour and increment available seats
        const tour = await Tour.findById(booking.tour);
        if (tour) {
            tour.availableSeats += 1;
            await tour.save();
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};
