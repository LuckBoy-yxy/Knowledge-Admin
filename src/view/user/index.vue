<template>
  <div>
    <Card>
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
      />
      <Row
        type="flex"
        justify="space-between"
        align="middle"
      >
        <Col class="ctrls">
          <Button @click="handleSelectAll(true)">批量全选</Button>
          <Button @click="handleSelectAll(false)">取消全选</Button>
          <Button
            style="margin: 10px 0;"
            type="primary"
            @click="exportExcel"
          ><Icon type="md-download"></Icon> 导出表格</Button>
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
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'

// import dayjs from 'dayjs'

export default {
  name: 'UserManagement',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '用户昵称',
          key: 'user',
          minWidth: 140
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 140
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 30
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          minWidth: 60
        },
        {
          title: '是否禁用',
          key: 'status',
          align: 'center',
          minWidth: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status === '0' ? '否' : '是')
            ])
          }
        },
        {
          title: '是否是会员',
          key: 'isVip',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.isVip === '0' ? '否' : '是')
            ])
          }
        },
        {
          title: '创建时间',
          key: 'created',
          minWidth: 140
        },
        {
          title: '设置',
          key: 'settings',
          fixed: 'right',
          width: 160,
          align: 'center',
          slot: 'action'
        }
      ],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100]
    }
  },
  methods: {
    onPageChange (page) {

    },
    onPageSizeChange (pageSize) {

    },
    handleRowEdit (row, index) {

    },
    handleRowRemove (row, index) {

    },
    handleSelectAll () {

    },
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
