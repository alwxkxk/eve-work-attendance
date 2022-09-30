
## 页面
1. 发起集结出勤统计（只做移动端）：联盟名，指挥官名，集结时间。然后生成玩家填写出勤页面的URL，带唯一ID，指挥官名，集结时间。
2. 玩家填写出勤页面（只做移动端）：名称、军团、上传图片（会被定时删除）、舰船类型。右下角可跳转查看统计。
3. 结束集结统计页面（只做移动端）：各种图表，报表，拒绝不合理的信息后，结束统计。
4. 各种报表统计（只做PC端）：个人视角（查看个人出勤情况）、军团视角（各玩家出勤次数）、联盟视角（各军团出勤人数）。




## 后续优化
- 补损功能
- 导出excel表

## 数据库 文档结构字段说明
- start_attendance: 记录发起集结的信息（commander:指挥官，uniCode:联盟编码，time:发起时间,attendanceId：集结ID,result:考勤结果（按团统计数量），status:状态（1:进行中，2:已确认））
- append_attendance:记录玩家填写的信息（warship:舰船种类，legion:军团编码，playerName:玩家名,attendanceId：集结ID,imgFileName:文件名,status:状态（1：进行中，2：已确认，3：被拒绝））

## 其它
移动端UI库 [weui](https://github.com/Tencent/weui)
上传的文件在uploads文件夹里
服务器端口：23245
需要参考`config-demo.js` 配置`config.js`才能运行。