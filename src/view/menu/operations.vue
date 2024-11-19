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
      :isShow="showModal"
      :isEdit="showEdit"
      :item="selection"
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
      showModal: false,
      showEdit: false,
      selection: {},
      currentIndex: 0
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
    handleRowEdit (item, index) {
      if (this.isEdit) {
        this.selection = item
        this.currentIndex = index
        this.showEdit = true
        this.showModal = true
      } else {
        this.$Message.info('请先选择菜单节点, 再进行资源选项的编辑')
      }
    },
    handleRowRemove () {
      if (this.isEdit) {
        this.$Modal.confirm({
          title: `确定删除吗?`,
          content: `删除 ${row.name} 资源选项吗?`,
          onOk: () => {
            this.tableData.splice(index, 1)
            this.$Message.success('删除成功')
            this.localData.splice(this.currentIndex, 1, data)
          },
          onCancel: () => {
            this.$Message.info('取消操作')
          }
        })
      } else {
        this.$Message.info('请先选择菜单节点, 再进行资源选项的删除')
      }
    },
    handleDeleteBath () {

    },
    handleSelect () {

    },
    handleSearch () {

    },
    handleAdd () {
      this.showModal = true
    },
    submitItemAdd (data) {
      if (this.showEdit) {
        this.localData.splice(this.currentIndex, 1, data)
        this.showEdit = false
      } else {
        this.localData.push(data)
      }
      this.$emit('on-change', this.localData)
    },
    handleItemCancel (value) {
      this.showModal = value
    },
    handleSetBath () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
