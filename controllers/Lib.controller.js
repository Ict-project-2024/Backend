// libraryController.js
import { logEntry, logExit, getTrafficStatus } from "../utils/common.js";

export const enterLibrary = async (req, res, next) => {
  const { teNumber, phoneNumber } = req.body;
  await logEntry(teNumber, phoneNumber, next);
};

export const exitLibrary = async (req, res, next) => {
  const { teNumber } = req.body;
  await logExit(teNumber, next);
};

export const viewTrafficStatus = async (req, res, next) => {
  await getTrafficStatus(next);
};
