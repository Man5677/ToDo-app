const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { getUser, setUser } = require('../services/auth');

async function handleCreateNewUser(req, res) {
    const salt = 10;
    try {
        const { name, email, password } = req.body;
        const userCheck = await User.findOne({ email: email });
        if (userCheck) {
            return res.redirect('/signup');
        }

        const hashPassword = await bcrypt.hash(password, salt);
        await User.create({
            name,
            email,
            password: hashPassword,
            role: "NORMAL"
        });
        return res.redirect('/login');
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error.message
        });
    }
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.redirect('/login');
    }

    const token = setUser(user);
    res.cookie('token', token);
    return res.redirect('/');
}

module.exports = {
    handleCreateNewUser,
    handleUserLogin
}