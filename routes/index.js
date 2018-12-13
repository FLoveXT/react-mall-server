var express = require('express');
var router = express.Router();
const md5 = require('blueimp-md5')

//过滤
const filter = { password: 0, __v: 0 }
//引入model
const { bannerModel, typeModel, pInfoModel, userModel,commentModel } = require('../models/models')

/* GET banner page. */
router.get('/getbanner', function (req, res, next) {
  bannerModel.find((err, banner) => {
    if (err) {
      return res.send({ code: 1, msg: '出现错误' })
    }
    return res.send({ code: 0, data: banner })
  })
});

/* GET producttype page. */
router.get('/gettype', function (req, res) {
  typeModel.find((err, types) => {
    if (err) {
      return res.send({ code: 1, msg: '出现错误' })
    }
    return res.send({ code: 0, data: types })
  })
})

/* post 给定指定类别的 productinfo page. */
router.post('/getinfo', function (req, res) {
  const { productType } = req.body
  pInfoModel.find({ productType }, (err, pInfos) => {
    if (err) {
      return res.send({ code: 1, msg: '请求失败' })
    }
    return res.send({ code: 0, data: pInfos })
  })
})
/* GET 给定指定类别的 productinfo page. */
router.get('/getone', function (req, res) {
  console.log(req.params)
  console.log(req.query)
})

/* post 注册 page. */
router.post('/register', function (req, res) {
  const { username, password } = req.body
  userModel.findOne({ username }, (err, user) => {
    if (user) {
      return res.send({ code: 1, msg: '此用户存在' })
    } else {
      new userModel({ username, password: md5(password + 'Allen'),mycart:[] }).save((err, user) => {
        if (err) {
          console.log(err)
        }
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 10 })
        return res.send({ code: 0, data: {username,id:user._id,mycart:user.mycart} })
      })
    }
  })
})

/* post 登录 page. */
router.post('/login', function (req, res) {
  const { username, password } = req.body
  userModel.findOne({ username, password: md5(password + 'Allen') }, filter, (err, user) => {
    if (err) {
      console.log(err)
    } else if (!user) {
      return res.send({ code: 1, msg: '用户名或密码错误' })
    } else {
      res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 * 10 })
      return res.send({ code: 0, data: user })
    }
  })
})

/* 获取user 信息 page. */
router.get('/user', function (req, res) {
  //根据cookie获取userid
  const userid = req.cookies.userid
  if (!userid) {
    return res.send({ code: 1, msg: '请先登录' })
  }
  userModel.findOne({ _id: userid }, filter, (err, user) => {

    return res.send({ code: 0, data: user })
  })
})
/* 保存该用户的评论 */
router.post('/usercomment',function(req,res){
  const userid = req.cookies.userid
  const {comment,id} = req.body
  userModel.findById({_id:userid},(err,user)=>{
    const username = user.username
    const create_time = Date.now()
    new commentModel({id,username,comment,create_time}).save((err,usercomment)=>{
      if(err){
        return res.send({code:1,msg:'保存失败'})
      }
      return res.send({code:0,msg:'保存成功'})
    })
  })
}) 
/*获取所有用户的评论*/ 
router.post('/comments',function(req,res){
  const {id,n} = req.body
  const sort = {'create_time':-1}
  commentModel.find({id}).limit(5*n).sort(sort).exec((err,comments)=>{
    if(err){
      return res.send({code:1,msg:'提取失败'})
    }
    return res.send({code:0,data:comments})
  })
})

/*添加产品到我的购物车*/
router.post('/addcart',function(req,res){
  const id = req.cookies.userid
  const product = req.body
  userModel.find({_id:id},filter,(err,user)=>{
    const tempArr = user[0].mycart
    tempArr.unshift(product)
    userModel.findOneAndUpdate({_id:id},{mycart:tempArr},(err,user)=>{
      if(err){
        return res.send({code:1,msg:'加入失败'})
      }
      console.log(user)
      return res.send({code:0,msg:'加入成功'})
    })
  })
}) 
/* 从购物车删除指定的产品 */
router.post('/delcart',function(req,res){
  const id = req.cookies.userid
  const {productid} = req.body
  userModel.find({_id:id},filter,(err,user)=>{
    let tempArr = user[0].mycart
    tempArr = tempArr.filter(el=> el.productid !== productid)
    userModel.findOneAndUpdate({_id:id},{mycart:tempArr},(err,user)=>{
      if(err){
        return res.send({code:1,msg:'删除失败'})
      }
      return res.send({code:0,msg:'删除成功'})
    })
  })
}) 

module.exports = router; 
