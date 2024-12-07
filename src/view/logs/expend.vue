<template>
  <div>
    <Row>
      <Col span="24">
        <p>错误内容: {{ row.path }} &nbsp; {{ row.method }} &nbsp; {{ row.code }}</p>
        <p>请求参数: {{ row.param || '无' }}</p>
      </Col>

      <Col span="24">
        <br />
        <p>Stack:</p>
        <p>{{ row.stack }}</p>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'ExpendVom',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
