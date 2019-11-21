import Vue from 'vue'

export function formatArgs (strP ) {
  if (strP.length > 0) {
    let strList = strP.split(',')
    let strListlen = strList.length
    if (strListlen > 0) {
      let strTemp = "{"
      for (let k = 0; k < strListlen; k++) {
        if (k != strListlen - 1) {
          strTemp += '"' + strList[k] + '"' + ':' + '["'+ strList[k] + '"],'
        } else {
          strTemp += '"' + strList[k] + '"' + ':' + '["'+ strList[k] + '"]}'
        }
      }
      return strTemp
    }
  }
}

export function checkJson (strP ) {
  // 检查字符串是否可以被解析,是否符合json格式要求
        try {
          if (strP) {
            JSON.parse(strP)
            console.log(JSON.parse(strP))
          }
          return true
        } catch (e) {
          window.alert( 'JSON格式错误,请重新检查' + e,)
          return false
        }
}

