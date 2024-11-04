import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; // Assuming the main Express app is in app.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

describe('Auth Routes', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/auth/login', () => {
        let user;

        beforeAll(async () => {
            const hashedPassword = await bcrypt.hash('testpassword', 10);
            user = await User.create({
                email: 'testuser@example.com',
                password: hashedPassword,
                isVerified: true,
                roles: [{ role: 'user' }],
            });
        });

        afterAll(async () => {
            await User.deleteMany({});
        });

        it('should return 400 if email or password is missing', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: '' });
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Username and password are required');
        });

        it('should return 401 for an invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'wrongemail@example.com', password: 'testpassword' });
            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Invalid username or password');
        });

        it('should return 403 if email is not verified', async () => {
            await User.updateOne({ email: 'testuser@example.com' }, { isVerified: false });
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'testpassword' });
            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('Email not verified. Please check your email to verify your account.');
            await User.updateOne({ email: 'testuser@example.com' }, { isVerified: true });
        });

        it('should return 200 and set a cookie for valid login', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'testuser@example.com', password: 'testpassword' });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Login Success');
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('GET /api/auth/verifyEmail', () => {
        let user, token;

        beforeAll(async () => {
            token = jwt.sign({ email: 'verifyuser@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            user = await User.create({
                email: 'verifyuser@example.com',
                password: 'somepassword',
                isVerified: false,
                verificationToken: token,
                verificationTokenExpires: Date.now() + 3600000,
            });
        });

        afterAll(async () => {
            await User.deleteMany({});
        });

        it('should return 400 for invalid or expired token', async () => {
            const res = await request(app)
                .get('/api/auth/verifyEmail')
                .query({ token: 'invalidtoken' });
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('Invalid or expired token');
        });

        it('should return 200 if email is successfully verified', async () => {
            const res = await request(app)
                .get('/api/auth/verifyEmail')
                .query({ token });
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Email verified successfully!');
            
            const verifiedUser = await User.findById(user._id);
            expect(verifiedUser.isVerified).toBe(true);
            expect(verifiedUser.verificationToken).toBeUndefined();
        });
    });
});
