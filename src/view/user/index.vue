<template>
  <div>
    <Card>
      <tables
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
          <Button @click="handleDeleteBath">批量删除</Button>
          <Button @click="handleSetBath">批量设置</Button>
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
      :roleArr="roles"
      @eidtEvent="handleEdit"
      @changeEvent="handleCancel"
    />

    <Add
      ref="addModel"
      :isShow="showAdd"
      :roleArr="roles"
      @AddEvent="submitAddUser"
      @AddCancelEvent="handleAddCancel"
    />

    <BatchSet
      ref="batchSet"
      :isShow="showSet"
      :roleArr="roles"
      @batchSetEvent="handleBatchSet"
      @batchCencelEvent="handleBatchCancel"
    />
  </div>
</template>

<script>
import Tables from '_c/tables'
import Edit from './edit.vue'
import Add from './add.vue'
import BatchSet from './batchSet.vue'

import dayjs from 'dayjs'

import {
  getUserList,
  updateUserById,
  deleteUserById,
  addUser,
  updateUserBatchById,
  getRoleNames
} from '@/api/admin'

export default {
  name: 'UserManagement',
  // name: 'user_management',
  components: {
    Tables,
    Edit,
    Add,
    BatchSet
  },
  data () {
    return {
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          key: 'name',
          minWidth: 140,
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          key: 'username',
          minWidth: 300,
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '角色',
          key: 'roles',
          align: 'center',
          minWidth: 400,
          render: (h, params) => {
            const roleNames = params.row.roles
              .map(item => this.roleNames[item])
              .join(',')
            return h('div', [
              h('span', roleNames)
            ])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '积分',
          key: 'favs',
          align: 'center',
          minWidth: 150,
          hidden: true
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
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
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
          },
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '否',
                value: '0'
              },
              {
                key: '是',
                value: '1'
              }
            ]
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
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          fixed: 'right',
          width: 160,
          align: 'center',
          slot: 'action',
          hidden: true
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
      showAdd: false,
      selection: [],
      showSet: false,
      option: {},
      roles: []
    }
  },
  computed: {
    roleNames () {
      const tmp = {}
      this.roles.forEach(item => {
        tmp[item.role] = item.name
      })

      return tmp
    }
  },
  mounted () {
    this._getList()
    this._getRoleNames()
  },
  methods: {
    _getList () {
      getUserList({
        page: this.page,
        pageSize: this.pageSize,
        option: this.option
      }).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    _getRoleNames () {
      getRoleNames().then(res => {
        if (res.code === 200) {
          this.roles = res.data
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
          // this.tableData.splice(this.tableData.length, 0, res.data)
          this.tableData.splice(0, 0, res.data)
          this.$Message.success(res.msg)
          this.total++
          this.$refs.addModel.cancel()
        }
      })
    },
    handleAddCancel (value) {
      this.showAdd = value
    },
    handleSelect (selection) {
      this.selection = selection
    },
    handleDeleteBath () {
      if (this.selection.length === 0) {
        return this.$Message.info('请选择需要批量删除的表格数据')
      }
      // const content = this.selection.map(item => (item.username)).join(',')
      this.$Modal.confirm({
        title: '确定要执行批量删除吗?',
        // content: `删除${content}用户`,
        onOk: () => {
          const arr = this.selection.map(item => item._id)
          deleteUserById(arr).then(res => {
            if (res.code === 200) {
              this.tableData = this.tableData.filter(item => !arr.includes(item._id))
              this.$Message.success('批量删除成功')
            }
          })
        },
        onCancel: () => {
          this.$Message.info('取消批量删除')
        }
      })
    },
    handleSetBath () {
      if (this.selection.length === 0) {
        return this.$Message.info('请选择要设置的用户')
      }
      this.showSet = true
    },
    handleBatchSet (formData) {
      this.showSet = false
      const arr = this.selection.map(item => item._id)
      this.$Modal.confirm({
        title: '确定要修改选中用户的设置吗?',
        onOk: () => {
          updateUserBatchById({
            ids: arr,
            formData
          }).then(res => {
            if (res.code === 200) {
              this.tableData = this.tableData.map(item => {
                if (arr.includes(item._id)) {
                  for (let key of Object.keys(formData)) {
                    item[key] = formData[key]
                  }
                }
              })
              this.$Message.info('批量设置成功')
              this.$refs.batchSet.cancel()
            }
          })
        },
        onCanel: () => {
          this.$Message.info('取消批量设置')
        }
      })
    },
    handleBatchCancel (value) {
      this.showSet = value
    },
    handleSearch (value) {
      // this.option === {}
      // if ((this.option.search && this.option.search !== value.search) || Object.keys(this.option).length === 0) {
      if ((typeof this.option.search !== 'undefined' && this.option.search !== value.search) || Object.keys(this.option).length === 0) {
        this.page = 1
      }
      // console.log(this.page)
      this.option = value
      // console.log(this.option)
      this._getList()
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
