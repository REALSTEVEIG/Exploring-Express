
const authMiddleware = (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.json({error : 'Please login'})
      }  

      next()
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = authMiddleware