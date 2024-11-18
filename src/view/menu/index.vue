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
            :isEdit="isEdit"
            :tableData="tableData"
            :columns="columns"
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

import { sortObj, updateNode, insertNode, deleteNode } from '../../libs/util'

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
  methods: {
    addMenu (type) {
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
      this.selectNode = item
    },
    submit (data) {
      if (this.type === 'bro') {
        if (this.menuData.length === 0) {
          this.menuData.push(data)
        } else {
          const selectNode = this.selectNode[0]
          this.menuData = insertNode(this.menuData, selectNode, data)
        }
      } else if (this.type === 'child') {
        if (typeof this.selectNode[0].children === 'undefined') {
          this.$set(this.selectNode[0], 'children', [data])
        } else {
          let arr = [...this.selectNode[0].children, data]
          arr = sortObj(arr, 'sort')
          this.$set(this.selectNode[0], 'children', arr)
        }
      } else {
        this.menuData = updateNode(this.menuData, data)
        this.$set(this.selectNode, 0, data)
      }
    },
    cancel () {
      this.type = ''
      this.isEdit = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
