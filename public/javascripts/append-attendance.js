

const attendanceId = window.location.href.split('/').pop()
const reportLink = document.querySelector('#reportLink')
reportLink.href = `${window.location.origin}/attendance-report/attendanceId/${attendanceId}`


// 舰船种类
const warship = document.querySelector('#warship')
const warshipPicker = document.querySelector('#warshipPicker')
const warshipPickerClickHandle = ()=>{
    weui.picker([
    {
        label: '巡洋防空',
        value: '巡洋防空'
    }, 
    {
        label: '拦截',
        value: '拦截'
    }, 
    {
        label: '截击',
        value: '截击'
    },
    {
        label: '战巡火力',
        value: '战巡火力'
    }, 
    {
        label: '战列火力',
        value: '战列火力'
    }, 
    {
        label: '巡洋后勤',
        value: '巡洋后勤'
    }, 
    {
        label: '战巡后勤',
        value: '战巡后勤'
    }, 

    {
        label: '其它',
        value: '其它'
    }, 


], {
        onConfirm: function (result) {
            warship.innerHTML = result[0].value
        }
    });
}
warshipPicker.addEventListener('mousedown',warshipPickerClickHandle)
warshipPicker.addEventListener('touchEnd',warshipPickerClickHandle)

// 图片预览
const imagePreview = document.querySelector('#imagePreview')
const imageSmallPreview = document.querySelector('#imageSmallPreview')

const imageSmallPreviewHandle = ()=>{
    imagePreview.style.display = 'block'
}
imageSmallPreview.addEventListener('mousedown',imageSmallPreviewHandle)
imageSmallPreview.addEventListener('touchEnd',imageSmallPreviewHandle)

const imagePreviewHandle= ()=>{
    imagePreview.style.display = 'none'
}

imagePreview.addEventListener('mousedown',imagePreviewHandle)
imagePreview.addEventListener('touchEnd',imagePreviewHandle)


// 上传图片,本地预览
const uploaderInput = document.querySelector('#uploaderInput')
uploaderInput.addEventListener('change',()=>{
    imageSmallPreview.style.display = 'block'
    let blob = new Blob( uploaderInput.files);
    let blobURL = window.URL.createObjectURL(blob);
    const imageUrl = `url('${blobURL}')`
    imagePreview.style.background =  `url('${blobURL}') center center / contain no-repeat rgba(0, 0, 0, 0.5)`
    imageSmallPreview.style.backgroundImage = imageUrl
    // console.log('uploaderInput',uploaderInput.files,blob,blobURL)
})

// 军团
const legionInput = document.querySelector('#legionInput')
legionInput.addEventListener('change',()=>{
    // 转换成大写
    legionInput.value = legionInput.value.toLocaleUpperCase()
})

const playerName = document.querySelector('#playerName')


// 要先获取历史记录自动填写，提交后保存记录
warship.innerHTML = localStorage.getItem('warship');
legionInput.value = localStorage.getItem('legion' );
playerName.value = localStorage.getItem('playerName');


const toast = document.querySelector('#toast')
const confirmBtn = document.querySelector('#confirmBtn')
const confirmHandle = ()=>{
    // console.log('填写：',warship.innerHTML,uploaderInput.files)
    if(!warship.innerHTML || !legionInput.value || !playerName.value || !uploaderInput.files[0]){
        toast.style.display = 'block'

        setTimeout(() => {
            toast.style.display = 'none'
        }, 1000);
        return 
    }
    const formData = new FormData();

    formData.append("file", uploaderInput.files[0]);
    formData.set("warship", warship.innerHTML);
    formData.set("legion", legionInput.value);
    formData.set("playerName", playerName.value);

    localStorage.setItem('warship', warship.innerHTML);
    localStorage.setItem('legion', legionInput.value);
    localStorage.setItem('playerName', playerName.value);
    
    formData.set("attendanceId", attendanceId);

    const options = {
        method: "POST",
        body: formData,
    };

    const toastText = document.querySelector('#toastText')
    toastText.innerHTML = '提交中'
    toast.style.display = 'block'

    fetch("/append-attendance", options)
        .then((response) => response.json())
        .then(data=>{
            if(data.err){
                toastText.innerHTML = data.err
            }else{
                toastText.innerHTML = data.msg
            }
            
            setTimeout(() => {
                toast.style.display = 'none'
            }, 800);
            confirmBtn.style.display='none'
            document.querySelector('#uploaderInputContainer').style.display='none'
        })
}
confirmBtn.addEventListener('mousedown',confirmHandle)
confirmBtn.addEventListener('touchEnd',confirmHandle)