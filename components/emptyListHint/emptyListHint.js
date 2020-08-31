// components/emptyListHint/emptyListHint.js
const gdata = getApp().globalData
const api = getApp().globalData.api
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hint:{
      type: String,
      value: '暂无更多数据'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    root: gdata.root,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
