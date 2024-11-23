<template>
  <div>
    <Row :gutter="10">
      <Col span="5">
        <Card dis-hover shadow>
          <p slot="title">
            <Icon type="md-contacts"></Icon>
            角色列表
          </p>
          <a href="#" slot="extra">
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
                <Icon type="md-build" size="18" color="#2d8cf0" />
                <Icon type="md-trash" size="20" color="#ed4014" />
              </span>
            </li>
          </ul>
        </Card>
      </Col>

      <Col span="6">
        <Card dis-hover shadow>
          <Tree :data="menuData" show-checkbox></Tree>
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
            @batchSetEvent="handelBatchSet"
          />
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import OperationsTable from '@/view/menu/operations.vue'

export default {
  name: 'MenuManagement',
  components: {
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      selectNode: [],
      roleIndex: '',
      menuData: [
        {
          title: 'parent 1',
          expand: true,
          children: [
            {
              title: 'parent 1-1',
              expand: true,
              children: [
                {
                  title: 'leaf 1-1-1'
                },
                {
                  title: 'leaf 1-1-2'
                }
              ]
            },
            {
              title: 'parent 1-2',
              expand: true,
              children: [
                {
                  title: 'leaf 1-2-1'
                },
                {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }
      ],
      roles: [
        { title: 'parent1' },
        { title: 'parent2' },
        { title: 'parent3' },
        { title: 'parent4' },
        { title: 'parent5' }
      ],
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
  methods: {
    selectRole (index) {
      if (this.roleIndex === '' || this.roleIndex !== index) {
        this.roleIndex = index
      } else {
        this.roleIndex = ''
      }
    },
    addMenu () {

    },
    editMenu () {

    },
    deleteMenu () {

    },
    handleTreeSelect (item) {
      if (item.length === 0) {
        this.table = []
        return
      }
      if (!this.isEdit) {
        this.selectNode = item
        this.tableData = item[0].operations.length ? [...item[0].operations] : []
      } else {
        this.$Message.info('当前为编辑状态, 请取消编辑再查看')
      }
    },
    handelTableChange (table) {
      this.tableData = table
    },
    handelBatchSet () {

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
