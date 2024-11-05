
const { use } = require("passport")
const db = require("../config/config.js")
const { ObjectId } = require("mongodb")
module.exports = {
    allUsers: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const users = await db.get().collection('employesIn').aggregate([
                    {
                        $group: {
                            _id: "$_id",
                            name: {
                                $push: "$email"
                            }
                        }
                    }
                ]).toArray()
                if (users) {
                    console.log(users)
                    resolve(users)
                }
            } catch (error) {
                reject(error)
            }
        })
    },
    maleStaff: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const maleStaff = await db.get().collection('employesIn').find({
                    Genter: "male"
                },
                    {
                        email: 1, Age: 1
                    })
                    .toArray()
                if (maleStaff) {
                    resolve(maleStaff)
                    console.log(maleStaff)
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    femailStaff: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const fmail = await db.get().collection('employesIn').find({
                    Genter: "femail"
                },
                    {
                        email: 1, Age: 1
                    })
                    .toArray()
                if (fmail) {
                    resolve(fmail)
                    console.log(fmail)
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    userDelet: (userId) => {

        return new Promise(async (resove, reject) => {
            try {
                if (!ObjectId.isValid(userId)) {
                    throw new Error('invalid id')
                    console.log(userId)
                }
                const result = await db.get().collection('employesIn').deleteOne({ _id: new ObjectId(userId) })
                if (result.deletCount === 0) {
                    resove(null)
                    console.log('no data')
                } else {
                    resove(result)
                }

            } catch (error) {
                reject(error)
            }
        })
    },

    userEdit: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await db.get().collection('employesIn').findOne({ _id: new ObjectId(userId) })
                if (result) {
                    resolve(result)
                } else {
                    console.log('result is not Get properly')
                }

            } catch (error) {
                reject(error)
            }
        })
    },

    updateUser: (userID, userData) => {
        console.log('doubt', userData)
        return new Promise(async (resolve, reject) => {
            try {
                let result = await db.get().collection('employesIn').updateOne({
                    _id: new ObjectId(userID)
                }, {
                    $set: {
                        email: userData.email,
                        sub: userData.sub,
                        Age: userData.Age,
                        Genter: userData.Genter
                    }
                })
                if (result) {
                    resolve(result)
                } else {
                    console.log('no data updated ')
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    blockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('employesIn').updateOne({
                    _id: new ObjectId(userId)
                }, {
                    $set: {
                        status: false
                    }
                }).then((data) => {
                    if (data) {
                        resolve(data)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    unblockUsers: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('employesIn').updateOne({
                    _id: new ObjectId(userId)
                }, {
                    $set: {
                        status: true
                    }
                }).then((data) => {
                    if (data) {
                        resolve(data)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    searchIndex: (index) => {
        return new Promise(async (resolve, reject) => {
            try {

                const result = await db.get().collection('employesIn').find({
                    email:index
                },{
                    email:1
                }).toArray()
                if (result) {
                    console.log("result",result)
                     resolve(result)
                }
            } catch (error) {
                reject(error)
            }
        })
    }
    // 
}