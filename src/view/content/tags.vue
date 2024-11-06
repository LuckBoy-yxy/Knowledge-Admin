<template>
  <div>
    <Card>
      <tables
        ref="tables"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
      />
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style="margin-top:10px"
      >
        <Button type="primary" @click="addTag">新建标签</Button>

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
      </Row>
    </Card>

    <AddTagOrEditTag
      :isShow="isShow"
      :isEdit="isEdit"
      :item="currentItem"
      @addEvent="handleAddTag"
      @changeEvent="handleCancel"
    />
  </div>
</template>

<script>
import Tables from '_c/tables'
import AddTagOrEditTag from './addTag-editTag.vue'

import { addTag, getTags, updateTag, removeTag } from '@/api/content'

export default {
  name: 'TagsManagement',
  components: {
    Tables,
    AddTagOrEditTag
  },
  data () {
    return {
      tableData: [],
      columns: [
        {
          title: '序号',
          key: 'sort',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', [h('span', params.index + 1)])
          }
        },
        {
          title: '名称',
          key: 'tagName'
        },
        {
          title: '类名',
          key: 'tagClass',
          align: 'center'
        },
        {
          title: '设置',
          slot: 'action',
          align: 'center',
          key: 'settings'
        }
      ],
      page: 1,
      pageSize: 10,
      total: 0,
      pageArr: [10, 20, 30, 50, 100],
      isShow: false,
      isEdit: false,
      currentItem: {},
      currentIndex: 0
    }
  },
  mounted () {
    this._getTags()
  },
  methods: {
    handleRowEdit (row, index) {
      this.isEdit = true
      this.isShow = true
      this.currentItem = { ...row }
      this.currentIndex = index
    },
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定执行删除吗',
        content: `删除 ${row.tagName} 标签吗`,
        // onOk () {
        //   removeTag(row._id).then(res => {
        //     if (res.code === 200) {
        //       this.$Message.info('标签删除成功')
        //       console.log(this)
        //       this.tableData = this.tableData.filter(item => item._id !== row._id)
        //     }
        //   })
        // },
        onOk: () => {
          removeTag(row._id).then(res => {
            if (res.code === 200) {
              this.tableData = this.tableData.filter(item => item._id !== row._id)
              this.$Message.success(res.msg)
            }
          }).catch(err => {
            this.$Message.info('删除失败, 原因: ' + err)
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    addTag () {
      this.isEdit = false
      this.isShow = true
    },
    onPageChange (page) {
      this.page = page
      this._getTags()
    },
    onPageSizeChange (pageSize) {
      this.pageSize = pageSize
      this._getTags()
    },
    handleAddTag (data) {
      if (this.isEdit) {
        updateTag(data).then(res => {
          if (res.code === 200) {
            this.page = 1
            this.pageSize = 10
            this._getTags()
            this.$Message.success(res.msg)
          } else {
            this.$Message.error(res.msg)
          }
        })
      } else {
        addTag(data).then(res => {
          if (res.code === 200) {
            this.$Message.success(res.msg)
            this.page = 1
            this.pageSize = 10
            this._getTags()
          } else {
            this.$Message.error(res.msg)
          }
        })
      }
      this.isShow = false
      this.isEdit = false
      this.currentItem = {}
    },
    handleCancel () {
      this.isShow = false
      this.isEdit = false
      this.currentItem = {}
    },
    _getTags () {
      getTags({
        page: this.page,
        pageSize: this.pageSize
      }).then(res => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  }
}
</script>

<style>

</style>
