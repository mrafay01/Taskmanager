import { Schema, model, models, type InferSchemaType } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type Task = InferSchemaType<typeof taskSchema> & { _id: string };

export default models.Task || model("Task", taskSchema);
