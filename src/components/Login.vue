<template>
  <el-row :gutter="20">
    <el-col :span="8" :offset="6">
      <div class="grid-content bg-purple-dark">
        <el-form :model="numberValidateForm" ref="numberValidateForm" label-width="100px" class="demo-ruleForm">
          <el-form-item
            label="用户名"
            prop="username"
            :rules="[
      { required: true, message: '用户名不能为空'},
    ]"
          >
            <el-input type="text" v-model="numberValidateForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="密码"
            prop="password"
            :rules="[
      { required: true, message: '密码不能为空'},
    ]"
          >
            <el-input type="password" v-model="numberValidateForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('numberValidateForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  import {postLogin} from '../api/api'

  export default {
    name: 'login',
    data() {
      return {
        numberValidateForm: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            postLogin(this.numberValidateForm).then(res => {

                if (res.status == 1) {
                  let data = res.data
                  sessionStorage.setItem("islogin",res.status)
                  sessionStorage.setItem("username", data.userdata.username)
                  sessionStorage.setItem("user_id", data.userdata.id)
                  sessionStorage.setItem("userstatus", data.userdata.userstatus)
                  this.$router.push('/home')
                } else {
                  alert('登录失败')
                }
              }
            )
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
