import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema({
  plannerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema) 