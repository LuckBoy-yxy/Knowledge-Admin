<template>
  <div>
    <!--
      searchable
      search-place="top"
    -->
    <Tables
      ref="tables"
      v-model="localData"
      :columns="columns"
      editable
      @on-selection-change="handleSelect"
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
  </div>
</template>

<script>
import Tables from '_c/tables'

export default {
  name: 'OperationCom',
  components: {
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
      currentIndex: 0,
      selections: [],
      localData: []
    }
  },
  methods: {
    // onPageChange (page) {
    //   this.page = page
    // },
    // onPageSizeChange (pageSize) {
    //   this.pageSize = pageSize
    // },
    handleSelect (seletcion) {
      if (!this.isEdit) {
        setTimeout(() => {
          const tmpData = JSON.parse(localStorage.getItem('localData'))
          if (typeof tmpData !== 'undefined' && tmpData) {
            this.localData = tmpData
          }
          this.$Message.info('当前不是编辑状态, 请选择角色进行编辑')
        }, 0)
      } else {
        this.selections = seletcion
      }
    }
  },
  watch: {
    tableData (newVal) {
      localStorage.setItem('localData', JSON.stringify(newVal))
      this.localData = newVal
    },
    localData () {
      this.$emit('on-change', this.localData)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
