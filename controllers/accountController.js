const getNextSequenceValue = require('../utilities/database/counter/getNextSequenceValue');
const messageClass = require('../utilities/messageClass/messageClass');
const jwtConfig = require('../config/jwt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
  const id = await getNextSequenceValue('userid', 23984);
  try {
    const { firstName, lastName, phoneNumber, password } = req.body;
    const user = new User({ firstName, lastName, phoneNumber, password, _id: id });
    await user.save();

    res.status(200).json(messageClass(false, null, 'ثبت نام با موفقیت انجام شد. میتوانید وارد شوید'));
  } catch (err) {
    res.status(200).json(messageClass(true, null, err.message));
  }
};

const signIn = async (req, res) => {
  const { phoneNumber, password } = req.query;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(200).json(messageClass(true, null, 'شماره موبایلی که وارد کرده‌اید، اشتباه است.'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json(messageClass(true, null, 'شماره موبایل یا پسورد اشتباه است.'));
    }

    const token = jwt.sign({ id: user.id }, jwtConfig.jwtToken);

    res.set('Authorization', `Bearer ${token}`);
    return res.status(200).json(messageClass(false, { firstName: user.firstName, lastName: user.lastName }, 'با موفقیت وارد شدید.'));
  } catch (error) {
    return res.status(200).json(messageClass(true, null, 'Server error'));
  }
}

module.exports = {
  signUp,
  signIn,
};
