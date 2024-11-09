<template>
  <div>
    <Card>
      <!--
        editable
        searchable
        search-place="top"
      -->
      <tables
        ref="tables"
        editable
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
      >
        <template v-slot:table-header>
          <Button
            class="search-btn"
            type="primary"
            @click="handleAddUser"
          >
            <Icon type="md-person-add" />
            添加用户
          </Button>
        </template>
      </tables>

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

    <Edit
      :isShow="isShow"
      :item="currentItem"
      @eidtEvent="handleEdit"
      @changeEvent="handleCancel"
    />

    <Add
      :isShow="showAdd"
      @AddEvent="submitAddUser"
      @AddCancelEvent="handleAddCancel"
    />
  </div>
</template>

<script>
import Tables from '_c/tables'
import Edit from './edit.vue'
import Add from './add.vue'

import dayjs from 'dayjs'

import {
  getUserList,
  updateUserById,
  deleteUserById,
  addUser
} from '@/api/admin'

export default {
  name: 'UserManagement',
  components: {
    Tables,
    Edit,
    Add
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
          key: 'name',
          minWidth: 140,
          align: 'center'
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 300,
          align: 'center'
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 400,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.roles.join(','))
            ])
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          minWidth: 150
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
          minWidth: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          }
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
      pageArr: [10, 20, 30, 50, 100],
      isShow: false,
      currentItem: {},
      currentIndex: 0,
      showAdd: false
    }
  },
  mounted () {
    this._getList()
  },
  methods: {
    _getList () {
      getUserList({
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
      this._getList()
    },
    handleRowEdit (row, index) {
      this.isShow = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    handleCancel (value) {
      this.isShow = value
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: `确定删除此用户吗?`,
        content: `删除 ${row.name} 用户吗?`,
        onOk: () => {
          deleteUserById(row._id).then(res => {
            if (res.code === 200) {
              // this.tableData = this.tableData.filter(item => {
              //   return item._id !== row._id
              // })
              // this.tableData.splice(this.currentIndex, 1)
              this.tableData.splice(index, 1)
              this.$Message.success('删除成功')
            }
          }).catch(err => {
            console.log(err)
            this.$Message.error('删除失败')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    handleEdit (value) {
      this.isShow = false
      updateUserById(value).then(res => {
        if (res.code === 200) {
          this.tableData.splice(this.currentIndex, 1, value)
          this.$Message.success(res.msg)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    handleAddUser () {
      this.showAdd = true
    },
    submitAddUser (formData) {
      this.showAdd = false
      addUser(formData).then(res => {
        if (res.code === 200) {
          this.tableData.splice(this.tableData.length, 0, res.data)
          this.$Message.success(res.msg)
          this.total++
        }
      })
    },
    handleAddCancel (value) {
      this.showAdd = value
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
