<template>
  <div>
    <Modal
      v-model="showStatus"
      title="编辑用户信息"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form
        ref="form"
        :model="localItem"
        :label-width="80"
        :rules="ruleValidate"
      >
        <FormItem label="用户昵称" prop="name">
          <Input
            v-model="localItem.name"
            placeholder="请输入用户昵称"
          ></Input>
        </FormItem>

        <FormItem label="登录名" prop="username">
          <Input
            v-model="localItem.username"
            placeholder="请输入登录名"
          ></Input>
        </FormItem>

        <FormItem label="密码" prop="password">
          <Input
            v-model="localItem.password"
            placeholder="请输入密码"
          ></Input>
        </FormItem>

        <FormItem label="是否禁用">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="是否是VIP">
          <RadioGroup v-model="localItem.isVip">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="用户积分" prop="favs">
          <!-- <Slider
            v-model="formatFav"
            show-input
            :step="10"
            :max="1000"
          ></Slider> -->
          <Input
            v-model="localItem.favs"
            style="width: 100px"
          />
        </FormItem>

        <!-- <FormItem label="标签">
          <Select
            v-model="formatTags"
            multiple
          >
            <Option
              v-for="(item, index) in tagsList"
              :value="item.tagName"
              :key="'tags' + index"
            >{{ item.tagName }}</Option>
          </Select>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
const favPassCheck = (rule, value, callback) => {
  if (!value.trim()) {
    return callback(new Error('请输入用户积分'))
  }
  if (!/^[1-9]\d*$/.test(value)) {
    return callback(new Error('请输入正确的数值'))
  }

  const fav = +value
  if (fav % 10 === 0) {
    callback()
  } else {
    callback(new Error('输入的积分数需被 10 整除'))
  }
}

export default {
  name: 'EditModal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showStatus: false,
      loading: true,
      localItem: {
        name: '',
        username: '',
        password: '',
        status: '0',
        isVip: '0',
        favs: 0
      },
      tagsList: [],
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { type: 'string', min: 4, message: '昵称长度至少为 4 位', trigger: 'change' },
          { type: 'string', max: 16, message: '昵称长度最多为 16 位', trigger: 'change' }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度至少为 6 位', trigger: 'change' },
          { type: 'string', max: 20, message: '密码长度最多为 20 位', trigger: 'change' }
        ],
        favs: [
          // { required: true, message: '请输入用户积分', trigger: 'blur' },
          { validator: favPassCheck, trigger: 'change' }
        ]
      }
    }
  },
  mounted () {

  },
  // computed: {
  //   formatFav: {
  //     get () {
  //       return +this.localItem.favs
  //     },
  //     set (value) {
  //       this.localItem.favs = value
  //     }
  //   }
  // },
  methods: {
    ok () {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$Message.error('请检查表单信息是否正确')
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          return
        }
        this.$emit('eidtEvent', this.localItem)
        this.loading = false
      })
    },
    cancel () {
      this.$emit('changeEvent', false)
      this.$refs.form.resetFields()
    }
  },
  watch: {
    item (newVal, oldVal) {
      this.localItem = newVal
    },
    isShow (newVal, oldVal) {
      this.showStatus = newVal
    }
  }
}
</script>
