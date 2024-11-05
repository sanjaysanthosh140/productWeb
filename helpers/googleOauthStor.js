const e = require('express')
const db = require('../config/config')

module.exports = {
    Store: (userData) => {
        return new Promise(async (resolve, reject) => {
            try {      
                    const id = userData.id
                    let user = await db.get().collection('OAuthUsers').findOne({ id: id })
                    if (!user) {
                        await db.get().collection('OAuthUsers').insertOne(userData).then((result) => {
                            console.log('resut:', result)
                            resolve(userData)
                           if(reject){
                                   res.redirect('home')
                           }
                        })
                    } else {
                        console.log('user is already exist')
                    }
                
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }
}