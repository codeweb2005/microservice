import deviceModel from "../models/deviceModel.js";

// all device list
const listDevice = async (req, res) => {
    try {
        const devices = await deviceModel.find({})
        res.json({ success: true, data: devices })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// add device
const addDevice = async (req, res) => {
    try {
        const device = new deviceModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image,
        })

        await device.save();
        res.json({ success: true, message: "Device Added" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// delete device
const removeDevice = async (req, res) => {
    try {
        await deviceModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Device Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { listDevice, addDevice, removeDevice }