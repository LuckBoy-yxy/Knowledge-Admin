<template>
  <div>
    <Row :gutter="10">
      <Col
        span="6"
        :sm="24"
        :md="9"
        :lg="6"
        style="margin-bottom: 10px;"
      >
        <Card dis-hover shadow>
          <Tree
            :isEdit="isEdit"
            :menu="menuData"
            @addMenuEvent="addMenu"
            @editMenuEvent="editMenu"
            @delMenuEvent="deleteMenu"
            @on-select="handleTreeSelect"
          />
        </Card>
      </Col>

      <Col
        span="18"
        :sm="24"
        :md="15"
        :lg="18"
      >
        <Card
          dis-hover
          shadow
          :title="$t('Menu Options')"
          icon="ios-options"
          style="margin-bottom: 10px;"
        >
          <Form
            :item="formData"
            :isEdit="isEdit"
            @submit="submit"
            @cancel="cancel"
          />
        </Card>

        <Card
          dis-hover
          shadow
          :title="$t('Resources')"
          icon="ios-send"
        >
          <OperationsTable
            ref="table"
            :isEdit="isEdit"
            :tableData="tableData"
            :columns="columns"
            @on-change="handelTableAdd"
            @batchSetEvent="handelBatchSet"
          />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Tree from './tree.vue'
import Form from './form.vue'
import OperationsTable from './operations.vue'

import { getMenu, addMenu, updateMenu } from '@/api/admin'

import { sortObj, updateNode, insertNode, deleteNode, getNode } from '../../libs/util'

export default {
  name: 'MenuManagement',
  components: {
    Tree,
    Form,
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      selectNode: [],
      tableData: [],
      seletcion: [],
      type: '',
      menuData: [],
      formData: {},
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '资源名称',
          key: 'name',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '请求类型',
          // key: 'methods',
          key: 'method',
          search: {
            type: 'input'
          },
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.method.toUpperCase())
          }
        },
        {
          title: '资源类型',
          key: 'type',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'api'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          },
          align: 'center'
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
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
      ]
    }
  },
  mounted () {
    window.vue = this
    this._getMenu()
  },
  methods: {
    _getMenu () {
      getMenu().then(res => {
        if (res.code === 200) {
          this.menuData = res.data
        }
      })
    },
    addMenu (type) {
      this.cancel()
      this.isEdit = true
      this.type = type
    },
    editMenu (item) {
      this.isEdit = true
      this.formData = item
    },
    deleteMenu (item) {
      this.menuData = deleteNode(this.menuData, item)
    },
    handleTreeSelect (item) {
      if (item.length === 0) {
        this.formData = {
          // name: '',
          title: '',
          path: '',
          component: '',
          hideInBread: false,
          hideInMenu: false,
          notCache: false,
          icon: '',
          sort: 0,
          redirect: '',
          type: 'menu',
          operations: []
        }
        this.table = []
        return
      }
      if (!this.isEdit) {
        this.selectNode = item
        this.formData = item[0]
        this.tableData = item[0].operations.length ? [...item[0].operations] : []
      } else {
        this.$Message.info('当前为编辑状态, 请取消编辑再查看')
      }
    },
    handelTableAdd (table) {
      this.tableData = table
    },
    handelBatchSet (table) {
      this.$refs.table.cancel()
      this.tableData = table
    },
    submit (data) {
      let parent = getNode(this.menuData, this.selectNode[0])
      if (this.tableData.length > 0) {
        data.operations = this.tableData
      } else {
        data.operations = []
      }
      if (this.type === 'bro') {
        if (this.menuData.length === 0) {
          this.menuData.push(data)
          addMenu(data).then(res => {
            if (res.code === 200) {
              this.$Message.success('菜单添加成功')
            }
          })
        } else {
          const selectNode = this.selectNode[0]
          this.menuData = insertNode(this.menuData, selectNode, data)
          if (parent.nodeKey === selectNode.nodeKey) {
            addMenu(data).then(res => {
              if (res.code === 200) {
                this.$Message.success('菜单添加成功')
              }
            })
          } else {
            parent = getNode(this.menuData, selectNode)
            updateMenu(parent).then(res => {
              if (res.code === 200) {
                this.$Message.success('菜单添加成功')
              }
            })
          }
        }
      } else if (this.type === 'child') {
        if (typeof this.selectNode[0].children === 'undefined') {
          this.$set(this.selectNode[0], 'children', [data])
        } else {
          let arr = [...this.selectNode[0].children, data]
          arr = sortObj(arr, 'sort')
          this.$set(this.selectNode[0], 'children', arr)
        }
        parent = getNode(this.menuData, this.selectNode[0])
        updateMenu(parent).then(res => {
          if (res.code === 200) {
            this.$Message.success('子菜单添加成功')
          }
        })
      } else {
        this.menuData = updateNode(this.menuData, data)
        this.$set(this.selectNode, 0, data)
        parent = getNode(this.menuData, this.selectNode[0])
        updateMenu(parent).then(res => {
          if (res.code === 200) {
            this.$Message.success('子菜单编辑成功')
          }
        })
      }
    },
    cancel () {
      this.type = ''
      this.isEdit = false
      this.formData = {
        name: '',
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        operations: []
      }
      this.tableData = []
    }
  }
}
</script>

<style lang="less" scoped>

</style>
