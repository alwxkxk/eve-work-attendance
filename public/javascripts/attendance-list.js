const resultList = document.querySelector('#resultList')
const getStatusName = (val)=>{
    let result = '待确认'
    switch (val) {
        case 2:
            result = '已确认'
            break;
        default:
            break;
    }
    return result
}
fetch(`/attendance-list/data`)
.then((response) => response.json())
.then(data=>{
    const dayObj = {} 
    data.forEach(i=>{
        const day = i.updatedTime.split('T')[0]

        if(!dayObj[day]){
            dayObj[day] = 1
        }else{
            dayObj[day] += 1
        }

        // 展示 列表
        const contain = document.createElement("div")
        contain.classList.add('card','w100');

        const row = document.createElement("div")
        row.classList.add('space-between');
        contain.appendChild(row)

        const attendanceId = document.createTextNode('集结ID：'+i.attendanceId);
        row.appendChild(attendanceId)

        const status = document.createElement("div")
        status.innerHTML = getStatusName(i.status)
        status.classList.add('tag','small-tag');
        row.appendChild(status)


        const commander = document.createElement("div")
        let total = null
        if(i.result && i.result.total){
            total = i.result.total
        }
        let text = `指挥：${i.commander}`
        if(total){
            text = `${text}(人数：${total})`
        }
        commander.innerHTML = text
        contain.appendChild(commander)

        const updatedTime = document.createElement('div');
        updatedTime.innerHTML = '时间：'+i.updatedTime.split('.')[0]
        contain.appendChild(updatedTime)

        const linkToReport = ()=>{
            window.open(`${window.location.origin}/attendance-report/attendanceId/${i.attendanceId}`)
        }

        resultList.addEventListener('mousedown',linkToReport)
        resultList.addEventListener('touchEnd',linkToReport)

        resultList.appendChild(contain)
    })


    // showEchart(dayObj)
    

})