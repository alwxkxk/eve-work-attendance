# 弃用
此考勤系统从考勤官录视频人工记录，转变成由玩家自行上报。这种设计反而不好，反一个人的工作量分摊成多个人的工作量，所以弃用。

更好的解决方案是，解析视频提取文字进行提取记录。
## 数据库 文档结构字段说明
- start_attendance: 记录发起集结的信息（commander:指挥官，uniCode:联盟编码，time:发起时间,attendanceId：集结ID,result:考勤结果（按团统计数量），status:状态（1:进行中，2:已确认））
- append_attendance:记录玩家填写的信息（warship:舰船种类，legion:军团编码，playerName:玩家名,attendanceId：集结ID,imgFileName:文件名,status:状态（1：进行中，2：已确认，3：被拒绝））


## 页面路径
```bash
#发起集结考勤
/start-attendance

#填写考勤
/append-attendance/attendanceId/{attendanceId}

#具体考勤的报告
/attendance-report/attendanceId/{attendanceId}

#个人考勤记录
/person-attendance-list

#集结考勤记录列表
/attendance-list
```

## 后续优化
- 补损功能
- 导出excel表

## 其它
移动端UI库 [weui](https://github.com/Tencent/weui)
上传的文件在uploads文件夹里
服务器端口：23245
需要参考`config-demo.js` 配置`config.js`才能运行。

## 报错
[/whatwg-url/lib/encoding.js:2 const utf8Encoder = new TextEncoder();](https://stackoverflow.com/questions/69187442/const-utf8encoder-new-textencoder-in-node-js/69187990#69187990)