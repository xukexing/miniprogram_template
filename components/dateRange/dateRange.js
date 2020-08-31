// componen/dateRange/dateRange.js
const date = new Date()
const years = []
const months = []
const days = []
let changeNum=0
//补零
function addZero(data) {
  if (data * 1 < 10) {
    return '0' + data
  } else {
    return data
  }
}
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(addZero(i))
}
for (let i = 1; i <= 31; i++) {
  days.push(addZero(i))
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    initvalue:{
      type:Array,
      value:['','']
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    years: years,
    months: months,
    days: days,
    value: [9999, 1, 1],
    active:0,
    startTime:'',
    endTime:'',
    oldDate:'',
  },
  observers:{
    'active':function(val){
      let date = this.data.years[this.data.value[0]] + '-' + addZero((this.data.value[1] * 1 + 1)) + '-' + addZero((this.data.value[2] * 1 + 1)) 
      if (val == 0) {
        this.setData({
          startTime: this.data.startTime ? this.data.startTime: date
        })
      } else if (val == 1) {
        this.setData({
          endTime: this.data.endTime ? this.data.endTime :date
        })
      }
    },
  },
  attached:function(){
    this.setData({
      active:0,
    })
    this.setData({
      startTime: this.properties.initvalue[0] ? this.properties.initvalue[0] : '',
      endTime: this.properties.initvalue[1] ? this.properties.initvalue[1] : '',
    })
    if (this.properties.initvalue[0]){
      this.initDatePicker(this.properties.initvalue[0])
    }else{
      this.initDatePicker()
    }
    
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    bindChange: function (e) {
      const val = e.detail.value
      let year = this.data.years[val[0]]
      let month = this.data.months[val[1]]
      let day = this.data.days[val[2]]
      let days = []
      if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
        if (month == '02') {
          for (let i = 1; i <= 29; i++) {
            days.push(addZero(i))
          }
        } else if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
          for (let i = 1; i <= 31; i++) {
            days.push(addZero(i))
          }
        } else {
          for (let i = 1; i <= 30; i++) {
            days.push(addZero(i))
          }
        }

      } else {
        if (month == '02') {
          for (let i = 1; i <= 28; i++) {
            days.push(addZero(i))
          }
        } else if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
          for (let i = 1; i <= 31; i++) {
            days.push(addZero(i))
          }
        } else {
          for (let i = 1; i <= 30; i++) {
            days.push(addZero(i))
          }
        }
      }
      this.setData({
        days: days
      })
      if (this.data.active==0){
        this.setData({
          startTime: `${this.data.years[val[0]]}-${this.data.months[val[1]]}-${this.data.days[val[2]]}`, 
        })
      } else if (this.data.active == 1){
        this.setData({
          endTime: `${this.data.years[val[0]]}-${this.data.months[val[1]]}-${this.data.days[val[2]]}`,
        })
      }
      this.setData({
        value: [val[0], addZero(this.data.months[val[1]] * 1 - 1), addZero(this.data.days[val[2]] * 1 - 1)],
      })
    },
    initDatePicker(date){
      let nowDate =null
      if(date){
        nowDate = new Date(date)
      }else{
        nowDate = new Date()
      }
      let year = nowDate.getFullYear()
     
      let yearIndex=this.data.years.findIndex(item => item == year)
      let monthIndex = nowDate.getMonth()
      let dayIndex = nowDate.getDate()
      this.setData({
        value: [yearIndex, monthIndex, dayIndex - 1],
      })
      if (changeNum==0){
        this.setData({
          startTime: `${year}-${addZero(monthIndex + 1)}-${addZero(dayIndex)}`
        })
      }
      changeNum++
    },
    selectInput({currentTarget}){
      let index=currentTarget.dataset.index*1
      this.setData({
        active:index
      })
      console.log(this.data.startTime, this.data.endTime)
      if(index==0){
        this.initDatePicker(this.data.startTime)
      }else if(index==1){
        this.initDatePicker(this.data.endTime)
      }
    },
    clearHandle(){
      this.setData({
        startTime:'',
        endTime: '',
      })
      this.triggerEvent('clear')
    },
    hidePicker(){
      this.triggerEvent('cancel')
    }, 
    sureBtnHandle(){
      if (!this.data.endTime || !this.data.startTime){
        wx.showToast({
          title: '请选择时间',
          icon:'none'
        })
      }else if(this.data.startTime.split('-')>this.data.endTime.split('-')){
        wx.showToast({
          title: '结束时间不能大于开始时间',
          icon:'none'
        })
      }else{
        this.triggerEvent('sure', { startTime: this.data.startTime, endTime: this.data.endTime })
      }
    },
  }
})
