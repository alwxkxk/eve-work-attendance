
const attendanceId = window.location.href.split('/').pop()
const infoList = document.querySelector('#infoList')

// echart图表
const showEchart=(result)=>{
    const chartDom = document.getElementById('echart');
    const myChart = echarts.init(chartDom);
    const seriesData = []
    Object.keys(result).forEach(key=>{
        seriesData.push({ value: result[key], name: key })
    })
    const option = {
        label: {
            formatter: '{b}:{c}'
          },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: seriesData
          }
        ]
      };
    myChart.setOption(option);
}



// 图片展示 
const imagePreview = document.querySelector('#imagePreview')
const imagePreviewHandle= ()=>{
    imagePreview.style.display = 'none'
}

imagePreview.addEventListener('mousedown',imagePreviewHandle)
imagePreview.addEventListener('touchEnd',imagePreviewHandle)

const showImage = (fileName)=>{
    // console.log('查看图片',fileName)
    imagePreview.style.background =  `url('/${fileName}') center center / contain no-repeat rgba(0, 0, 0, 0.5)`
    imagePreview.style.display = 'block'
}
let attendanceList = []
// 拉数据
fetch(`/attendance-report/list/attendanceId/${attendanceId}`)
    .then((response) => response.json())
    .then(data=>{
        // console.log('数据：data',data)
        const result = {}
        attendanceList = data.filter((i)=>{
            // 被拒绝的不显示
            return i.status !== 3
        })
        .sort((a,b)=>{
            return a.legion.localeCompare(b.legion)
        })
        attendanceList.forEach((element,index) => {
            
            if(!result[element.legion]){
                result[element.legion] = 1
            }else{
                result[element.legion] += 1
            }

            // 展示 列表
            const contain = document.createElement("div")
            contain.classList.add('card');

            const number = document.createTextNode(index+1);
            contain.appendChild(number)

            const legion = document.createElement("span")
            legion.innerHTML = element.legion
            legion.classList.add('tag');
            contain.appendChild(legion)

            const warship = document.createElement("span")
            warship.innerHTML = `【${element.warship}】`
            warship.classList.add('right');
            contain.appendChild(warship)

            const playerName = document.createTextNode(element.playerName);
            contain.appendChild(playerName)
            contain.addEventListener('mousedown',()=>showImage(element.imgFileName))
            contain.addEventListener('touchEnd',()=>showImage(element.imgFileName))

            infoList.appendChild(contain)
        });
        showEchart(result)
        const resultList = document.querySelector('#resultList')
        Object.keys(result).forEach(key=>{
            const resultItem =document.createElement("div")
            resultItem.innerHTML = `${key}:${result[key]}`
            resultItem.classList.add('result-item','card');
            resultList.appendChild(resultItem)
        })  
        const totalNum = document.querySelector('#totalNum')
        totalNum.innerHTML = `总计:${attendanceList.length}人`
    })

// 结束统计
const confirmBtn = document.querySelector('#confirmBtn')
const confirmHandle = ()=>{
    const pwdInput = document.querySelector('#pwdInput')
    const rejectListInput = document.querySelector('#rejectListInput')
    const rejectIdList = []
    if(rejectListInput.value){
        rejectListInput.value.split(',').forEach(i=>{
            const index = Number(i)-1
            if(i && attendanceList[index]){
                rejectIdList.push(attendanceList[index]._id)
            }
        })
    }

    const formData = new FormData();
    formData.set("pwd", pwdInput.value);
    formData.set("commander", document.querySelector('#commander').innerHTML.split('：')[1]);
    formData.set("attendanceId", attendanceId);
    formData.set("rejectIdList", rejectIdList.join(','));
    const options = {
        method: "POST",
        body: formData,
    };
    const toast = document.querySelector('#toast')
    const toastText = document.querySelector('#toastText')
    toastText.innerHTML = '提交中'
    toast.style.display = 'block'
    fetch("/attendance-report", options)
        .then((response) => response.json())
        .then(data=>{
            // console.log('data',data)
            if(data.err){
                toastText.innerHTML = data.err
                
            }else{
                toastText.innerHTML = data.msg
                document.querySelector('#confirmContainer').style.display = 'none'
            }
            setTimeout(() => {
                toast.style.display = 'none'
            }, 800);
            

        })

}
confirmBtn.addEventListener('mousedown',confirmHandle)
confirmBtn.addEventListener('touchEnd',confirmHandle)