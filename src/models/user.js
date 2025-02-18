const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: "LoremIpsum", required: true },
    bio: { type: String, default: "LoremIpsum", required: true },
    social: [
      {
        app_name: { type: String, default: "LoremIpsum", required: true },
        link: {
          type: String,
          default: "https://LoremIpsum.com",
          required: true,
        },
      },
    ],
    contact: { type: String, default: "Lorem Ipsum", required: true },
    image: {
      type: String,
      default: "https://placehold.co/400",
      required: true,
    },
    cv: {
      url: { type: String },
      download: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
