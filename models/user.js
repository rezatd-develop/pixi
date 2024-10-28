const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'پر کردن شماره تماس اجباری است.'],
    unique: [true, 'شماره تماس در دیتابیس موجود است. لطفا از قسمت ورود، لاگین کنید.'],
    trim: true,
    validate: {
      validator: function (v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: props => `${props.value} فرمت شماره تماس صحیح نیست.!`
    }
  },
  password: {
    type: String,
    required: [true, 'رمز اجباری است.'],
    minlength: [8, 'رمز باید حداقل ۸ کاراکتر داشته باشد.'],
    validate: {
      validator: function (v) {
        // Ensure password contains at least one number, one letter, and one special character
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'پسورد باید شامل اعداد، ارقام و کارکتر های خاص مثل @ خاص باشد.'
    }
  }
}, { timestamps: true });

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
