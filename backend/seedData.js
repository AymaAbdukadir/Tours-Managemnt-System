const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Tour = require('./models/tourModel');
const Booking = require('./models/bookingModel');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.DATABASE || 'mongodb://localhost:27017/natours';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('DB Connected for seeding...');

        // Clear existing data & indexes
        try {
            await User.collection.drop();
        } catch (e) { console.log('User collection not found or already dropped'); }

        try {
            await Tour.collection.drop();
        } catch (e) { console.log('Tour collection not found or already dropped'); }

        try {
            await Booking.collection.drop();
        } catch (e) { console.log('Booking collection not found or already dropped'); }

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@tours.com',
            password: 'password123',
            passwordConfirm: 'password123',
            role: 'admin'
        });

        // Create Lead Guides
        const leadGuides = await User.create([
            {
                name: 'John Doe',
                email: 'john@tours.com',
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'lead-guide',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
            },
            {
                name: 'Alice Smith',
                email: 'alice@tours.com',
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'lead-guide',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
            }
        ]);

        // Create Guides
        const guides = await User.create([
            {
                name: 'Bob Wilson',
                email: 'bob@tours.com',
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'guide',
                photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
            },
            {
                name: 'Sarah Connor',
                email: 'sarah@tours.com',
                password: 'password123',
                passwordConfirm: 'password123',
                role: 'guide',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
            }
        ]);

        // Create Sample Users
        const customers = await User.create([
            { name: 'Ali Ahmed', email: 'ali@gmail.com', password: 'password123', passwordConfirm: 'password123', role: 'user', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
            { name: 'Fatima Omar', email: 'fatima@gmail.com', password: 'password123', passwordConfirm: 'password123', role: 'user', photo: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&w=400&q=80' },
            { name: 'Hassan Ali', email: 'hassan@gmail.com', password: 'password123', passwordConfirm: 'password123', role: 'user', photo: 'https://images.unsplash.com/photo-1542156822-6924d1a71ace?auto=format&fit=crop&w=400&q=80' }
        ]);

        // Create 12 Premium Tours
        const tours = [
            {
                title: 'The Forest Hiker',
                duration: 5,
                maxGroupSize: 25,
                availableSeats: 20,
                difficulty: 'easy',
                price: 397,
                summary: 'Breathtaking hike through the Canadian Rockies',
                description: 'Exhilarating 5-day hike through the Canadian Rockies. You will see amazing wildlife, glaciers, and waterfalls.',
                imageCover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
                location: 'Banff, Canada',
                startLocation: {
                    coordinates: [-115.5708, 51.1784],
                    address: 'Banff National Park, Alberta',
                    description: 'Banff Base Camp'
                },
                locations: [
                    { coordinates: [-115.5708, 51.1784], description: 'Banff National Park', day: 1 },
                    { coordinates: [-116.1773, 51.4254], description: 'Lake Louise', day: 3 },
                    { coordinates: [-117.6333, 52.3333], description: 'Columbia Icefield', day: 5 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[0]._id, guides[0]._id]
            },
            {
                title: 'The Sea Explorer',
                duration: 7,
                maxGroupSize: 15,
                availableSeats: 12,
                difficulty: 'medium',
                price: 497,
                summary: 'Exploring the hidden gems of the Mediterranean',
                description: 'Spend 7 days sailing the crystal clear waters of the Mediterranean. Visit private islands and enjoy local gourmet seafood.',
                imageCover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
                location: 'Amalfi Coast, Italy',
                startLocation: {
                    coordinates: [14.6027, 40.6333],
                    address: 'Amalfi Harbor',
                    description: 'Amalfi Coast Start'
                },
                locations: [
                    { coordinates: [14.6027, 40.6333], description: 'Amalfi', day: 1 },
                    { coordinates: [14.4849, 40.6281], description: 'Positano', day: 3 },
                    { coordinates: [14.2488, 40.5512], description: 'Capri', day: 5 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[1]._id]
            },
            {
                title: 'The Snow Adventurer',
                duration: 4,
                maxGroupSize: 10,
                availableSeats: 8,
                difficulty: 'difficult',
                price: 997,
                summary: 'Conquer the peaks of the Swiss Alps',
                description: 'A challenging 4-day mountaineering experience for advanced hikers. Professional gear and training included.',
                imageCover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
                location: 'Zermatt, Switzerland',
                startLocation: {
                    coordinates: [7.7491, 46.0207],
                    address: 'Zermatt Village',
                    description: 'Alps Base Camp'
                },
                locations: [
                    { coordinates: [7.7491, 46.0207], description: 'Zermatt', day: 1 },
                    { coordinates: [7.6586, 45.9763], description: 'Matterhorn Peak', day: 3 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[0]._id]
            },
            {
                title: 'The City Wanderer',
                duration: 3,
                maxGroupSize: 20,
                availableSeats: 18,
                difficulty: 'easy',
                price: 297,
                summary: 'Experience the magic of Tokyo at night',
                description: 'A vibrant 3-day exploration of Tokyo\'s most iconic neighborhoods, from modern skyscrapers to ancient temples.',
                imageCover: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
                location: 'Tokyo, Japan',
                startLocation: {
                    coordinates: [139.6503, 35.6762],
                    address: 'Shinjuku Center',
                    description: 'Tokyo Hub'
                },
                locations: [
                    { coordinates: [139.6503, 35.6762], description: 'Shinjuku', day: 1 },
                    { coordinates: [139.7967, 35.7148], description: 'Asakusa', day: 2 },
                    { coordinates: [139.7000, 35.6580], description: 'Shibuya', day: 3 }
                ],
                createdBy: admin._id,
                guidesAssigned: [guides[1]._id]
            },
            {
                title: 'The Desert Raider',
                duration: 6,
                maxGroupSize: 12,
                availableSeats: 10,
                difficulty: 'medium',
                price: 597,
                summary: 'Sunset camel treks and desert camping',
                description: 'Immerse yourself in the Sahara for 6 days. Sleep under the stars and discover ancient Berber traditions.',
                imageCover: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80',
                location: 'Merzouga, Morocco',
                startLocation: {
                    coordinates: [-4.0124, 31.0802],
                    address: 'Merzouga Village',
                    description: 'Sahara Entrance'
                },
                locations: [
                    { coordinates: [-4.0124, 31.0802], description: 'Merzouga', day: 1 },
                    { coordinates: [-3.9855, 31.1377], description: 'Erg Chebbi Dunes', day: 3 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[1]._id]
            },
            {
                title: 'The Northern Lights',
                duration: 5,
                maxGroupSize: 8,
                availableSeats: 6,
                difficulty: 'medium',
                price: 1297,
                summary: 'Hunt for the Aurora Borealis in Iceland',
                description: 'Chase the Northern Lights across Iceland\'s dramatic landscapes. Stay in luxury glass cabins for the best view.',
                imageCover: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=80',
                location: 'Reyjavik, Iceland',
                startLocation: {
                    coordinates: [-21.9424, 64.1466],
                    address: 'Reykjavik Center',
                    description: 'Icelandic Hub'
                },
                locations: [
                    { coordinates: [-21.9424, 64.1466], description: 'Reykjavik', day: 1 },
                    { coordinates: [-20.3000, 63.4333], description: 'Vik', day: 3 },
                    { coordinates: [-16.1833, 64.0500], description: 'Jökulsárlón Glacier', day: 5 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[0]._id]
            },
            {
                title: 'The Island Hopping',
                duration: 8,
                maxGroupSize: 15,
                availableSeats: 14,
                difficulty: 'easy',
                price: 797,
                summary: 'Blue domes and white sands of Greece',
                description: '8 days of luxury island hopping in the Cyclades. Explore Santorini, Mykonos, and Naxos in style.',
                imageCover: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
                location: 'Santorini, Greece',
                startLocation: {
                    coordinates: [25.4315, 36.3932],
                    address: 'Santorini Port',
                    description: 'Greek Gateway'
                },
                locations: [
                    { coordinates: [25.4315, 36.3932], description: 'Santorini', day: 1 },
                    { coordinates: [25.3289, 37.4467], description: 'Mykonos', day: 4 },
                    { coordinates: [25.3761, 37.1055], description: 'Naxos', day: 7 }
                ],
                createdBy: admin._id,
                guidesAssigned: [guides[0]._id]
            },
            {
                title: 'The Mountain Climber',
                duration: 10,
                maxGroupSize: 6,
                availableSeats: 4,
                difficulty: 'difficult',
                price: 1997,
                summary: 'Mount Everest Base Camp trek',
                description: 'The ultimate bucket list adventure. A 10-day trek to the base of the world\'s highest peak.',
                imageCover: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
                location: 'Solukhumbu, Nepal',
                startLocation: {
                    coordinates: [86.9250, 27.9881],
                    address: 'Lukla Airport',
                    description: 'Everest Entrance'
                },
                locations: [
                    { coordinates: [86.7231, 27.6841], description: 'Lukla', day: 1 },
                    { coordinates: [86.7111, 27.8069], description: 'Namche Bazaar', day: 3 },
                    { coordinates: [86.9250, 27.9881], description: 'Base Camp', day: 10 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[0]._id]
            },
            {
                title: 'The Wine Taster',
                duration: 3,
                maxGroupSize: 10,
                availableSeats: 9,
                difficulty: 'easy',
                price: 450,
                summary: 'Vineyard tours in the heart of Tuscany',
                description: 'Enjoy a relaxing 3-day tour through Italy\'s premier wine region. Private tastings and gourmet meals included.',
                imageCover: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
                location: 'Tuscany, Italy',
                startLocation: {
                    coordinates: [11.2462, 43.7711],
                    address: 'Florence Center',
                    description: 'Tuscany Hub'
                },
                locations: [
                    { coordinates: [11.2462, 43.7711], description: 'Florence', day: 1 },
                    { coordinates: [11.3308, 43.3182], description: 'Siena', day: 2 },
                    { coordinates: [10.3966, 43.7167], description: 'Pisa', day: 3 }
                ],
                createdBy: admin._id,
                guidesAssigned: [guides[1]._id]
            },
            {
                title: 'The Jungle Trekker',
                duration: 6,
                maxGroupSize: 12,
                availableSeats: 11,
                difficulty: 'medium',
                price: 550,
                summary: 'Ancient temples and lush rainforests',
                description: 'Discover the secrets of the Angkor Wat and the surrounding Cambodian jungle in this 6-day adventure.',
                imageCover: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=800&q=80',
                location: 'Siem Reap, Cambodia',
                startLocation: {
                    coordinates: [103.8670, 13.3633],
                    address: 'Siem Reap Center',
                    description: 'Jungle Base'
                },
                locations: [
                    { coordinates: [103.8670, 13.3633], description: 'Siem Reap', day: 1 },
                    { coordinates: [103.8670, 13.4125], description: 'Angkor Wat', day: 2 }
                ],
                createdBy: admin._id,
                guidesAssigned: [guides[0]._id]
            },
            {
                title: 'The Star Gazer',
                duration: 2,
                maxGroupSize: 20,
                availableSeats: 19,
                difficulty: 'easy',
                price: 197,
                summary: 'Astrophotography workshop in Atacama',
                description: 'Spend 2 nights in the world\'s driest desert, renowned for having the clearest skies on Earth.',
                imageCover: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80',
                location: 'Atacama, Chile',
                startLocation: {
                    coordinates: [-68.1994, -22.9087],
                    address: 'San Pedro de Atacama',
                    description: 'Desert Hub'
                },
                locations: [
                    { coordinates: [-68.1994, -22.9087], description: 'San Pedro', day: 1 },
                    { coordinates: [-68.2323, -23.0012], description: 'Stargazing Camp', day: 2 }
                ],
                createdBy: admin._id,
                guidesAssigned: [guides[1]._id]
            },
            {
                title: 'The Ancient Ruins',
                duration: 5,
                maxGroupSize: 15,
                availableSeats: 13,
                difficulty: 'medium',
                price: 650,
                summary: 'Machu Picchu and the Sacred Valley',
                description: 'A 5-day journey through the Incan Empire. Includes luxury train travel to Machu Picchu.',
                imageCover: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
                location: 'Cusco, Peru',
                startLocation: {
                    coordinates: [-71.9775, -13.5320],
                    address: 'Cusco Plaza',
                    description: 'Inca Gateway'
                },
                locations: [
                    { coordinates: [-71.9775, -13.5320], description: 'Cusco', day: 1 },
                    { coordinates: [-72.5450, -13.1631], description: 'Machu Picchu', day: 4 }
                ],
                createdBy: admin._id,
                guidesAssigned: [leadGuides[1]._id]
            }
        ];

        const createdTours = await Tour.create(tours);

        // Create Sample Bookings
        const bookings = [
            {
                tour: createdTours[0]._id,
                user: customers[0]._id,
                price: createdTours[0].price,
                bookingDate: new Date(),
                status: 'confirmed',
                paymentStatus: 'paid'
            },
            {
                tour: createdTours[1]._id,
                user: customers[1]._id,
                price: createdTours[1].price,
                bookingDate: new Date(),
                status: 'confirmed',
                paymentStatus: 'paid'
            },
            {
                tour: createdTours[5]._id,
                user: customers[2]._id,
                price: createdTours[5].price,
                bookingDate: new Date(),
                status: 'pending',
                paymentStatus: 'unpaid'
            },
            {
                tour: createdTours[7]._id,
                user: customers[0]._id,
                price: createdTours[7].price,
                bookingDate: new Date(),
                status: 'confirmed',
                paymentStatus: 'paid'
            },
            {
                tour: createdTours[3]._id,
                user: customers[1]._id,
                price: createdTours[3].price,
                bookingDate: new Date(),
                status: 'confirmed',
                paymentStatus: 'paid'
            }
        ];

        await Booking.create(bookings);

        console.log('Data Seeding Successful!');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedData();
