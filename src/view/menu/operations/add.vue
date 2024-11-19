<template>
  <div>
    <Modal
      v-model="showStatus"
      :title="`${isEdit ? '编辑' : '添加'}资源选项`"
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
        <FormItem label="资源名称" prop="name">
          <Input
            v-model="formData.name"
            placeholder="请输入资源名称"
          ></Input>
        </FormItem>

        <FormItem label="资源路径" prop="path">
          <Input
            v-model="formData.path"
            placeholder="请输入资源路径"
          ></Input>
        </FormItem>

        <FormItem label="资源类型" prop="type">
          <Select v-model="formData.type" style="width:260px">
            <Option value="api">接口</Option>
            <Option value="btn">按钮</Option>
          </Select>
        </FormItem>

        <FormItem label="请求类型" prop="method">
          <Select v-model="formData.method" style="width:260px">
            <Option value="get">GET</Option>
            <Option value="post">POST</Option>
            <Option value="delete">DELETE</Option>
            <Option value="update">UPDATE</Option>
          </Select>
        </FormItem>

        <FormItem label="资源描述" prop="regmark">
          <Input
            type="textarea"
            v-model="formData.regmark"
            placeholder="请输入资源描述"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'AddModal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    isEdit: {
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
      formData: {
        name: '',
        path: '',
        type: '',
        method: '',
        regmark: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入资源路径', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择资源类型', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择请求方式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ok () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false
          this.$emit('AddEvent', { ...this.formData })
          this.cancel()
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查表单信息是否正确')
        }
      })
    },
    cancel () {
      this.$emit('AddCancelEvent', false)
      this.$refs.form.resetFields()
      this.formData = {
        name: '',
        path: '',
        type: '',
        method: '',
        regmark: ''
      }
    }
  },
  watch: {
    isShow (newVal, oldVal) {
      this.showStatus = newVal
    },
    item (newVal) {
      this.formData = { ...newVal }
    }
  }
}
</script>
