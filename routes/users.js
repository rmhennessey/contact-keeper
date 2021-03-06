const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [
    check('name', 'Please add name')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body // this works with the middleware in server.js

        try {
            let user = await User.findOne({ email: email });

            if (user) {
                return res.status(400).json({ msg: 'User already exists' })
            }

            // This creates a new instance of a user. User is not yet saved to database
            user = new User({
                name,
                email,
                password
            })

            // Before we save user to database, we have to hash the password
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt) // This gives us a hashed password assigned to user object


            // Now we can save to database
            await user.save();

            // Then we need to create and send back a token

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000 // don't need. usually use 3600 which equals one hour
            }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }
    }
)

module.exports = router