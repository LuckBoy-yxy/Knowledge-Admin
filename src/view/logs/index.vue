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
          <Button @click="handleSetBatch">批量设置</Button>
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

import dayjs from 'dayjs'

import { getErrorList } from '@/api/admin'

export default {
  name: 'LogsCheck',
  // components: {
  //   Expend
  // },
  data () {
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
          minWidth: 180
        },
        {
          title: '请求类型',
          key: 'method',
          align: 'center',
          minWidth: 180
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
          minWidth: 200
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
      loading: false
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
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
          this.loading = false
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
    handleSelect () {

    },
    deleteErrors () {

    },
    handleSetBatch () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
