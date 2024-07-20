import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username!"],
      trim: true,
      unique: true,
      minlength: [4, `Username should be atleast 4 characters!`],
      maxlength: [40, `Please enter username less than 40 characters!`],
    },
    email: {
      type: String,
      required: [true, "Please enter a email!"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please enter a password!"],
      minlength: [8, `Password must be atleast 8 characters long!`],
      maxlength: [100, `Password must be less than 100 characters long!`],
      validate: {
        validator: function (value) {
          const regExp = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).{8,}$/;
          return regExp.test(value);
        },
        message:
          "Password should contain atleast one number and special character!",
      },
      select: false,
    },
    passwordConfirm: {
      type: String,
      trim: true,
      minlength: [8, `Confirm Password must be atleast 8 characters long!`],
      select: false,
    },

    profileImg: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "Role can be either admin (or) user",
      },
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Hashing Passwords before saving into the database.
userSchema.pre("save", async function (next) {
  try {
    // If password is not modified then skip hashing again
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);

    // we dont want to include passwordConfirm field in database whenever we save or update the document.
    // so at initial creation of user we dont want passwordConfirm field to be included in document and also when the password is changed, then also we dont want to include passwordConfirm field in document.
    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    console.log(
      `userSchema pre('save') hashing passwords middleware error: `,
      err?.message
    );
  }
});

// Checking whether passwordChangedAt property exists.
userSchema.pre("save", function (next) {
  /*
  -> here we are using this.isNew bcz if we only check whether password is modified (or) not then there will be problem.
  -> problem is that when we create new user and when we save that user document then password is changed. so this condition fails (!this.isModified('password')) and we set passwordChangedAt property.
  -> but we should only set passwordChangedAt property when password is updated after creating it. so that is the reason we also include this.isNew which checks if document is new or not.
  -> if document is not new and if password is updated then only we set passwordChangedAt property.
*/
  try {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
  } catch (err) {
    console.log(
      `userSchema pre('save') passwordChangedAt middleware error: `,
      err?.message
    );
  }
});

// Creating JSON web token which can be useful when user logs in.
userSchema.methods.getJWTToken = function () {
  try {
    return jwt.sign(
      { id: this._id, username: this.username, role: this.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_SECRET_EXPIRES,
      }
    );
  } catch (err) {
    console.log("getJWTToken method error: ", err?.message);
  }
};

// Generating Refresh token.
userSchema.methods.getRefreshToken = function () {
  try {
    return jwt.sign(
      { id: this._id, username: this.username, role: this.role },
      process.env.REFRESH_SECRET,
      {
        expiresIn: process.env.REFRESH_SECRET_EXPIRES,
      }
    );
  } catch (err) {
    console.log("getRefreshToken method error: ", err?.message);
  }
};

// Checking the password.
userSchema.methods.checkPassword = async function (
  enteredPassword,
  storedPassword
) {
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (err) {
    console.log("checkPassword method error: ", err?.message);
  }
};

// Generating random reset token.
userSchema.methods.createPasswordResetToken = function () {
  try {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.passwordResetTokenExpires =
      Date.now() + process.env.RESET_TOKEN_EXPIRES * 60 * 1000;

    return resetToken;
  } catch (err) {
    console.log("createPasswordResetToken method error: ", err?.message);
  }

  /*
     -> Here we may get doubt that why are we encrypting the resetToken and storing in db instead of directly storing the resetToken in db.
     -> so the reason is, first we are sending normal resetToken in a mail link and if we also store the normal resetToken in db without encrypting it, then if a hacker gets access to database then he can access the plain resetToken and use it to change your password in middle of your resetToken expiry 10min.
     -> so to ignore that we are encrypting and storing the resetToken in db. 
     -> now we may get doubt that with encrypted resetToken can hacker do something?
     -> answer is 'No' bcz for hacker inorder to change password he needs the normal token also. he has encrypted token as he hacked the database.
     -> but he also need to have the normal resetToken so that he can compare both normal resetToken and encrypted resetToken and change password. but as he cant get normal resetToken he cant change password. 
  */
};

// Checking if password was changed after the jwt was issued to the user.
userSchema.methods.checkPasswordChangedAfterJWTIssued = function (
  JWTTimeStamp
) {
  try {
    // only check if password is changed, if passwordChangedAt property exists.
    if (this.passwordChangedAt) {
      const passwordChangedTime = parseInt(
        this.passwordChangedAt.getTime() / 1000
      );

      // if JWT is issued before password is changed then only we return true.
      return JWTTimeStamp < passwordChangedTime;
    }

    // we are handling this return false case bcz when we create new user then passwordChangedAt is undefined. so thats why we are handling using return false. it means that password is not updated yet.
    return false;
  } catch (err) {
    console.log(
      "checkPasswordChangedAfterJWTIssued method error: ",
      err?.message
    );
  }
};

export const User = mongoose.model("User", userSchema);
