<template>
  <div>
    <Tables
      ref="tables"
      v-model="tableData"
      :columns="columns"
      editable
      searchable
      search-place="top"
      @on-row-edit="handleRowEdit"
      @on-row-remove="handleRowRemove"
      @on-selection-change="handleSelect"
      @searchEvent="handleSearch"
    >
      <template v-slot:table-header>
        <Button
          class="search-btn"
          type="primary"
          @click="handleAdd"
        >
          <Icon type="ios-paper-plane-outline" /> 添加资源
        </Button>
      </template>
    </Tables>

    <Row
      type="flex"
      justify="space-between"
      align="middle"
      style="margin-top: 10px;"
    >
      <Col class="ctrls">
        <Button @click="handleDeleteBath">批量删除</Button>
        <Button style="margin: 0 10px;" @click="handleSetBath">批量设置</Button>
      </Col>

      <Col>
        <Page
          :total="total"
          show-elevator
          show-sizer
          show-total
          :current="page"
          :page-size="pageSize"
          :page-size-opts="pageArr"
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'

export default {
  name: 'OperationCom',
  component: {
    Tables
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      page: 1,
      pageSize: 10,
      pageArr: [10, 20, 30, 50, 100],
      total: 0
    }
  },
  methods: {
    onPageChange (page) {
      this.page = page
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
    },
    handleRowEdit () {

    },
    handleRowRemove () {

    },
    handleDeleteBath () {

    },
    handleSelect () {

    },
    handleSearch () {

    },
    handleAdd () {

    },
    handleSetBath () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
