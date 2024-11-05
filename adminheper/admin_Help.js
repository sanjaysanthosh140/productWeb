const db = require('../config/config.js')
module.exports = {
    logadmin: async (admindata, cb) => {
        try {

            const dbname = db.get()
            if (dbname) {
                
                let Admin = await dbname.collection('adminLog').findOne({ email: admindata.email })
                if (Admin) {
                    if (Admin.password == admindata.password && Admin.email == admindata.email) {
                        // cb({status:true })
                        cb(Admin.email)
                    } else {
                        cb({ status: false })
                    }

                } else {
                    console.log('not found email')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }




    
}