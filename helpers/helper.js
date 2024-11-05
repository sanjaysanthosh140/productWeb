const db = require('../config/config')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { promises } = require('nodemailer/lib/xoauth2')
module.exports = {

    addUser: (userData) => {
        return new Promise(async (reslove, reject) => {
            const dbval = await db.get()
            if (!dbval) {
                console.log('db not connected properly')
            }
            try {
                let user = await dbval.collection('employesIn').findOne({ email: userData.email })
                if (!user) {
                    userData.password = await bcrypt.hash(userData.password, 10)
                    // reslove(userData.email)
                    await dbval.collection('employesIn').insertOne(userData).then((data) => {
                        if (data) {
                           const datas =  data.insertedId
                            reslove(datas)
                            console.log('data addes')
                        } else {
                            console.log('data not addes in db')
                        }
                    })
                } else {
                    console.log('user already exist')
                }
            } catch (error) {
                reject(error)
            }
        })
    },


    LogUsers: (userData) => {
        return new Promise(async (reslove, reject) => {
            const dbvals = db.get()
            if (dbvals) {
                try {
                    let userIn = await dbvals.collection('employesIn').findOne({ email: userData.email })
                    if (userIn) {
                        await bcrypt.compare(userData.password, userIn.password).then((data) => {
                            reslove(userIn._id)
                            console.log('log',userIn._id)
                            if (userIn) {
                                console.log('log',userIn._id)
                            } else {
                                // reslove({ status: false })
                            }
                        })
                    }

                } catch (error) {
                    console.log(error)
                    reject(error)
                }
            }
        })
    },

    tutores: () => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('employesIn').aggregate([
                    {
                        $group: {
                            _id: "$email",
                            period: {
                                $push: "$sub"

                            }
                        }
                    }]).toArray()
                    .then((data) => {
                        console.log('tutores', data)
                        resolve(data)
                    })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },


}


