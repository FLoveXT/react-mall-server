// 引入
const mongoose = require('mongoose')
//连接指定数据库
mongoose.connect('mongodb://localhost:27017/cart',{useNewUrlParser:true})
//获取连接对象
const conn = mongoose.connection
//监听
conn.on('connected',function(){
  console.log('database connected')
})

//创建对应的model
// 1. 创建存储banner的schema
const bannerSchema = mongoose.Schema({
  url:{type:String,require:true}
})
//定义model
const bannerModel= mongoose.model('banner',bannerSchema)
//暴露出去
exports.bannerModel = bannerModel

//2.创建存储产品种类的typeSchema
const typeSchema = mongoose.Schema({
  productType:{type:String,require:true}
})
const typeModel = mongoose.model('type',typeSchema)

exports.typeModel = typeModel


//创建存储产品详情的pInfoSchema
const pInfoSchema = mongoose.Schema({
  productType:{type:String,require:true},//产品属于哪个种类
  title:{type:String,require:true},//产品标题
  content:{type:String,require:true},//产品内容
  sell_price:{type:Number,require:true},//产品销售价
  market_price:{type:Number,require:true},//产品市场价
  selled_quantity:{type:Number,require:true}//产品销售
})
const pInfoModel = mongoose.model('info',pInfoSchema)
exports.pInfoModel = pInfoModel

//创建存储用户信息的userSchema
const userSchema = mongoose.Schema({
  username:{type:String,require:true},
  password:{type:String,require:true},
  mycart:{type:Array,required:true}
})

const userModel = mongoose.model('user',userSchema)
exports.userModel = userModel

//创建用户评论的commentSchema
const commentSchema = mongoose.Schema({
  id:{type:String,require:true},//用户id
  username:{type:String,require:true},
  create_time:{type:Number,require:true},
  comment:{type:String,require:true}
})

const commentModel = mongoose.model('comment',commentSchema)
exports.commentModel= commentModel

// //创建我的购物车的mycartSchema
// const mycartSchema= mongoose.Schema({
//   id:{type:String,require:true},//用户id
//   mycart:{type:Array,required:true}
// })
// const mycartModel = mongoose.model('mycart',mycartSchema)
// exports.mycartModel = mycartModel