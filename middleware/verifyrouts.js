const jwt = require('jsonwebtoken')
const db = require('../config/config.js')
const { ObjectId } = require('mongodb')

const verifyrout = async (req, res, next) => {
    try {
        const tocken = req.cookies.jwt
        jwt.verify(tocken, 'sanjay secrit', async (err, decodedTocken) => {
            if (err) {
                console.log(err)
                res.redirect('/')
            } else {
                console.log('decod', decodedTocken.id)
                let id = decodedTocken.id
                next()
            }
        })
    } catch (error) {
     console.log(err)
    }

}

module.exports = verifyrout