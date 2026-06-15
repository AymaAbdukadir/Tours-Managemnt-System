const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(authController.restrictTo('admin', 'lead-guide'), bookingController.getAllBookings)
    .post(authController.restrictTo('user'), bookingController.createBooking);

router.get('/my-bookings', bookingController.getMyBookings);

router.patch(
    '/:id/status',
    authController.restrictTo('admin', 'lead-guide'),
    bookingController.updateBookingStatus
);

router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
