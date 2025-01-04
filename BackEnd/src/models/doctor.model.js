import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  {
    timestamps: true,
    minimize: false, // used to save the empty fields in data base rather then removing them eg:slots_booked
  }
);

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// check if the password is correct
doctorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("Doctor", doctorSchema); // works well if the model is only defined and imported in one file throughout your application

// const docModel =
//   mongoose.model.doctor || mongoose.model("doctor", doctorSchema); // works well if the model is imported in multiple files
// export default docModel;
