const User = require('../models/users')
const passport = require('passport')
//Logging
const logger = require('../logger/logger')

exports.register = async (req, res) => {
    try {
        const user = await User.register(new User(
            {username : req.body.username, email : req.body.email}),
            req.body.password)

        logger.info(user)
        return res
          .status(201)
          .json({Message : `Welcome ${req.body.username}!`, user})
    } catch (error) {
       console.log(error)
       return res
          .json({error : error.message}) 
    }
}

exports.login = async (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Incorrect email or password'
          });
        }
        user.hash = undefined
        user.salt = undefined

        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.json({
            success: true,
            message: 'Successfully logged in as ' + req.user.username,
            user : user
          });
        });
      })(req, res, next);
}

exports.logout = (req, res) => {
    try {
        req.session.destroy()
        res.clearCookie('session-id')
        res.json({message : 'Logged out successfully!'})
    } catch (error) {
        console.log(error)
        res.json({error : error.message})
    }
}