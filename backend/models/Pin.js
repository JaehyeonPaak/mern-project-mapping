const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true
        },
        userId: {
            type: String,
            require: true
        },
        title: {
            type: String,
            require: true,
            min: 3
        },
        description: {
            type: String,
            require: true,
            min: 3
        },
        rating: {
            type: Number,
            require: true,
            min: 0,
            max: 5
        },
        lat: {
            type: Number,
            require: true
        },
        long: {
            type: Number,
            require: true
        },
        color: {
            type: String, 
            require: false,
            min: 6
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Pin', PinSchema);