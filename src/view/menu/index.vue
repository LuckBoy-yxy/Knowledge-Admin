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
          <Row
            type="flex"
            align="middle"
            justify="center"
          >
            <ButtonGroup class="btn-group">
              <!-- @click="addMenu" -->
              <!-- icon="md-add" -->
              <Button size="small">
                <Dropdown @on-click="addMenu">
                  <a href="javascript:void(0)">
                    <Icon type="md-add"></Icon>
                    <span class="dropdown">新增</span>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="bro">兄弟节点</DropdownItem>
                    <DropdownItem
                      name="child"
                      :disabled="menuData.length === 0"
                    >子节点</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Button>

              <Button
                size="small"
                type="primary"
                icon="ios-create"
                @click="editMenu"
              >编辑</Button>

              <Button size="small" type="error" icon="md-trash">删除</Button>
            </ButtonGroup>
          </Row>

          <Tree :data="menuData" @on-select-change="handleTreeSelect"></Tree>
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
            ref="form"
            :disabled="!isEdit"
            :model="formData"
            :rules="formRules"
            :label-width="80"
          >
            <FormItem label="菜单标题" prop="name">
              <Input
                v-model="formData.name"
                placeholder="请输入菜单名称"
              />
            </FormItem>

            <FormItem label="路径" prop="path">
              <Input
                v-model="formData.path"
                placeholder="请输入菜单路径"
              />
            </FormItem>

            <FormItem label="组件" prop="component">
              <Input
                v-model="formData.component"
                placeholder="请输入前端组件名称"
              >
                <span slot="prepend">()=>import('@/view</span>
                <span slot="append">.vue')</span>
              </Input>
            </FormItem>

            <FormItem label="排序">
              <Input
                v-model="formData.sort"
                placeholder="组件默认排序"
                style="width: 100px"
              />
            </FormItem>

            <FormItem label="面包屑">
              隐藏&nbsp;
              <i-switch
                v-model="formData.hideInBread"
              />
              &nbsp;显示
            </FormItem>

            <FormItem label="菜单类型">
              <Select
                v-model="formData.type"
                placeholder="请选择菜单类型"
                style="width: 200px"
              >
                <Option value="menu">目录</Option>
                <Option value="resource">资源</Option>
              </Select>
            </FormItem>

            <FormItem label="菜单显示">
              隐藏&nbsp;
              <i-switch
                v-model="formData.hideInMenu"
              />
              &nbsp;显示
            </FormItem>

            <FormItem label="缓存">
              不使用&nbsp;
              <i-switch
                v-model="formData.notCache"
              />
              &nbsp;使用
            </FormItem>

            <FormItem label="图标">
              <Input
                v-model="formData.icon"
                placeholder="请输入前端组件名称"
              />
            </FormItem>

            <FormItem label="重定向">
              <Input
                v-model="formData.redirect"
                placeholder="重定向组件"
              />
            </FormItem>

            <FormItem v-if="isEdit">
              <Button type="primary" @click="submit">确定</Button>
              <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </Card>

        <Card
          dis-hover
          shadow
          :title="$t('Resources')"
          icon="ios-send"
        >
          <Tables
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
                @click="handleAdd"
              >
                <Icon type="ios-paper-plane-outline" /> 添加资源
              </Button>
            </template>
          </Tables>

          <Row
            type="flex"
            justify="space-between"
            align="middle"
            style="margin-top: 10px;"
          >
            <Col class="ctrls">
              <Button @click="handleDeleteBath">批量删除</Button>
              <Button style="margin: 0 10px;" @click="handleSetBath">批量设置</Button>
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
      </Col>
    </Row>
  </div>
</template>

<script>
import Tables from '_c/tables'

import { sortObj } from '../../libs/util'

export default {
  name: 'MenuManagement',
  components: {
    Tables
  },
  data () {
    return {
      isEdit: false,
      selectNode: [],
      page: 1,
      pageSize: 10,
      pageArr: [10, 20, 30, 50, 100],
      total: 0,
      tableData: [],
      seletcion: [],
      type: '',
      menuData: [],
      formData: {
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
      },
      formRules: {
        name: [
          { required: true, message: '菜单标题不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '菜单路径不能为空', trigger: 'blur' }
        ],
        component: [
          { required: true, message: '前端组件不得为空', trigger: 'blur' }
        ]
      },
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
          }
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          }
        },
        {
          title: '请求类型',
          key: 'methods',
          search: {
            type: 'input'
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
          }
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
      this.type = type
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.isEdit = true
      } else {
        this.$Message.info('请选择菜单节点后, 再添加')
      }
    },
    editMenu () {
      if (this.selectNode.length > 0) {
        this.isEdit = true
      } else {
        this.$Message.info('请选择菜单节点后, 再编辑')
      }
    },
    handleTreeSelect (item) {
      this.selectNode = item
    },
    onPageChange () {

    },
    onPageSizeChange () {

    },
    handleRowEdit () {

    },
    handleRowRemove () {

    },
    handleDeleteBath () {

    },
    handleSelect () {

    },
    handleSearch () {

    },
    handleAdd () {

    },
    handleSetBath () {

    },
    initFields () {
      this.isEdit = false
      this.$refs.form.resetFields()
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
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            title: this.formData.name,
            ...this.formData,
            expand: true
          }
          if (this.type === 'bro') {
            if (this.menuData.length === 0) {
              this.menuData.push(data)
              // this.isEdit = false
              // this.$refs.form.resetFields()
            } else {
              const selectNode = this.selectNode[0]
              const getMenu = (parent, select) => {
                for (let i = 0; i < parent.length; i++) {
                  const item = parent[i]
                  if (item.name === select.name) {
                    parent.push(data)
                    parent = sortObj(parent, 'sort')
                    return parent
                  } else {
                    if (item.children && item.children.length > 0) {
                      getMenu(item.children, select)
                    }
                  }
                }
                return parent
              }
              this.menuData = getMenu(this.menuData, selectNode)
            }
          } else if (this.type === 'child') {
            if (typeof this.selectNode[0].children === 'undefined') {
              this.$set(this.selectNode[0], 'children', [data])
            } else {
              let arr = [...this.selectNode[0].children, data]
              arr = sortObj(arr, 'sort')
              this.$set(this.selectNode[0], 'children', arr)
              // this.$set(this.selectNode[0], 'children', [
              //   ...this.selectNode[0].children,
              //   data
              // ])
            }
          }
          // this.isEdit = false
          // this.$refs.form.resetFields()
          this.initFields()
        } else {
          this.$Message.error('请检查表单数据')
        }
      })
    },
    cancel () {

    }
  }
}
</script>

<!-- scoped -->
<style lang="less">
@media screen and (max-width: 1200px) {
  .btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }
    .dropdown {
      display: none;
    }
  }
}

.btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
}
</style>
