<template>
  <div>
    <Modal
      v-model="showStatus"
      title="批量设置"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form
        ref="form"
        :model="localItem"
        :label-width="80"
      >
        <FormItem label="标签">
          <Select
            v-model="localItem.roles"
            multiple
          >
            <Option
              v-for="(item, index) in roles"
              :value="item"
              :key="'tags' + index"
            >{{ item }}</Option>
          </Select>
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
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'EditModal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showStatus: false,
      roles: ['user', 'admin', 'super_admin'],
      localItem: {
        status: '0',
        isVip: '0',
        roles: []
      }
    }
  },
  methods: {
    ok () {
      this.$emit('batchSetEvent', this.localItem)
    },
    cancel () {
      this.$emit('batchCencelEvent', false)
    }
  },
  watch: {
    isShow (newVal, oldVal) {
      this.showStatus = newVal
    }
  }
}
</script>
