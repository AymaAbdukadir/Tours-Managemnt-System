const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    price: {
        type: Number,
        require: [true, 'Booking must have a price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    bookingDate: {
        type: Date,
        required: [true, 'Booking must have a date.']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    }
});

// Populate middleware
// Populate middleware
bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'title price imageCover location duration'
    });
    // Fix for next is not a function in newer mongoose
    if (typeof next === 'function') next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
