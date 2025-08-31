import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true},
    image: { type: String, required: true },
    category:{ type:String, required:true}
})

const deviceModel = mongoose.models.device || mongoose.model("device", deviceSchema);
export default deviceModel;