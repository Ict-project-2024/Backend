import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; // Main Express app
import { verifyStudent, logEntry, logExit } from '../services/mcService';
import McStatus from '../models/McStatus';

jest.mock('../services/mcService');

describe('Medical Center Status Routes', () => {

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await McStatus.deleteMany({});
    });

    describe('POST /api/mc/enter', () => {
        it('should log an entry and increase occupancy', async () => {
            verifyStudent.mockResolvedValueOnce();
            logEntry.mockResolvedValueOnce();

            const res = await request(app)
                .post('/api/mc/enter')
                .send({
                    teNumber: 'TE1234',
                    phoneNumber: '0771234567'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Entry logged successfully');

            const status = await McStatus.findOne({ date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' }) });
            expect(status).not.toBeNull();
            expect(status.currentOccupancy).toBe(1);
            expect(status.entrances).toBe(1);
        });

        it('should return 500 if an error occurs during entry logging', async () => {
            verifyStudent.mockRejectedValueOnce(new Error('Verification error'));

            const res = await request(app)
                .post('/api/mc/enter')
                .send({
                    teNumber: 'TE1234',
                    phoneNumber: '0771234567'
                });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Verification error');
        });
    });

    describe('POST /api/mc/exit', () => {
        it('should log an exit and decrease occupancy', async () => {
            logExit.mockResolvedValueOnce();

            const initialStatus = new McStatus({
                currentOccupancy: 1,
                entrances: 1,
                date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' })
            });
            await initialStatus.save();

            const res = await request(app)
                .post('/api/mc/exit')
                .send({
                    teNumber: 'TE1234'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Exit logged successfully');

            const status = await McStatus.findOne({ date: new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Colombo' }) });
            expect(status).not.toBeNull();
            expect(status.currentOccupancy).toBe(0);
        });

        it('should return 204 if no medical center status exists for today', async () => {
            logExit.mockResolvedValueOnce();

            const res = await request(app)
                .post('/api/mc/exit')
                .send({
                    teNumber: 'TE1234'
                });

            expect(res.statusCode).toBe(204);
            expect(res.body.message).toBe('No medical center status found for today');
        });

        it('should return 500 if an error occurs during exit logging', async () => {
            logExit.mockRejectedValueOnce(new Error('Exit logging error'));

            const res = await request(app)
                .post('/api/mc/exit')
                .send({
                    teNumber: 'TE1234'
                });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Exit logging error');
        });
    });
});
