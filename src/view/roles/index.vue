<template>
  <div>
    <Row :gutter="10">
      <Col span="5">
        <Card dis-hover shadow>
          <p slot="title">
            <Icon type="md-contacts"></Icon>
            {{ $t('Role List') }}
          </p>
          <a
            v-if="!isEdit"
            slot="extra"
            @click.prevent="addRole"
          >
            <Icon type="md-add"></Icon>新增
          </a>
          <ul class="my-card">
            <li
              v-for="(item, index) in roles"
              :key="'roles' + index"
              class="flex"
              :class="[ roleIndex === index ? 'selected' : '']"
              @click="selectRole(index)"
            >
              <div
                class="flex1 round"
              >{{ item.name }}</div>
              <span>
                <Icon
                  type="md-create"
                  size="16"
                  color="#17233d"
                  @click.stop="editLabel(item, index)"
                />
                <Icon
                  type="md-build"
                  size="16"
                  color="#2d8cf0"
                  @click.stop="editRole(item, index)"
                />
                <Icon
                  type="md-trash"
                  ize="16"
                  color="#ed4014"
                  @click.stop="deleteRole(item, index)"
                />
              </span>
            </li>
          </ul>
        </Card>
      </Col>

      <Col span="6">
        <Card
          dis-hover
          shadow
          :title="$t('Menu Permission')"
          icon="md-apps"
        >
          <div slot="extra">
            <ButtonGroup
              class="btn-group"
              v-if="isEdit"
            >
              <Button
                size="small"
                type="primary"
                icon="ios-create"
                @click="submit"
              >确定</Button>

              <Button
                size="small"
                icon="md-trash"
                @click="cancel"
              >取消</Button>
            </ButtonGroup>
          </div>

          <Tree
            :data="menuData"
            show-checkbox
            @on-select-change="handleTreeSelect"
            @on-check-change="handleTreeChecked"
          />
        </Card>
      </Col>

      <Col span="13">
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
            @on-change="handelTableChange"
          />
        </Card>
      </Col>
    </Row>

    <Modal
      :loading="loading"
      v-model="showModal"
      :title="type ? '编辑角色' : '添加角色'"
      @on-ok="modalSubmit"
      @on-cancel="initForm"
    >
      <Form
        ref="form"
        :model="formData"
        :label-width="80"
        :rules="formRules"
      >
        <FormItem label="角色名称" prop="name">
          <Input
            v-model="formData.name"
            placeholder="请输入角色名称"
          />
        </FormItem>

        <FormItem label="角色编码" prop="role">
          <Input
            v-model="formData.role"
            placeholder="请输入角色编码"
          />
        </FormItem>

        <FormItem label="角色描述">
          <Input
            v-model="formData.desc"
            placeholder="请输入角色描述"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import OperationsTable from './operations.vue'

import { getMenu } from '@/api/admin'

import { modifyNode, getPropertyIds } from '@/libs/util'

