<template>
  <div>
    <Form
      ref="form"
      :disabled="!isEdit"
      :model="formData"
      :rules="formRules"
      :label-width="80"
    >
      <FormItem label="菜单标题" prop="name">
        <Input
          v-model="formData.name"
          placeholder="请输入菜单名称"
        />
      </FormItem>

      <FormItem label="路径" prop="path">
        <Input
          v-model="formData.path"
          placeholder="请输入菜单路径"
        />
      </FormItem>

      <FormItem label="组件" prop="component">
        <Input
          v-model="formData.component"
          placeholder="请输入前端组件名称"
        >
          <span slot="prepend">()=>import('@/view</span>
          <span slot="append">.vue')</span>
        </Input>
      </FormItem>

      <FormItem label="排序">
        <Input
          v-model="formData.sort"
          placeholder="组件默认排序"
          style="width: 100px"
        />
      </FormItem>

      <FormItem label="面包屑">
        隐藏&nbsp;
        <i-switch
          v-model="formData.hideInBread"
        />
        &nbsp;显示
      </FormItem>

      <FormItem label="菜单类型">
        <Select
          v-model="formData.type"
          placeholder="请选择菜单类型"
          style="width: 200px"
        >
          <Option value="menu">目录</Option>
          <Option value="resource">资源</Option>
        </Select>
      </FormItem>

      <FormItem label="菜单显示">
        隐藏&nbsp;
        <i-switch
          v-model="formData.hideInMenu"
        />
        &nbsp;显示
      </FormItem>

      <FormItem label="缓存">
        不使用&nbsp;
        <i-switch
          v-model="formData.notCache"
        />
        &nbsp;使用
      </FormItem>

      <FormItem label="图标">
        <Input
          v-model="formData.icon"
          placeholder="请输入前端组件名称"
        />
      </FormItem>

      <FormItem label="重定向">
        <Input
          v-model="formData.redirect"
          placeholder="重定向组件"
        />
      </FormItem>

      <FormItem v-if="isEdit">
        <Button type="primary" @click="submit">确定</Button>
        <Button @click="cancel" style="margin-left: 8px">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'FormCom',
  props: {
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
      formData: {
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      },
      formRules: {
        name: [
          { required: true, message: '菜单标题不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '菜单路径不能为空', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '前端组件不得为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            title: this.formData.name,
            ...this.formData,
            expand: true
          }
          this.$emit('submit', data)
          setTimeout(() => {
            this.cancel()
          }, 0)
        } else {
          this.$Message.info('请检查表单信息是否正确')
        }
      })
    },
    cancel () {
      this.$refs.form.resetFields()
      this.formData = {
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      }
      this.$emit('cancel')
    }
  },
  watch: {
    item (newVal, oldVal) {
      this.formData = newVal
    }
  }
}
</script>

<style lang="less" scoped>

</style>
