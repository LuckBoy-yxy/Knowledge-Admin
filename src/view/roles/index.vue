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
              >{{ item.title }}</div>
              <span>
                <Icon
                  type="md-build"
                  size="18"
                  color="#2d8cf0"
                  @click.stop="editRole(item, index)"
                />
                <Icon
                  type="md-trash"
                  ize="20"
                  color="#ed4014"
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
      v-model="showAdd"
      title="添加角色"
      @on-ok="modalSubmit"
      @on-cancel="modalCancel"
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

export default {
  name: 'MenuManagement',
  components: {
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      showAdd: false,
      selectNode: [],
      roleIndex: '',
      menuData: [],
      roles: [
        { title: 'parent1' },
        { title: 'parent2' },
        { title: 'parent3' },
        { title: 'parent4' },
        { title: 'parent5' }
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
    selectRole (index) {
      if (this.roleIndex === '' || this.roleIndex !== index) {
        this.roleIndex = index
      } else {
        this.roleIndex = ''
      }
    },
    addRole () {
      this.showAdd = true
    },
    editRole (role, index) {
      this.isEdit = true
      this.roleIndex = index
      console.log(role, index)
    },
    submit () {
      this.isEdit = false
    },
    cancel () {
      this.isEdit = false
    },
    modalSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log('1111')
        }
      })
    },
    modalCancel () {
      this.showAdd = false
    },
    handleTreeSelect (item) {
      if (item.length === 0) {
        this.table = []
        return
      }
      this.selectNode = item
      this.tableData = item[0].operations.length ? [...item[0].operations] : []
    },
    handelTableChange (table) {
      this.tableData = table
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
    i:first-child {
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
