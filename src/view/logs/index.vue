<template>
  <div>
    <Card :dis-hover="true" :shadow="true">
      <Table
        ref="table"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        @on-selection-change="handleSelect"
      ></Table>

      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style="margin-top: 10px;"
      >
        <Col class="ctrls">
          <Button @click="deleteErrors">批量删除</Button>
        </Col>

        <Col>
          <Page
            :total="total"
            :current="page"
            :page-size="pageSize"
            :page-size-opts="pageArr"
            show-elevator
            show-sizer
            show-total
            @on-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
          />
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import Expend from './expend.vue'
import More from './more.vue'

import dayjs from 'dayjs'

import { getErrorList, deleteErrors } from '@/api/admin'

export default {
  name: 'LogsCheck',
  data () {
    const that = this
    return {
      tableData: [],
      columns: [
        {
          type: 'expand',
          key: 'stack',
          width: 50,
          render: (h, params) => {
            return h(Expend, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          type: 'selection',
          align: 'center',
          width: 60
        },
        {
          title: '错误信息',
          key: 'message',
          align: 'center',
          minWidth: 180
        },
        {
          title: '错误状态码',
          key: 'code',
          align: 'center',
          minWidth: 180,
          filters: [],
          filterMultiple: false,
          filterRemote: (value, row) => {
            // this.filters[row] = value

            const obj = { ...this.filters }
            if (value[0]) {
              obj[row] = value[0]
            } else {
              delete obj[row]
            }
            this.filters = obj
            // this.$set(this.filters, row, value)
          }
        },
        {
          title: '请求类型',
          key: 'method',
          align: 'center',
          minWidth: 180,
          filters: [],
          filterMultiple: false,
          filterRemote (value, row) {
            // that.filters[row] = value

            const obj = { ...that.filters }
            if (value[0]) {
              obj[row] = value[0]
            } else {
              delete obj[row]
            }
            that.filters = obj
            // that.$set(that.filters, row, value)
          }
        },
        {
          title: '请求路径',
          key: 'path',
          align: 'center',
          minWidth: 180
        },
        {
          title: '请求参数',
          key: 'param',
          align: 'center',
          minWidth: 200,
          render: (h, params) => {
            return h(More, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: '日期',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          }
        },
        {
          title: '用户',
          key: 'username',
          align: 'center',
          minWidth: 120
        }
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      loading: false,
      selections: [],
      filters: {}
    }
  },
  mounted () {
    this._getErrorList()
  },
  methods: {
    _getErrorList () {
      this.loading = true
      getErrorList({
        page: this.page,
        pageSize: this.pageSize,
        filter: this.filters || {}
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
          this.loading = false
          const keys = Object.keys(res.filters)
          this.columns.forEach(item => {
            if (keys.includes(item.key)) {
              if (item.filters.length === 0) {
                item.filters = res.filters[item.key]
              }
            }
          })
        }
      })
    },
    onPageChange (page) {
      this.page = page
      this._getErrorList()
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
      this._getErrorList()
    },
    handleSelect (selectData) {
      this.selections = selectData
    },
    deleteErrors () {
      if (!this.selections.length) {
        return this.$Message.info('请先选择需要删除的表格数据')
      }
      this.$Modal.confirm({
        title: '批量删除',
        content: '确定执行批量删除操作吗?',
        onOk: () => {
          const ids = this.selections.map(item => item._id)
          deleteErrors({ ids }).then(res => {
            if (res.code === 200) {
              this.tableData = this.tableData.filter(item => !ids.includes(item._id))
              this.$Message.success('批量删除成功')
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    }
  },
  watch: {
    filters (newVal, oldVal) {
      this._getErrorList()
    }
    // filters: {
    //   handler (newVal, oldVal) {
    //     console.log(newVal, oldVal)
    //   },
    //   deep: true
    // }
  }
}
</script>

<style lang="less" scoped>

</style>
