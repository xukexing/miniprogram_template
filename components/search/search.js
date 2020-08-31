// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'搜索关键字'
    },
    val:{
      type:String || Number,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   selfVal:''
  },
  attached(){
    this.properties.val?this.setData({
      selfVal:this.properties.val
    }):''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    searchInput({detail}){ 
      this.setData({
        selfVal:detail.value
      })
    },
    searchHandle(){
        this.triggerEvent('searchHandle',this.data.selfVal)
    },
    clearHandle(){
      this.setData({
        selfVal:''
      })
      // this.triggerEvent('ClearHandle')
    },
  }
})
