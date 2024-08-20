<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="username">
      <Input v-model="form.username" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>

    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>

    <FormItem prop="code">
      <Input
        v-model="form.code"
        placeholder="请输入图像验证码"
        class="imooc-input"
      >
        <span slot="prepend">
          <Icon :size="16" type="md-image"></Icon>
        </span>
        <span
          class="imooc-code"
          slot="append"
          v-html="svg"
          @click="_getCaptcha"
        ></span>
      </Input>
    </FormItem>

    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>

<script>
// import axios from '@/libs/request'
import uuid from 'uuid/v4'

import { getCode } from '@/api/login'

export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      form: {
        username: '3129166417@qq.com',
        password: '123456',
        code: '',
        sid: ''
      },
      svg: ''
    }
  },
  computed: {
    rules () {
      return {
        username: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  mounted () {
    if (localStorage.getItem('sid')) {
      this.form.sid = localStorage.getItem('sid')
    } else {
      this.form.this.sid = uuid()
      localStorage.setItem('sid', this.sid)
    }
    this.$store.commit('setSid', this.sid)
    this._getCaptcha()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', { ...this.form })
        }
      })
    },
    _getCaptcha () {
      // axios.get('/public/getCaptcha?sid=yxy').then(res => {
      //   console.log(res)
      //   this.svg = res.data
      // })
      getCode(this.form.sid).then(res => {
        this.svg = res.data
      })
    }
  }
}
</script>

<!-- scoped -->
<style lang="less">
.imooc-input {
  .ivu-input-group-append {
    padding: 0;
  }
  .ivu-input-group-prepend {
    width: 32px;
  }
}

.imooc-code {
  display: inline-block;
  padding: 0;
  height: 28px;
  overflow: hidden;
  svg {
    width: 120px;
    position: relative;
    top: -12px;
  }
}
</style>
