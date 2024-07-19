import Student from "../models/User.js"
import AccessLog from "../models/LibAccesLog.js"
import LibraryStatus from "../models/LibStatus.js"
import { CreateError } from "../utils/error.js"
import { CreateSuccess } from "../utils/success.js"

export const enterLibrary = async (req, res, next) => {

    const teNumber = req.body.teNumber;
    const phoneNumber = req.body.phoneNumber;


    // Check if student exists
    let student = await Student.findOne({ TeNumber: teNumber });
    if (!student) {
        console.log(teNumber, phoneNumber);
        return next(CreateError(400, "No user found.. redirect to register page"));
    }

    // Log entry
    const accessLog = new AccessLog({ teNumber, phoneNumber });
    await accessLog.save();

    // Update library status
    let status = await LibraryStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    if (!status) {
        status = new LibraryStatus();
    }
    status.currentOccupancy += 1;
    await status.save();
    return next(CreateSuccess(200, "Entry logged successfully"));
};


export const exitLibrary = async (req, res, next) => {

    const teNumber = req.body.teNumber;

    // Log exit
    const accessLog = await AccessLog.findOne({ teNumber: teNumber , exitTime: null});
    if (!accessLog) {
        return next(CreateError(404, "No entry log found for this student"));
    }
    accessLog.exitTime = new Date();
    await accessLog.save();

    // Update library status
    let status = await LibraryStatus.findOne({ date: new Date().toISOString().slice(0, 10) });
    status.currentOccupancy -= 1;
    await status.save();

    return next(CreateSuccess(200, "Exit logged successfully"));
};


export const viewTrafficStatus = async (req, res, next) => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const status = await LibraryStatus.findOne({ date: currentDate });

    if (!status) {

        return next(CreateError(404, "No traffic data available for today"));

    }

    const dailyTraffic = await AccessLog.aggregate([
        { $match: { entryTime: { $gte: new Date(currentDate) } } },
        { $group: { _id: '$teNumber', count: { $sum: 1 } } },
    ]);


    return next(CreateSuccess(200, "Library trafic status", {
        currentOccupancy:
            status.currentOccupancy,
        dailyTraffic
    }));
};





