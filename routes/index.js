var express = require('express');
var router = express.Router();

var products = require("../helpers/product.js")
let helpers = require('../helpers/helper.js');
const jwt = require('jsonwebtoken');
const verifyUser = require('../middleware/verifyrouts.js')
/* GET home page. */
const passport = require('passport')
const placeOrder = require('../helpers/placeOrder.js')
const Razorpay = require('razorpay');

// const verifyUser = (req, res, next) => {
// if (req.session.loggedIn) {
// next()
// } else {
// res.render('users/userformat')
// 
// }
// }


const maxAge = 3 * 24 * 60 * 60
const creatId = (id) => {
  console.log('() reach', id)
  return jwt.sign({ id }, 'sanjay secrit', {
    expiresIn: maxAge
  })
}

router.get('/', function (req, res, next) {
  res.render('users/userformat');
  // res.render('users/products');
});

router.post("/signing", function (req, res) {
  let userData = req.body

  if (userData) {
    try {
      helpers.addUser(userData).then((result) => {
        if (result) {
          // this.value = result
          // req.session.loggedIn = true
          // req.session.user = result.insertedId
          let id = result
          console.log('ID::',id)
          let token = creatId(id)
          res.cookie(
            'token', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
          })
          
          
          console.log("user_id", result.insertedId)
          console.log('result added:', result.email)
          console.log(result)
             

          products.getPodsData().then((data) => {
            console.log('data', data)
            res.render('home', { data })
          })
          
        }

      })
    } catch (error) {
      console.error('Error adding user:', error)
    }

  } else {
    console.log('userData not received')
  }
})

router.post("/login",  function (req, res) {
  let userData = req.body
  if (userData) {
    try {
      helpers.LogUsers(userData).then((result) => {
        console.log('logres', result)

        //if (result.status === true) {
        //  console.log('logres',result)
        //} else if (result) {
        //  res.render('users/userformat', { data: "user is blocked" })

        //  // req.session.loggedIn = true
        //  // req.session.user = result.user
        //}

        let tokens = creatId(result)
        res.cookie('token', tokens, {
          httpOnly: true,
          maxAge: maxAge * 1000

        })

        products.getPodsData().then((data) => {
          console.log('data*', data)
          res.render('home', { data })
        })
        console.log("find:", result.email)

      })

    } catch (error) {
      console.log('Error adding user:', error)
    }
  } else {
    console.log('userData not received')
  }
})

// user profilr root
router.get('/profile', (req, res) => {
  res.render('users/profile')

})

router.get('/google/auth', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/oauth/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log('oAth',req.body)
  
})


// get al products data

router.get('/products',(req, res) => {
  products.getProducts().then((products) => {
    try {
      if (products) {
        console.log(products)
        res.render('users/products', { products })
      }
    } catch (error) {
      console.log(error)
    }
  })
})

router.get('/tuttore', (req, res) => {
  try {
    helpers.tutores().then((data) => {
      if (data) {
        console.log(data)
        res.render('users/tuture', { data })

      }
    })
  } catch (error) {
    console.log(error)
  }
})


router.get("/Services", (req, res) => {

  try {
    products.getServicesData().then((data) => {
      if (data) {
        console.log(data)
        res.render("users/service", { data })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/addCart/:id', (req, res) => {
  try {
    // res.send('carts')
    let proId = req.params.id
    let usrId = req.cookies.token
    console.log(usrId)
    console.log(proId, usrId)
    products.addcart(proId, usrId).then((data) => {
      console.log('usrdecod', data)
      // res.render('users/cart')
    })

    products.getcartPro(usrId).then(async (data) => {
      console.log(data)
      let total = await products.totalPrice(usrId)
      let price = total[0].total
      res.render('users/cart', { data, price })

    })

  } catch (error) {
    console.log(error)
  }

})


router.get('/place-order', async (req, res) => {
  const userId = req.cookies.token
  console.log('r-req_encod', userId)
  await products.totalPrice(userId).then((data) => {
    console.log(data)
    let price = data[0].total
    console.log(price)
    const user = req.cookies.token
    console.log('**', user)
    if (user) {
      res.render('users/placeOrder', { price, user })
    }
  })
})

router.post('/product_quantity', async (req, res) => {
  try {
    console.log(req.body)
    await products.changeQuantity(req.body).then(async (data) => {
      const userId = req.cookies.token
      let total = await products.totalPrice(userId)
      let totals = total[0].total
      data.totals = totals
      if (data) {
        console.log(data)
        res.json(data)
        res.render('users/cart', { data })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.post('/placeOrder', async (req, res) => {
  try {
    console.log(req.body)
    console.log('req.body', req.body.userId)
    const userId = req.cookies.token
    let productsList = await products.getCartProductList(userId)
    let amount = await products.totalPrice(userId)
    let totalamount = amount[0].total
    console.log("data", productsList, totalamount)
    placeOrder.placeOrders(req.body, productsList, totalamount).then((orderId) => {
      if(req.body.paymentMethod==='cod'){
        res.json({ status: true })
      }else{
        console.log('orderId',orderId)
       placeOrder.generatRazorpay(orderId,totalamount).then((response)=>{
            console.log(response)
            res.json({status:false,response})
       })
      }
     
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/successfully', async(req, res) => {
  const userId = req.cookies.token
  let items = await products.getcartPro(userId)
  console.log('gg',items)
  res.render('users/successfully',{items})
})


router.post("/verifypayment",async(req,res)=>{
   console.log('reach',req.body['order[response][receipt]'])
   let orderId = req.body['order[response][receipt]']
  placeOrder.changeStatus(orderId).then((data)=>{
    if(data){
      res.json({msg:true})
    }
    
    })
     
})

router.post("/removeitem",(req,res)=>{
  console.log(req.body)
  const cartID = req.body.cartId
  const proId = req.body.productId
  products.removeItems(cartID,proId).then((data)=>{
    console.log(data)
    if(data){
      res.json({remove:true})
    }
  })

})

module.exports = router;
