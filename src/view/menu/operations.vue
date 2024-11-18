<template>
  <div>
    <Tables
      ref="tables"
      v-model="localData"
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
          v-if="isEdit"
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
      <Col class="ctrls" v-if="isEdit">
        <Button @click="handleDeleteBath">批量删除</Button>
        <Button style="margin: 0 10px;" @click="handleSetBath">批量设置</Button>
      </Col>

      <!-- <Col>
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
      </Col> -->
    </Row>

    <AddModal
      ref="addModel"
      :isShow="showAdd"
      @AddEvent="submitItemAdd"
      @AddCancelEvent="handleItemCancel"
    />
  </div>
</template>

<script>
import Tables from '_c/tables'
import AddModal from './operations/add'

export default {
  name: 'OperationCom',
  components: {
    Tables,
    AddModal
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // page: 1,
      // pageSize: 10,
      // pageArr: [10, 20, 30, 50, 100],
      // total: 0,
      showAdd: false
    }
  },
  computed: {
    localData: {
      get () {
        return this.tableData
      },
      set (value) {
        console.log(value)
      }
    }
  },
  methods: {
    // onPageChange (page) {
    //   this.page = page
    // },
    // onPageSizeChange (pageSize) {
    //   this.pageSize = pageSize
    // },
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
      this.showAdd = true
    },
    submitItemAdd (data) {
      this.localData.push(data)
    },
    handleItemCancel (value) {
      this.showAdd = value
    },
    handleSetBath () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
