var express = require('express');
var router = express.Router();
const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
//引入model
const { bannerModel, typeModel,pInfoModel } = require('../models/models')
/* post banner */
router.post('/postbanner', function (req, res, next) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, '../public/images/banner')
  form.parse(req, (err, fields, files) => {
    // console.log(files)
    // console.log(files.pics.name)
    // console.log(files.pics.path)
    let newpath = path.join(__dirname, `../public/images/banner/${files.pics.name}`)
    fs.rename(files.pics.path, newpath, (err) => {
      if (err) {
        return res.send({ code: 1, msg: '上传失败' })
      }
      new bannerModel({ url: newpath }).save((err, banner) => {
        console.log(banner)
      })
      return res.send({ code: 0, msg: '上传成功' })
    })
  })
});

/* post type */
router.post('/posttype', function (req, res) {
  const { productType } = req.body
  console.log(req.body)
  typeModel.findOne({ productType }, (err, result) => {
    if (result) {
      return res.send({ code: 1, msg: '已经有了' })
    }  else {
      new typeModel({ productType }).save((err, pt) => {
        if (err) {
          return res.send({ code: 1, msg: '保存失败' })
        }
        return res.send({ code: 0, msg: '保存成功' })
      })
    }
  })
})

/* post info */
router.post('/postinfo',function(req,res){
const {type,title,content,sell_price,market_price,selled_quantity} = req.body
const productType = type.toString()
   new pInfoModel({productType,title,content,sell_price,market_price,selled_quantity}).save((err,info)=>{
    if (err) {
      return res.send({ code: 1, msg: '保存失败' })
    }
    return res.send({ code: 0, msg: '保存成功' })
   })
})

module.exports = router;
