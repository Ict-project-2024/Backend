import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; // Assuming app.js contains the main Express app
import { reportCanteenStatus, getCanteenStatus } from '../services/canteenService';
import { updateUserVotesAndBadges } from '../services/userService';

jest.mock('../services/canteenService');
jest.mock('../services/userService');

describe('Canteen Status Routes', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/canteen/reportStatus', () => {
        it('should report canteen status successfully', async () => {
            reportCanteenStatus.mockResolvedValueOnce();
            updateUserVotesAndBadges.mockResolvedValueOnce();

            const res = await request(app)
                .post('/api/canteen/reportStatus')
                .send({
                    userId: '64b73e89f6d2a2b11c000a12',
                    canteen: 'Main Canteen',
                    peopleRange: '20-30'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Canteen status reported successfully');
        });

        it('should return 500 if an error occurs during reporting', async () => {
            reportCanteenStatus.mockRejectedValueOnce(new Error('Reporting error'));

            const res = await request(app)
                .post('/api/canteen/reportStatus')
                .send({
                    userId: '64b73e89f6d2a2b11c000a12',
                    canteen: 'Main Canteen',
                    peopleRange: '20-30'
                });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Reporting error');
        });
    });

    describe('GET /api/canteen/viewStatus', () => {
        it('should retrieve canteen status successfully', async () => {
            const mockStatus = {
                location: 'Main Canteen',
                peopleRange: '20-30'
            };

            getCanteenStatus.mockResolvedValueOnce(mockStatus);

            const res = await request(app)
                .get('/api/canteen/viewStatus')
                .send({ location: 'Main Canteen' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Canteen status retrieved successfully');
            expect(res.body.data).toEqual(mockStatus);
        });

        it('should return 500 if an error occurs during retrieval', async () => {
            getCanteenStatus.mockRejectedValueOnce(new Error('Retrieval error'));

            const res = await request(app)
                .get('/api/canteen/viewStatus')
                .send({ location: 'Main Canteen' });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Retrieval error');
        });
    });
});
