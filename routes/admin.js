var express = require('express');
var router = express.Router();
const adminHelper = require("../adminheper/admin_Help")
const userControls = require("../adminheper/userControl")
const prodControls = require("../adminheper/adminprod")
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('admin/adminlog')
});


router.post('/adlogin', (req, res) => {

    let admindata = req.body
    adminHelper.logadmin(admindata, (result) => {
        try {
            if (result) {
                //res.render('admin/adminhome', { name: result })
                res.render('admin/adhometwo2.hbs', { name: result })
                console.Console(result)
            } else {
                res.render('admin/adminErr')
                console.log(result)
            }
        } catch (error) {
            console.log(error)
        }
    })

})

router.get("/allusers", async (req, res) => {
    await userControls.allUsers().then((emails) => {
        if (emails) {
            res.render('admin/allusers', { emails })
            console.log("reached")
        } else {
            console.log('no data')
        }
    })
})

router.get("/maleStaff", async (req, res) => {
    await userControls.maleStaff().then((data) => {
        if (data) {
            console.log(data)
            res.render('admin/maleStaff', { data })
        }
    })
})

router.get("/femailStaff", async (req, res) => {
    await userControls.femailStaff().then((data) => {
        if (data) {
            console.log(data)
            res.render('admin/femaleStaff', { data })
        }

    })
})

router.get("/prod", (req, res) => {
    res.render('admin/addproducts')
})

router.post("/additem", (req, res) => {
    console.log(req.body)
    console.log(req.files.image)
    let image = req.files.image
    prodControls.addproduct(req.body).then((id) => {
        try {
            if (id) {
                image.mv('./public/images/' + id + '.jpg', (err) => {
                    if (!err) {
                        console.log('image added')
                    } else {
                        console.log(err)
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
})

router.get("/list", (req, res) => {
    prodControls.getproducts().then((products) => {
        try {
            if (products) {
                console.log('view', products)
                res.render("admin/products", { products })
            }
        } catch (error) {
            console.log(error)
        }
    })
})

router.get("/delet/:id", (req, res) => {
    try {
        let proid = req.params.id
        prodControls.deletproduct(proid).then((result) => {
            if (result) {
                res.redirect("admin/products")
            } else {
                console.log('not value returned')
            }
        })
    } catch (error) {
        console.log(error)
    }

})

router.get('/Edit/:id', (req, res) => {
    let proId = req.params.id
    prodControls.getproduct(proId).then((data) => {
        res.render("admin/editlist", { data })
    })
})


router.post('/update/:id', (req, res) => {
    try {
        let proId = req.params.id
        let proDetal = req.body
        prodControls.updataproduct(proId, proDetal).then((data) => {
            if (data) {
                res.render("admin/products")
            }
        })
    } catch (error) {
        console.log(error)
    }

})

router.get("/userDelet/:id", (req, res) => {
    let userId = req.params.id
    console.log(userId)
    userControls.userDelet(userId).then((data) => {
        try {
            if (data) {
                res.json({ status:true})
                console.log('edited', data)
                res.redirect('/admin/allusers')
            } else {
                console.log('no data reached return')
            }
        } catch (error) {
            console.log(error)
        }
    })
})

router.get('/userEdit/:id', (req, res) => {
    let userId = req.params.id
    userControls.userEdit(userId).then((data) => {
        if (data) {
            console.log(data)
            res.render('admin/edituser', { data })
        } else {
            console.log('no data')
        }
    })
})

router.post('/edituser/:id', (req, res) => {
    try {
        let userData = req.body
        let userId = req.params.id
        console.log(userData, userId)
        if (userData) {
            console.log('1', userData)
        }
        userControls.updateUser(userId, userData).then((data) => {
            if (data) {
                
                res.redirect('/admin/allusers')
            } else {
                console.log("no user updated data reached")
            }
        })
    } catch (error) {
        console.log(error)
    }
})

router.get("/block/:id", (req, res) => {
    try {
        const userId = req.params.id
        userControls.blockUser(userId).then((data) => {
            console.log(data)
        })
    } catch (error) {
        console.log(error)
    }
})

router.get("/unblock/:id", (req, res) => {
    try {
        const userId = req.params.id
        userControls.unblockUsers(userId).then((data) => {
            console.log(data)
            if (data) {
                res.redirect('/admin/maleStaff')
            }
        })
    } catch (error) {

    }
})

router.post("/index", (req, res) => {
    try {
        const index = req.body.index
        //   const indexs =  index.toString()
        console.log(index)
        console.log(typeof (index))
        userControls.searchIndex(index).then((data) => {
            if (data) {
                const datas = data[0].email
                res.render('admin/allusers', {datas})
            }
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/serviceForm',(req,res)=>{
    res.render('admin/servicesAdd')
})

router.post("/addservice", (req, res) => {
    try {
      const servData = req.body
      const servImg = req.files.image
      prodControls.addServices(servData).then((_id) => {
        if (_id) {
          servImg.mv("./public/serviceImg/" + _id + '.jpg')
          res.render("admin/servicesAdd")
        }
      })
    } catch (error) {
      console.log(error)
    }
  })


  router.get('/pod',(req,res)=>{
    try {
        res.render('admin/podAdd')
    } catch (error) {
        console.log('link not get')
    }
  })


router.post('/addpod',(req,res)=>{
    try {
        const podName =  req.body.podName
        console.log(podName)
        const podImg = req.files.image
        console.log(podImg)
        prodControls.getpods(req.body).then((_id)=>{
           if(_id){
            podImg.mv("./public/podImg/"+ _id + '.jpg')
           }
           res.render('admin/podAdd')
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
