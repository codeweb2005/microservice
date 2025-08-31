import express from 'express';
import { addDevice, listDevice, removeDevice } from '../controllers/deviceController.js';

const deviceRouter = express.Router();

deviceRouter.get("/list", listDevice);
deviceRouter.post("/add", addDevice);
deviceRouter.post("/remove", removeDevice);

export default deviceRouter;