<template>
  <div>
    <Modal
      v-model="showStatus"
      title="新增用户"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form
        ref="form"
        :model="formData"
        :label-width="80"
        :rules="ruleValidate"
      >
        <FormItem label="登录名" prop="username">
          <Input
            prefix="md-mail"
            v-model="formData.username"
            placeholder="请输入登录名(邮箱)"
          ></Input>
        </FormItem>

        <FormItem label="用户昵称" prop="name">
          <Input
            prefix="md-person"
            v-model="formData.name"
            placeholder="请输入用户昵称"
          ></Input>
        </FormItem>

        <FormItem label="密码" prop="password">
          <Input
            prefix="md-lock"
            v-model="formData.password"
            placeholder="请输入密码"
          ></Input>
        </FormItem>

        <FormItem label="性别">
          <RadioGroup v-model="formData.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="手机号" prop="mobile">
          <Input
            v-model="formData.mobile"
            placeholder="请输入手机号"
          ></Input>
        </FormItem>

        <FormItem label="角色" prop="roles">
          <Select
            v-model="formData.roles"
            multiple
          >
            <Option
              v-for="(item, index) in roleArr"
              :value="item.role"
              :key="'role' + index"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>

        <FormItem label="所在城市">
          <Input
            prefix="md-pin"
            v-model="formData.location"
            placeholder="请输入所在城市"
          ></Input>
        </FormItem>

        <FormItem label="是否禁用">
          <RadioGroup v-model="formData.status">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="是否是VIP">
          <RadioGroup v-model="formData.isVip">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="用户积分" prop="favs">
          <Input
            v-model="formData.favs"
            style="width: 100px"
          />
        </FormItem>

        <FormItem label="个性签名">
          <Input
            type="textarea"
            v-model="formData.regmark"
            placeholder="请输入个性签名"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { checkUserName } from '@/api/admin'

const userNamePassCheck = (rule, value, callback) => {
  checkUserName(value).then(res => {
    if (res.code === 200) {
      if (res.data === 1) {
        callback()
      } else {
        callback(new Error('登录名已存在'))
      }
    }
  })
}

const rolesCheck = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请选择角色'))
  } else {
    callback()
  }
}

const mobilePassCheck = (rule, value, callback) => {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

const favPassCheck = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入用户积分'))
  }
  if (!/^[1-9]\d*$/.test(value)) {
    callback(new Error('请输入正确的数值'))
  }
  if (+value % 10 !== 0) {
    callback(new Error('请输入可以除以10的整数'))
  } else {
    callback()
  }
}

export default {
  name: 'AddModal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    roleArr: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      showStatus: false,
      loading: true,
      formData: {
        name: '',
        username: '',
        password: '',
        roles: ['user'],
        mobile: '',
        gender: '0',
        status: '0',
        isVip: '0',
        favs: 100,
        location: '',
        regmark: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { type: 'string', min: 4, message: '昵称长度至少为 4 位', trigger: 'change' },
          { type: 'string', max: 16, message: '昵称长度最多为 16 位', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
          { validator: userNamePassCheck, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度至少为 6 位', trigger: 'change' },
          { type: 'string', max: 20, message: '密码长度最多为 20 位', trigger: 'change' }
        ],
        roles: [
          // { required: true, message: '请选择角色', trigger: 'blur' }
          { validator: rolesCheck, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobilePassCheck, trigger: 'blur' }
        ],
        favs: [
          { validator: favPassCheck, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    ok () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false
          if (!this.formData.regmark) {
            this.formData.regmark = '用户很懒, 什么都没留下~~~'
          }
          this.$emit('AddEvent', this.formData)
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查表单信息是否正确')
        }
      })
    },
    cancel () {
      this.$emit('AddCancelEvent', false)
      Object.keys(this.formData).forEach(key => {
        if (key === 'gender' || key === 'status' || key === 'isVip') {
          this.formData[key] = '0'
        } else if (key === 'favs') {
          this.formData[key] = 100
        } else {
          this.formData[key] = ''
        }
      })
      this.$refs.form.resetFields()
    }
  },
  watch: {
    // isShow: (newVal, oldVal) => {
    //   this.showStatus = newVal
    // }
    isShow (newVal, oldVal) {
      this.showStatus = newVal
    }
  }
}
</script>
