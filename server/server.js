const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded 
app.use(cookieParser());


// Models
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');

// Middlewares
const { auth } = require('./middlewares/auth'); 
const { admin } = require('./middlewares/admin'); 


// =============================
//            PRODUCTS
// =============================

// BY ARRIVAL
// /articles?sortBy=createdAt&order=desc&limit=4

// BY SELL
// /articles?sortBy=sold&order=desc&limit=100
app.get('/api/product/articles', (req, res) => {
  const oreder = req.query.order || 'asc';
  const sortBy = req.query.sortBy || '_id';
  const limit = parseInt(req.query.limit) || 100;

  console.log(`oreder: `, oreder);
  console.log(`sortBy: `, sortBy);

  Product.find()
    .populate('brand')
    .populate('wood')
    .sort([[sortBy, oreder]])
    .limit(limit)
    .exec((err, articles) => {
      if (err) return res.status(400).send(err);
      res.send(articles);
    })

});






// /api/product/articles_by_id?id=HSHSHSHS,JSJSJSJJSJSJ,SDSDSDSDDSD&type=(array or single)
app.get('/api/product/articles_by_id', (req, res) => {
  const type = req.query.type;
  let items = req.query.id;

  if (type === 'array') {
    const itemsList = items.split(',');
    items = itemsList.map((item) => mongoose.Types.ObjectId(item));
  }

  Product.
    find({ '_id' : {$in: items}}).
    populate('brand').
    populate('wood').
    exec((err, docs) => {
      return res.status(200).send(docs);
    })


})



app.post('/api/product/article', auth, admin, (req, res) => {
  const product = new Product(req.body);

  product.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, article: doc })
  });
})

// =============================
//            WOOD
// =============================

app.post('/api/product/wood', auth, admin, (req, res) => {
  const wood = new Wood(req.body);
  
  wood.save((err, woodDoc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      brand: woodDoc
    });
  });
});


app.get('/api/product/woods', (req, res) => {
  Wood.find({}, (err, woods) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(woods);
  })
})




// =============================
//            PRODUCTS
// =============================

app.post('/api/product/brand', auth, admin, (req, res) => {
  const brand = new Brand(req.body);
  
  brand.save((err, brandDoc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      brand: brandDoc
    });
  });
});


app.get('/api/product/brands', (req, res) => {
  Brand.find({}, (err, brands) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(brands);
  })
})



// =============================
//            USER
// =============================

app.get('/api/users/auth', auth, (req, res) => {
  res.status(200).json({
    isAdmin: req.user.role === 0 ? true : false,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    cart: req.user.cart,
    history: req.user.history
  });
});



app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({  success: true });
  });

});



app.post('/api/users/login', (req, res) => {

   User.findOne({ email: req.body.email}, (err, user) => {
    if (!user) return res.json({loginSuccess: false, message: 'Auth failed, user not found!'});

    user.comparePassword(req.body.password, (_, isMath) => {
      if (!isMath) return res.json({loginSuccess: false, message: 'Password wrong'});
      
      user.generateToken((err, userDoc) => {
        if (err) return res.status(400).send(err);  
        return res
          .cookie('w_auth', userDoc.token)
          .status(200)
          .json({ loginSuccess: true, user: userDoc})
      });
    });
      
   });
});



app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id}, { token: '' }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.json({ success: true })
    }
  )
});



const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(` Server Running on port ${port}`);
});