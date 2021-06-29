const express = require('express');
const User =  require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const user = require('../models/user');
const jwt = require('jsonwebtoken');
router.post('/signup', (req, res, next)=>{
  bcrypt.hash(req.body.password, 10).then(hash=>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save().then(result =>{
      let user = result;
      console.log(user);
      delete user.password;
      console.log('---------------------');
      console.log(user);
      res.status(201).json({
        message:'user created',
        result: user
      });
    }).catch(err=>{
      res.status(500).json({
        message:'user not created',
        error:err
      })
    })
  })
})

router.post('/login',(req, res, next)=>{
  let fetchedUser;
  User.findOne({email: req.body.email}).then(user=>{
    console.log(user);
    if(!user) {
      return res.status(401).json({
        message: "email doesn't exist"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result=>{
    if(!result) {
      return res.status(401).json({
        message: "Authentication Failed"
      });
    }
    const token = jwt.sign({email:fetchedUser.email, userId: fetchedUser._id}, 'gxfcvhbjmlkjhfchgmvb,jkgjkftxjcgh,jgghfdjrxckvj,kgfkcjkg.iyygkfvjgbuhkluihjghjgkgtyxrsyirkdflbgu;fdsrytcuviuhy[8t786dotcgjhvjbkhiuiyodtyfhcg',
    {expiresIn: '1h'}
    );
    res.status(200).json({
      token: token
    })
  }).catch(err =>{
    return res.status(401).json({
      message: "Authentication Failed"
    });
  });
});

module.exports = router;
