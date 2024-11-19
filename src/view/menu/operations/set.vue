<template>
  <div>
    <Modal
      v-model="showStatus"
      title="批量设置资源选项"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form>
        <FormItem label="资源类型" prop="type">
          <Select v-model="localItem.type" style="width:260px">
            <Option value="api">接口</Option>
            <Option value="btn">按钮</Option>
          </Select>
        </FormItem>

        <FormItem label="请求类型" prop="method">
          <Select v-model="localItem.method" style="width:260px">
            <Option value="get">GET</Option>
            <Option value="post">POST</Option>
            <Option value="delete">DELETE</Option>
            <Option value="update">UPDATE</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'BatchSet',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        method: '',
        type: ''
      },
      loading: true
    }
  },
  methods: {
    ok () {
      let flag = true
      for (const key of Object.keys(this.localItem)) {
        if (this.localItem[key] === '') {
          flag = false
          break
        }
      }
      if (!flag) {
        this.loading = false
        this.$nextTick(() => (this.loading = true))
        this.$Message.error('表单数据不能有空')
      } else {
        this.loading = false
        this.$emit('batchSetEvent', this.localItem)
      }
    },
    cancel () {
      this.localItem = {
        method: '',
        type: ''
      }
      this.$emit('cancelEvent', false)
    }
  },
  watch: {
    isShow (newVal) {
      this.showStatus = newVal
    }
  }
}
</script>

<style lang="less" scoped>

</style>
