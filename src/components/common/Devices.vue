<template>
  <div>
    <div>

      <el-upload
        class="upload-demo"
        action="http://localhost:5002/runtest/AdbOperaDevice"
        accept="apk"
        show-file-list
        ref="upload"
        :with-credentials="true"
        :on-success="failUpload"
        :before-upload="fileCheck"
        :data="{'opera': 1, 'device_id': deviceName, 'data': 0}"
      >
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">安装apk</el-button>
      </el-upload>
      <el-button @click="connectAdbAndOpenMiniServer" type="text">连接设备</el-button>
      <el-button @click="disconnect" type="text">断开设备</el-button>
      <el-button @click="sendKeys" type="text">输入文本</el-button>
      <!--      <button @click="diconnect_minitouch">diconnect_minitouch</button>-->
      <!--      <button @click="startMinicapServer">启动MinicapServer</button>-->
      <!--      <button @click="stopMinicapServer">停止MinicapServer</button>-->
    </div>
    <div class="grid-content bg-purple-light">
      <canvas :id="deviceName" style="border: 1px solid red;" width="441" height="713" @mousedown="MouseClick"
              @mouseup="MouseUp"></canvas>
    </div>
    <div>
      <el-button @click="adbOperaDevice(5)" icon="el-icon-notebook-2" circle></el-button>
      <el-button @click="adbOperaDevice(4)" icon="el-icon-house" circle></el-button>
      <!--      <button @click="rece">获取图片</button>-->
      <el-button @click="adbOperaDevice(3)" icon="el-icon-arrow-left" circle></el-button>
    </div>

    <!-- 手势作用区域demo -->
  </div>
</template>

<script>
  import axios from 'axios';
  import {operaPhone, disconnectMinitouch, connectDevice, adbOperaDevice} from '@/api/api'

  let canvas;
  let ctx;
  export default {
    name: "Devices",
    props: ['deviceName'],
    data() {
      return {
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
        let stopWebsocket = new WebSocket(url);
        stopWebsocket.onmessage = (event) => console.log('断开链接:' + event)
        console.log('断开链接:' + 111)
        if (this.websocket != '') {
          this.websocket.close()
        }
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
          canvas.width = (img.width / img.height) * canvas.height
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
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
      adbOperaDevice(op) {
        let data = '你好吗'
        let operaForm = {"opera": op, "device_id": this.deviceName, "data": data}
        adbOperaDevice(operaForm)
      },

      sendKeys() {
        this.$prompt('请输入文本', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          let operaForm = {"opera": 2, "device_id": this.deviceName, "data": value}
          adbOperaDevice(operaForm).then(res => {
            if (res.status == 0) {
              this.$message({
                type: 'waring',
                message: res.message
              })
            }
          })
        })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      failUpload(err, file, fileLis){
        this.$message({
            type: 'error',
            message: err.message
          });
        this.$refs.upload.clearFiles()
      },
      fileCheck(file){
        if (file.name.endsWith('.apk') ){
           console.log(file.name)
        }else {
          this.$message({
            type: 'error',
            message: "请上传apk文件"
          });
          return false
        }
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
