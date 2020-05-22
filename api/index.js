// request post 请求
const postData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.root + url,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Auth": wx.getStorageSync('token')
      },
      data: param,
      success: async res => {
        if (res.data.code != 1) {
          wx.showToast({
            title: res.data.warn,
            icon: 'none',
            duration: 1500
          })
          //未登录需要做的操作（根据项目需求以及接口做相应改变）
          // if (res.data.warn == '你未登录，请登录' || res.data.warn == 'Auth 已失效，请重新登录') {
          //   wx.removeStorageSync('token')
          //   await judgeLogin(async () => {
          //     await showToast('登录成功！')
          //     wx.reLaunch({
          //       url: '/pages/index/index',
          //     })
          //   })
          // }
        } else {
          resolve(res.data)
        }
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}
// request get 请求
const getData = (url, param) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.root + url,
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Auth": wx.getStorageSync('token')
      },
      data: param,
      success(res) {
        resolve(res.data)
      },
      fail(err) {
        console.log(err)
        reject(err)
      }
    })
  })
}
// 随机token
const suiji = () => {
  var c = "abcdefghijklmnopqrstuvwxyz";
  var x = c.length - 1;
  var str = "";
  for (var i = 1; i <= 12; i++) {
    var rand = Math.floor(Math.random() * x);
    var str = str + c.substr(rand, 1);
    if (i == 1) { //某些语言变量首字母不能是数字
      var c = c + "0123456789";
      var x = c.length - 1;
    }
  }
  return str;
}

//生成从minNum到maxNum的随机数
const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
}

//是不是需要留安全距离的ios
const isIPhoneXRegex = () => {
  let model = wx.getSystemInfoSync().model
  return (/iphone\sx/i.test(model) ||
    (/iphone/i.test(model) && /unknown/.test(model)) ||
    /iphone\s11/i.test(model))
}
// 预览图片
const lookImgHandle = (data, arr = []) => {
  let newArr = []
  if (arr.length == 0) {
    newArr = [data]
  } else {
    let bool = Object.prototype.toString.call(arr[0]) === '[object Object]'
    if (bool) {
      arr.forEach(item => {
        newArr.push(item.url)
      })
    } else {
      newArr = arr
    }
  }
  wx.previewImage({
    current: data,
    urls: newArr,
  })
}

// 微信定位
const wxGetAddress = () => {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

// loading加载提示
const showLoading = () => {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success(res) {
        console.log('显示loading')
        resolve(res)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

// 关闭loading
const hideLoading = () => {
  return new Promise((resolve) => {
    wx.hideLoading()
    console.log('隐藏loading')
    resolve()
  })
}

// 提示信息
const showToast = ({title = '提示', icon = 'success', duration = 1500}) => {
  return new Promise((resolve) => {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration,
      success: () => {
        setTimeout(() => {
          resolve()
        }, duration)
      }
    })
  })
}


// 数组列表加一个状态
const addSelected = arr => {
  console.log(arr)
  let arrObj = []
  arr.forEach(item => {
    let obj = {
      name: item,
      selected: false
    }
    arrObj.push(obj)
  })
  return arrObj
}
//状态全改为false
const toAllFalse = (data) => {
  let arr = [...data]
  arr.forEach(item => {
    item.selected = false
  })
  return arr
}
//补零
const addZero = (data) => {
  if (data * 1 < 10) {
    return '0' + data
  } else {
    return data
  }
}
//数组对象加一个状态
const addArrObjSelected = arr => {
  arr.forEach(item => {
    item.selected = false
  })
  return arr
}
// 防抖
var timer
const debounce = (fn, interval) => {
  clearTimeout(timer);
  timer = setTimeout(function() {
    fn()
  }, interval);
}


//文件上传 url：上传服务器地址、filePaths：上传文件数组（需包含url字段，代表文件路径、param：formData参数默认为空）
const uploadFile = (url, filePaths, param = {}) => {
  let state = 0
  let uploadNum = filePaths.length; // 上传数组的长度
  return new Promise((resolve, reject) => {
    if (uploadNum > 0) {
      for (let i = 0; i < uploadNum; i++) {
        console.log(filePaths[i].url)
        wx.uploadFile({
          url: getApp().globalData.root + url,
          name: 'file',
          method: 'POST',
          filePath: filePaths[i].url,
          header: {
            'Content-type': 'multipart/form-data',
            // "Auth": wx.getStorageSync('token')
          },
          formData: param,
          success:async result=> {
            state++;
            const res = JSON.parse(result.data);
            console.log(res)
            if (state == uploadNum) {
              if (res.code == 1) {
                resolve(res);
              } else {
                wx.showToast({
                  title: res.warn,
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          },
          fail(error) {
            wx.showToast({
              title: error,
              icon: 'none',
              duration: 1500
            })
            reject(error);
          },
        })
      }
    } else {
      resolve();
      wx.hideLoading();
    }
  })
}
const judgeLogin = callBack=>{
    wx.removeStorageSync('token')
    // 登录
    wx.login({
      success: async wxRes => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: getApp().globalData.root + 'wxapi/v1/user.php?type=login',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: {
            code: wxRes.code
          },
          success: async loginRes => {
            if (loginRes.data.code == 1) { //登录或注册成功
              wx.setStorageSync('token', loginRes.data.data.token)
              getApp().globalData.miniId = loginRes.data.data.miniId
              await callBack()
            }
          }
        })
      }
    })
}
const downFile = (url, fileName='zhongkai') => {
  console.log('******需要下载的文件路径*********：' + url)
  let urlArr = url.split('.')
  let suffix = urlArr[urlArr.length - 1]
  console.log('*************文件格式***********' + suffix)
  wx.showLoading({
    title: '努力下载中~',
  })
  wx.downloadFile({
    url: getApp().globalData.root + url,
    filePath: wx.env.USER_DATA_PATH + `/${fileName}`,
    success(res) {
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
      if (res.statusCode === 200) {
        console.log('*******保存到手机的路径********' + res.filePath) 
        if (suffix == 'jpg' || suffix=='png') {
          wx.saveImageToPhotosAlbum({
            filePath: res.filePath,
            success: saveRes => {
              wx.hideLoading()
              wx.showToast({
                title: '保存成功！',
              })
              lookImgHandle(res.filePath)
            }
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '下载成功！',
          })
          wx.openDocument({
            filePath: res.filePath,
            showMenu: true
          })
        }
      }
    },
    fail: err => {
      console.log(err)
      wx.hideLoading()
      wx.showToast({
        title: '文件错误！',
        icon: 'none',
        duration: 1500
      })
    }
  })
}

module.exports = {
  getData,
  postData,
  showLoading,
  hideLoading,
  addSelected,
  addArrObjSelected,
  debounce,
  addZero,
  showToast,
  lookImgHandle,
  uploadFile,
  toAllFalse,
  isIPhoneXRegex,
  suiji,
  wxGetAddress,
  randomNum,
  downFile
}