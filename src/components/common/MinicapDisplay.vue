<template>
  <div>
    <button @click="init">lianjie</button>
    <button @click="rece">发消息</button>
    <button @click="diconnects">diconnect</button>
    <h5>{{message}}</h5>
    <canvas id="canvas" style="border: 1px solid red;"></canvas>
  </div>
</template>

<script>
  let canvas;
  let ctx;
  export default {
    data() {
      return {
        path: "ws://127.0.0.1:9527/my_socket",
        message: '123',
        imgdata: '',
        BLANK_IMG: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      }
    },
    mounted() {
      this.initCanvas()
    },
    methods: {
      initCanvas() {
        console.log("初始化canvas")
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = 340
        canvas.height = 720
      },
      init() {
        this.$connect('ws://localhost:9090/test')
      },
      send() {
        this.$socket.send('some data')
      },
      rece() {
        this.$options.sockets.onmessage = (data) => this.drwaImages(data.data)
      },
      diconnects() {
        console.log('断开链接')
        this.$disconnect()
      },
      drwaImages(data) {
        var blob = new Blob([data], {type: 'image/png'})
        var URL = window.URL || window.webkitURL
        var img = new Image()
        img.onload = function () {
          console.log(img.width, img.height)
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          img.onload = null
          img.src = this.BLANK_IMG
          img = null
          u = null
          blob = null
        }
        var u = URL.createObjectURL(blob)
        img.src = u
      },
      fomateData(data) {
        var readBannerBytes = 0
        var bannerLength = 2
        var readFrameBytes = 0
        var frameBodyLength = 0
        var frameBody = new Buffer(0)
        var banner = {
          version: 0
          , length: 0
          , pid: 0
          , realWidth: 0
          , realHeight: 0
          , virtualWidth: 0
          , virtualHeight: 0
          , orientation: 0
          , quirks: 0
        }

        function tryRead() {
          for (var chunk; (chunk = data);) {
            console.info('chunk(length=%d)', chunk.length)
            for (var cursor = 0, len = chunk.length; cursor < len;) {
              if (readBannerBytes < bannerLength) {
                switch (readBannerBytes) {
                  case 0:
                    // version
                    banner.version = chunk[cursor]
                    break
                  case 1:
                    // length
                    banner.length = bannerLength = chunk[cursor]
                    break
                  case 2:
                  case 3:
                  case 4:
                  case 5:
                    // pid
                    banner.pid +=
                      (chunk[cursor] << ((readBannerBytes - 2) * 8)) >>> 0
                    break
                  case 6:
                  case 7:
                  case 8:
                  case 9:
                    // real width
                    banner.realWidth +=
                      (chunk[cursor] << ((readBannerBytes - 6) * 8)) >>> 0
                    break
                  case 10:
                  case 11:
                  case 12:
                  case 13:
                    // real height
                    banner.realHeight +=
                      (chunk[cursor] << ((readBannerBytes - 10) * 8)) >>> 0
                    break
                  case 14:
                  case 15:
                  case 16:
                  case 17:
                    // virtual width
                    banner.virtualWidth +=
                      (chunk[cursor] << ((readBannerBytes - 14) * 8)) >>> 0
                    break
                  case 18:
                  case 19:
                  case 20:
                  case 21:
                    // virtual height
                    banner.virtualHeight +=
                      (chunk[cursor] << ((readBannerBytes - 18) * 8)) >>> 0
                    break
                  case 22:
                    // orientation
                    banner.orientation += chunk[cursor] * 90
                    break
                  case 23:
                    // quirks
                    banner.quirks = chunk[cursor]
                    break
                }

                cursor += 1
                readBannerBytes += 1

                if (readBannerBytes === bannerLength) {
                  console.log('banner', banner)
                }
              } else if (readFrameBytes < 4) {
                frameBodyLength += (chunk[cursor] << (readFrameBytes * 8)) >>> 0
                cursor += 1
                readFrameBytes += 1
                console.info('headerbyte%d(val=%d)', readFrameBytes, frameBodyLength)
              } else {
                if (len - cursor >= frameBodyLength) {
                  console.info('bodyfin(len=%d,cursor=%d)', frameBodyLength, cursor)

                  frameBody = Buffer.concat([
                    frameBody
                    , chunk.slice(cursor, cursor + frameBodyLength)
                  ])

                  // Sanity check for JPG header, only here for debugging purposes.
                  if (frameBody[0] !== 0xFF || frameBody[1] !== 0xD8) {
                    console.error(
                      'Frame body does not start with JPG header', frameBody)
                    process.exit(1)
                  }
                  // this.imgdata = frameBody
                  this.drwaImage(frameBody)

                  cursor += frameBodyLength
                  frameBodyLength = readFrameBytes = 0
                  frameBody = new Buffer(0)
                } else {
                  console.info('body(len=%d)', len - cursor)

                  frameBody = Buffer.concat([
                    frameBody
                    , chunk.slice(cursor, len)
                  ])

                  frameBodyLength -= len - cursor
                  readFrameBytes += len - cursor
                  cursor = len
                }
              }
            }
          }
        }
      }
    },
  }
</script>

<style>

</style>