export default {
  name: 'MenuManagement',
  components: {
    OperationsTable
  },
  data () {
    return {
      type: false,
      loading: true,
      isEdit: false,
      showModal: false,
      selectNode: [],
      editIndex: '',
      roleIndex: '',
      menuData: [],
      roles: [
        {
          name: '超级管理员',
          role: 'super_admin',
          menu: [
            '673c7bf7dbfd00656f1a4a2c',
            '6742b9f32d5df79d7eeb55ea',
            '6742b9f32d5df79d7eeb55eb',
            '6742e2112d5df79d7eeb5721'
          ]
        }
      ],
      formData: {
        name: '',
        role: '',
        desc: ''
      },
      formRules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ]
      },
      tableData: [],
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
        }
      ]
    }
  },
  mounted () {
    window.vue = this
    this._getMenu()
    localStorage.setItem('menuData', false)
  },
  beforeDestroy () {
    localStorage.setItem('menuData', false)
  },
  methods: {
    _getMenu () {
      getMenu().then(res => {
        if (res.code === 200) {
          this.menuData = res.data
          // localStorage.setItem('menuData', JSON.stringify(this.menuData))
        }
      })
    },
    selectRole (index) {
      if (this.roleIndex === '' || this.roleIndex !== index) {
        this.roleIndex = index
        const tmpData = modifyNode(
          this.menuData,
          this.roles[index].menu,
          'checked',
          true
        )
        localStorage.setItem('menuData', JSON.stringify(tmpData))
        if (this.selectNode.length > 0 && this.selectNode[0].operations) {
          this.tableData = this.selectNode[0].operations
        }
      } else {
        modifyNode(this.menuData, null, 'checked', false)
        this.tableData = []
        this.roleIndex = ''
      }
    },
    addRole () {
      this.showModal = true
    },
    editRole (role, index) {
      this.isEdit = true
      this.roleIndex = index
    },
    editLabel (role, index) {
      this.type = true
      this.editIndex = index
      this.showModal = true
      this.formData = { ...role }
    },
    deleteRole (role, index) {
      this.$Modal.confirm({
        title: '确定执行删除吗?',
        content: `删除 ${role.name} 角色吗`,
        onOk: () => {
          // this.roles = this.roles.filter(item => (item.name !== role.name))
          this.roles.splice(index, 1)
          this.$Message.success('删除角色成功')
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    submit () {
      this.isEdit = false
      this.roles[this.roleIndex].menu = getPropertyIds(
        this.menuData,
        ['children', 'operations']
      )
      localStorage.setItem('menuData', JSON.stringify(this.menuData))
    },
    cancel () {
      this.isEdit = false
      const tmpData = JSON.parse(localStorage.getItem('menuData'))
      if (tmpData && typeof tmpData !== 'undefined') {
        this.menuData = tmpData
        this.tableData = []
        this.selectNode = []
      }
    },
    modalSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = false
          if (this.type) {
            this.roles.splice(this.editIndex, 1, { ...this.formData })
            this.$Message.success('编辑角色成功')
          } else {
            this.roles.push({ ...this.formData })
            this.$Message.success('新增角色成功')
          }
          setTimeout(() => {
            this.initForm()
          }, 0)
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查表单数据')
        }
      })
    },
    initForm () {
      this.showModal = false
      this.type = false
      this.formData = {
        name: '',
        role: '',
        desc: ''
      }
      this.$refs.form.resetFields()
    },
    handleTreeSelect (item) {
      if (item.length === 0) {
        this.tableData = []
        return
      }

      this.selectNode = item
      this.tableData = item[0].operations.length ? [...item[0].operations] : []
    },
    handleTreeChecked (item) {
      if (!this.isEdit) {
        const tmpData = JSON.parse(localStorage.getItem('menuData'))
        if (typeof tmpData !== 'undefined') {
          if (tmpData) {
            this.menuData = tmpData
          } else {
            this.menuData = modifyNode(this.menuData, null, 'checked', false)
          }
        }
        this.$Message.info('当前并不是编辑状态, 请选择角色进行编辑')
      }
    },
    handelTableChange (table) {
      // this.selectNode[0].operations = table
      const ids = table.map(item => item._id)
      if (this.selectNode.length > 0 && this.selectNode[0].operations) {
        this.selectNode[0].operations.forEach(item => {
          if (!ids.includes(item._id)) {
            item._checked = false
          } else {
            item._checked = true
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-card {
  li {
    list-style: none;
    line-height: 24px;
  }
  span {
    // float: right;
    display: none;
    i {
      margin-right: 5px;
    }
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row nowrap;
    &.flex1 {
      flex: 1;
    }
    &:hover {
      span {
        display: block;
      }
      .flex1 {
        cursor: pointer;
        background-color: #eaf4fe;
      }
    }
    &.selected {
      .flex1 {
        background-color: #d5e8fc;
      }
    }
  }
  .round {
    padding:  1px 2px;
    border-radius: 3px;
  }
}
</style>
