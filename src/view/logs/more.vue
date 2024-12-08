<template>
  <div>
    <Row
      type="flex"
      align="bottom"
    >
      <Col span="18" class="overText">{{ row.param || '无' }}</Col>
      <Col
        v-if="row.param"
        span="6"
        style="padding-left: 10px;"
      >
        <a @click.prevent="more">更多</a>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'MoreCom',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    more () {
      this.$Modal.info({
        title: '详情',
        // content: JSON.stringify(this.row.param)
        render: (h, params) => {
          return h('Input', {
            props: {
              disabled: true,
              type: 'textarea',
              value: JSON.stringify(this.row.param, null, 2),
              autosize: true
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.overText {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

</style>
