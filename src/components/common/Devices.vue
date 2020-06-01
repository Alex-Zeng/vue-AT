<template>
  <div>
    <div>
      <el-button @click="connectAdbAndOpenMiniServer" type="text">连接设备</el-button>
      <el-button @click="openOperDevice" type="text">开启操作设备</el-button>
      <!--      <button @click="rece">获取图片</button>-->
      <el-button @click="disconnect" type="text">断开设备</el-button>
      <el-button @click="" type="text">安装apk</el-button>
      <el-button @click="" type="text">输入文本</el-button>
      <!--      <button @click="diconnect_minitouch">diconnect_minitouch</button>-->
      <!--      <button @click="startMinicapServer">启动MinicapServer</button>-->
      <!--      <button @click="stopMinicapServer">停止MinicapServer</button>-->
    </div>
    <div class="grid-content bg-purple-light">
      <canvas :id="deviceName" style="border: 1px solid red;" width="445" height="792" @mousedown="MouseClick"
              @mouseup="MouseUp"></canvas>
    </div>
    <div>
      <el-button @click="" type="text">后台</el-button>
      <el-button @click="" type="text">home</el-button>
      <!--      <button @click="rece">获取图片</button>-->
      <el-button @click="" type="text">返回</el-button>
    </div>

    <!-- 手势作用区域demo -->
  </div>
</template>

<script>
  import axios from 'axios';
  import {operaPhone, disconnectMinitouch, connectDevice} from '@/api/api'

  let canvas;
  let ctx;
  export default {
    name: "Devices",
    props: ['deviceName'],
    data() {
      return {
        path: "ws://localhost:9090/getScreen",
        message: '123',
        wsUrl: 'ws://localhost:9090/getScreen',
        websocket: '',
        imgdata: '',
        BLANK_IMG: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
        downX: '',
        downY: '',
        upX: '',
        upY: '',
        canvas: '',
        ctx: '',
        http: axios.create({
          baseURL: 'http://localhost:9090',
          timeout: 1000,
        }),
        device_name: "127.0.0.1:7555",
        data_form: {}
      }
    },
    methods: {
      connectAdbAndOpenMiniServer() {
        let devicesName = this.deviceName
        this.openOperDevice()
        this.webSocketLink(devicesName)
      },
      disconnect() {

        let deviceName = this.deviceName
        this.disconnectMinitouchs(deviceName)
        let url = "ws://localhost:9090/stopMiniServer/" + deviceName
        console.log('断开链接:' + url)
        let stopWebsocket = new WebSocket(url);
        stopWebsocket.onmessage = (event) => stopWebsocket.close()
        if (this.websocket != '') {
          this.websocket.close()
        }
        let canvas = document.getElementById(this.deviceName);
        let ctx = canvas.getContext('2d');
        this.drawImages(canvas, ctx, '123')
      },
      disconnectMinitouchs(deviceName) {
        disconnectMinitouch(deviceName).then(res => {
          if (res.status == 1) {
            this.$message({
              type: 'success',
              message: res.message
            })
          } else {
            this.$message({
              type: 'waring',
              message: res.message
            })
          }
        })
      },
      drawImages(canvas, ctx, data) {
        var blob = new Blob([data], {type: 'image/jpg'})
        var URL = window.URL || window.webkitURL
        var img = new Image()
        img.onload = function () {
          // canvas.width = img.width
          // canvas.height = img.height
          // ctx.scale(x_1,y_1)
          ctx.drawImage(img, 0, 0 ,canvas.width,canvas.height)
          img.onload = null
          img.src = this.BLANK_IMG
          img = null
          u = null
          blob = null
        }
        var u = URL.createObjectURL(blob)
        img.src = u
      },
      MouseClick(event) {
        this.downX = event.offsetX
        this.downY = event.offsetY
        console.log('dowm:', event)

      },
      MouseUp(event) {
        this.upX = event.offsetX
        this.upY = event.offsetY
        if (this.downX != '' && this.downY != '' && this.upX != '' && this.upY != '') {
          let x = Math.abs(this.upX - this.downX)
          let y = Math.abs(this.upY - this.downY)
          let canvas = document.getElementById(this.deviceName)
          let width = canvas.width
          let height = canvas.height
          let percentageUpX = (this.upX / width).toFixed(3)
          let percentageUpY = (this.upY / height).toFixed(3)
          if (x <= 10 && y <= 10) {
            // 调用点击接口
            this.data_list = {"cos": [percentageUpX, percentageUpY]}
          } else {
            let percentageDownX = (this.downX / width).toFixed(3)
            let percentageDownY = (this.downY / height).toFixed(3)
            // console.log(percentageDownX)
            // console.log(percentageDownY)
            // console.log(percentageUpX)
            // console.log(percentageUpY)
            //调用滑动接口
            this.data_list = {
              "cos": [percentageDownX, percentageDownY, percentageUpX, percentageUpY]
            }
          }
          operaPhone(this.deviceName, this.data_list).then(res => {
            if (res.status == 1) {
              console.log(res.data)
            }
          })
          this.downX = ''
          this.downY = ''
          this.upX = ''
          this.upY = ''
          this.data_list = ''
        }
      },
      openOperDevice() {
        let devicesName = this.deviceName
        connectDevice(devicesName).then(
          res => {
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: res.message
              })
            } else {
              this.$message({
                type: 'waring',
                message: res.message
              })
            }
          }
        )
      },
      webSocketLink(deviceName) {
        let _this = this
        let websocket = new WebSocket('ws://localhost:9090/getScreen' + '/' + deviceName);
        this.websocket = websocket
        // if ('WebSocket' in window) {
        //   let websocket = new WebSocket(_this.wsUrl + '/' + deviceName);
        // } else if ('MozWebSocket' in window) {
        //   let websocket = new MozWebSocket(_this.wsUrl + '/' + deviceName);
        // } else {
        //   let websocket = new SockJS(_this.wsUrl + '/' + deviceName)
        // }
        let canvas = document.getElementById(_this.deviceName);
        let ctx = canvas.getContext('2d');
        websocket.onopen = function () {
          console.log("websock连接成功");
        };
        websocket.onmessage = function (event) {
          if (event.data.size < 4) {
            alert('设备已被使用')
          } else {
            _this.drawImages(canvas, ctx, event.data)
          }
        }

      }

    },
  }
</script>

<style>
  ::-webkit-scrollbar {
    width: 0 !important;
  }

  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
</style>
