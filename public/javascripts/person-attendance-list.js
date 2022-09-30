const confirmBtn = document.querySelector('#confirmBtn')
const playerName = document.querySelector('#playerName')
const resultList = document.querySelector('#resultList')
playerName.value = localStorage.getItem('playerName');

function getDateString (date, dateSeparator = '-') {
    const dt = date
    return `${dt.getFullYear().toString().padStart(4, '0')}${dateSeparator}${(dt.getMonth() + 1).toString().padStart(2, '0')}${dateSeparator}${dt.getDate().toString().padStart(2, '0')}`
  }

function getDateAfterDay (dateStr, afterDay = 0) {
    // 24*60*60*1000 = 86400000
    const newDay = new Date(new Date(dateStr).getTime() + 86400000 * afterDay)
    return newDay
}

// echart图表
const showEchart=(result)=>{
    const chartDom = document.getElementById('echart');
    const myChart = echarts.init(chartDom);
    const dayTime = 3600 * 24 * 1000;
    const dateString = getDateString(new Date())
    // 看过去三个月的
    const lastDateString = getDateAfterDay(dateString, -90)
    const date = (new Date(dateString)).getTime()
    const end = (new Date(lastDateString)).getTime()
    const data = []

    Object.keys(result).forEach(key=>{
        data.push([key,result[key]])
    })

    const option = {
        title: {
          top: 30,
          left: 'center',
          text: 'Daily Step Count'
        },
        tooltip: {},
        visualMap: {
          min: 0,
          max: 6,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          splitNumber:3,
          top: 65
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: [date,end],
          itemStyle: {
            borderWidth: 0.5
          },
          yearLabel: { show: false }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: data
        }
      };
    myChart.setOption(option);
}




const getStatusName = (val)=>{
    let result = '待确认'
    switch (val) {
        case 2:
            result = '已确认'
            break;
        case 3:
            result = '被拒绝'
            break;
    
        default:
            break;
    }
    return result
}
const confirmHandle = ()=>{
    localStorage.setItem('playerName', playerName.value);
    resultList.innerHTML = ''
    fetch(`/person-attendance/${playerName.value}`)
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

                const warship = document.createElement("span")
                warship.innerHTML = `【${i.warship}】`
                warship.classList.add('right');
                contain.appendChild(warship)
                const updatedTime = document.createTextNode('时间：'+i.updatedTime.split('.')[0]);
                contain.appendChild(updatedTime)

                resultList.appendChild(contain)
            })


            showEchart(dayObj)
            

        })

}
confirmBtn.addEventListener('mousedown',confirmHandle)
confirmBtn.addEventListener('touchEnd',confirmHandle)