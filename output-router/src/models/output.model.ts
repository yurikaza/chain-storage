import { Schema, model } from "mongoose";
import { ObjectId } from "mongodb";

interface IOutput {
  id: ObjectId;
  filehash: string;
  filename: string;
  publickey: string;
}

const outputSchema = new Schema<IOutput>({
  id: { type: ObjectId },
  filehash: { type: String, required: true },
  filename: { type: String, required: true },
  publickey: { type: String, required: true },
});

const Output = model<IOutput>("Output", outputSchema);

export default Output;
