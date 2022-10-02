function formatTimeForBackend (date, dateSeparator = '-') {
    const dt = date
    return `${dt.getFullYear().toString().padStart(4, '0')}${dateSeparator}${(dt.getMonth() + 1).toString().padStart(2, '0')}${dateSeparator}${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
  }

const timeInput = document.querySelector('#timeInput')
timeInput.value = formatTimeForBackend(new Date())


const uniCodeInput = document.querySelector('#uniCodeInput')
const commanderPicker = document.querySelector('#commanderPicker')
const commander = document.querySelector('#commander')
commanderPicker.addEventListener('mousedown',()=>{
    weui.picker([{
        label: '生言',
        value: '生言'
    }, {
        label: '司隶',
        value: '司隶'
    }, {
        label: '贠总',
        value: '贠总'
    }

], {
        // onChange: function (result) {
        //     console.log('onChange',result);
        // },
        onConfirm: function (result) {
            console.log('onConfirm',result);
            commander.innerHTML = result[0].value
        }
    });
})

const confirmBtn = document.querySelector('#confirmBtn')

confirmBtn.addEventListener('mousedown',()=>{
    // console.log('发起：',commander.innerHTML,timeInput.value,uniCodeInput.value)
    const body = {
        commander:commander.innerHTML,
        time:timeInput.value,
        uniCode:uniCodeInput.value
    }
    const formData = new FormData();
    formData.set('commander',commander.innerHTML)
    formData.set('time',timeInput.value)
    formData.set('uniCode',uniCodeInput.value)



    const options={
        method: "POST",
        body: formData,
    }
    fetch("/start-attendance", options)
        .then((response) => response.json())
        .then(data=>{
            // console.log('生成新链接：',data)
            const appendLink = document.querySelector('#appendLink')
            const appendLinkContainer = document.querySelector('#appendLinkContainer')
            const link = `${window.location.origin}/append-attendance/attendanceId/${data.attendanceId}`
            appendLink.value = link
            appendLinkContainer.style.display = 'block'
            // 必须要有HTTPS
            if(navigator.clipboard){
                navigator.clipboard.writeText(link).then(function() {
                    const toast = document.querySelector('#toast')
                    toast.style.display = 'block'
                    setTimeout(() => {
                        toast.style.display = 'none'
                    }, 1000);
                    // console.log('Async: Copying to clipboard was successful!');
                }, function(err) {
                    console.error('Async: Could not copy text: ', err);
                });
            }

            
        })
})
