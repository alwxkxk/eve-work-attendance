var express = require('express');
const multer  = require('multer')
var path = require('path')
const db =require('../bin/db.js')
const config =require('../config.js')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const date = new Date()
    const name =`${date.getTime()}-${String(Math.round(Math.random() * 1000)).padStart(4,'0')}`
    cb(null, name + path.extname(file.originalname)) //Appending extension
  }
})

const upload = multer({ storage: storage })
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 发起出勤统计页面
router.get('/start-attendance', function(req, res, next) {
  res.render('start-attendance');
});

router.post('/start-attendance', upload.none(),function(req, res, next) {
  // 生成attendanceId，返回至页面生成链接
  const date = new Date()
  const attendanceId =`${date.getTime()}-${String(Math.round(Math.random() * 1000)).padStart(4,'0')}`
  db.insert('start_attendance',{...req.body,attendanceId:attendanceId,status:1})
  res.json({attendanceId:attendanceId});
});

// 玩家填写 出勤页面
router.get('/append-attendance/attendanceId/:attendanceId', function(req, res, next) {
  // 根据req.params.attendanceId，从数据库拿 发起信息填入
  const attendanceId = req.params.attendanceId
  db.findOne('start_attendance',{attendanceId:attendanceId}).then(val=>{
    // console.log('findOne',val)
    res.render('append-attendance',{
      uniCode:val.uniCode,
      time:val.time,
      commander:val.commander,
      status:val.status,
      attendanceId:val.attendanceId
    });
  })
});

// 玩家填写 出勤页面 提交数据
router.post('/append-attendance',upload.single('file'),async function(req, res, next) {
  //保存文件信息到数据库，然后返回时返回原来的
  
  const body = req.body
  db.findOne('start_attendance',{attendanceId:body.attendanceId}).then(val=>{
    if(val.status === 2){
      res.json({err:'该集结已结束'});
    }else{
      if(req.file){
        const fileName = req.file.filename
        const p1 = db.insert('img',{name:fileName,type:req.file.mimetype.split('/')[1]})
        const p2 = db.insert('append_attendance',{
          warship:body.warship,
          legion:body.legion,
          playerName:body.playerName,
          attendanceId:body.attendanceId,
          imgFileName:fileName
        })
        Promise.all([p1,p2]).then(()=>{
          res.json({msg:'操作成功'});
        })
      }else{
        const p2 = db.insert('append_attendance',{
          warship:body.warship,
          legion:body.legion,
          playerName:body.playerName,
          attendanceId:body.attendanceId,
        })
        Promise.all([p2]).then(()=>{
          res.json({msg:'操作成功'});
        })
      }


    }
  })

})




// 具体一次出勤的报表统计的页面
router.get('/attendance-report/attendanceId/:attendanceId', (req, res, next)=> {
  const attendanceId = req.params.attendanceId
  db.findOne('start_attendance',{attendanceId:attendanceId}).then(val=>{
    res.render('attendance-report',{
      status:val.status,
      uniCode:val.uniCode,
      commander:val.commander,
      time:val.time,
    });
  })
});

// 出勤数据列表
router.get('/attendance-report/list/attendanceId/:attendanceId', (req, res, next)=> {
  const attendanceId = req.params.attendanceId
  db.find('append_attendance',{attendanceId:attendanceId})
  .then(val=>val.sort({_id:-1}) .limit(50).toArray())
  .then(val=>{
    res.json(val);
  })
});

// 结束出勤统计，需要核对操作密码
router.post('/attendance-report',upload.none(), (req, res, next)=> {
  const body = req.body
  const pwdObj = config.pwd


  if(pwdObj[body.commander] && pwdObj[body.commander] === body.pwd){
    const rejectIdList = body.rejectIdList.split(',')
    let result = {
      total:0
    }
    db.find('append_attendance',{attendanceId:body.attendanceId}).then(cursor=>{
      cursor.forEach(i=>{
        const id = i._id.toString()
        console.log('id',id)
        // string 与 ObjectId() 是不一样的，需要转换，toString / ObjectId(id)
        if(rejectIdList.includes(id)){
          // 拒绝
          db.updateOne('append_attendance',{_id:i._id},{status:3})
        }else{

          if(!result[i.legion]){
            result[i.legion] = 1
          }else{
            result[i.legion] += 1
          }
          result.total += 1
          db.updateOne('append_attendance',{_id:i._id},{status:2})
        }

        
      }).then(()=>{
        // 将结果存入到result
        console.log('result',result)
        db.updateOne('start_attendance',{attendanceId:body.attendanceId},{status:2,result:result})
      })

    })

    
    res.json({msg:'操作成功'});
  }else{
    res.json({err:'指挥密码错误'});
  }
});

// 个人出勤查询页面
router.get('/person-attendance-list', (req, res, next)=> {
  res.render('person-attendance-list');
})

// 个人出勤查询接口
router.get('/person-attendance/:playerName', (req, res, next)=> {
  // console.log('playerName',req.params)
  db.find('append_attendance',{playerName:req.params.playerName})
    .then(val=>val.sort({_id:-1}) .limit(50).toArray())
    .then(val=>{
      res.json(val);
    })
})

// 出勤统计列表页面
router.get('/attendance-list', (req, res, next)=> {
  // console.log('playerName',req.params)
  res.render('attendance-list');
})

// 出勤统计列表页面的数据
router.get('/attendance-list/data', (req, res, next)=> {
  // console.log('playerName',req.params)
  db.find('start_attendance')
  .then(val=>val.sort({_id:-1}) .limit(50).toArray())
  .then(val=>{
    res.json(val);
  })
})


module.exports = router;
