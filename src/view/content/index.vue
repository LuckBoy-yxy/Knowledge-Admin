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
        <Button
          style="margin: 10px 0;"
          type="primary"
          @click="exportExcel"
        >导出为Execl文件</Button>

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
      </Row>
    </Card>

    <EditModal
      :item="currentItem"
      :isShow="showEdit"
      @changeEvent="handleStatusChange"
      @eidtEvent="handleItemEdit"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import Tables from '_c/tables'
import EditModal from './components/edit.vue'

import { getTabData, deletePostById, updatePostById } from '@/api/content'

export default {
  name: 'ContentManagement',
  components: {
    Tables,
    EditModal
  },
  data () {
    return {
      columns: [
        {
          title: '标题',
          key: 'title',
          minWidth: 400
        },
        {
          title: '创建时间',
          key: 'created',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD hh:mm:ss'))
            ])
          }
        },
        {
          title: '作者',
          key: 'user',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.uid.name)
            ])
          }
        },
        {
          title: '分类',
          key: 'catalog',
          width: 100,
          align: 'center',
          render: (h, params) => {
            const catalog = params.row.catalog
            let result = ''
            switch (catalog) {
              case 'ask' :
                result = '提问'
                break
              case 'advise' :
                result = '建议'
                break
              case 'discuss' :
                result = '交流'
                break
              case 'share' :
                result = '分享'
                break
              case 'logs' :
                result = '动态'
                break
              case 'notice' :
                result = '公告'
                break
              default:
                result = '全部'
            }
            return h('div', [h('span', result)])
          }
        },
        {
          title: '积分',
          key: 'fav',
          width: 100,
          align: 'center'
        },
        {
          title: '标签',
          key: 'tags',
          width: 120,
          align: 'center',
          render: (h, params) => {
            const result = params.row.tags.map(item => item.name).join(' ,')
            return h('div', [
              h('span', result || '未设置')
            ])
          }
        },
        {
          title: '是否结束',
          key: 'isEnd',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.row.isEnd === '0' ? '是' : '否')])
          }
        },
        {
          title: '阅读记数',
          key: 'reads',
          width: 100,
          align: 'center'
        },
        {
          title: '回答记数',
          key: 'answer',
          width: 100,
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Tag', {
                props: {
                  color: params.row.status === '0' ? 'success' : 'error'
                },
                domProps: {
                  innerHTML: params.row.status === '0' ? 'on' : 'off'
                }
              })
            ])
          }
        },
        {
          title: '是否置顶',
          key: 'isTop',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  color: params.row.isTop === '1' ? '#19be6b' : 'rgba(233, 88, 39)',
                  type: params.row.isTop === '1' ? 'md-checkmark' : 'md-close',
                  size: 20
                }
              })
            ])
          }
        },
        {
          title: '设置',
          fixed: 'right',
          key: 'settings',
          width: 160,
          align: 'center',
          slot: 'action'
        }
      ],
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 40,
      pageArr: [10, 20, 30, 50, 100],
      showEdit: false,
      currentItem: {},
      currentIndex: 0
    }
  },
  methods: {
    _getTabData () {
      getTabData({
        page: this.page - 1,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    },
    onPageChange (page) {
      this.page = page
      this._getTabData()
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
      this._getTabData()
    },
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    handleItemEdit (newValue) {
      this.showEdit = false
      updatePostById(newValue).then(res => {
        if (res.code === 200) {
          // this.tableData[this.currentIndex] = newValue
          this.tableData.splice(this.currentIndex, 1, newValue)
          this.$Message.success(res.msg)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    handleStatusChange (value) {
      this.showEdit = value
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: `确定删除帖子吗?`,
        content: `删除第 ${index + 1} 条, 标题为 ${row.title} 的帖子吗?`,
        onOk: () => {
          deletePostById(row._id).then(res => {
            if (res.code === 200) {
              this.tableData = this.tableData.filter(item => {
                return item._id !== row._id
              })
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
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted () {
    this._getTabData()
  }
}
</script>

<style>

</style>
