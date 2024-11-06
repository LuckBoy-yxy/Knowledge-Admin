<template>
  <div>
    <Modal
      v-model="showStatus"
      :title="isEdit ? '编辑标签' : '添加标签'"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form :model="localItem" :label-width="80">
        <FormItem label="名称">
          <Input
            v-model="localItem.tagName"
            placeholder="请输入标签标题"
          />
        </FormItem>

        <FormItem label="类名">
          <Select v-model="localItem.tagClass">
            <Option
              :value="item"
              v-for="(item, index) in lists"
              :key="'tags-' + index"
            >{{item}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'AddTag',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
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
      localItem: {
        tagName: '',
        tagClass: ''
      },
      showStatus: false,
      lists: [
        'layui-bg-red',
        'layui-bg-orange',
        'layui-bg-green',
        'layui-bg-cyan',
        'layui-bg-blue',
        'layui-bg-black',
        'layui-bg-gray'
      ]
    }
  },
  methods: {
    ok () {
      this.$emit('addEvent', this.localItem)
    },
    cancel () {
      this.$emit('changeEvent', false)
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

<style>

</style>
