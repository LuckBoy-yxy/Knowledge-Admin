<template>
  <div>
    <Row
      type="flex"
      align="middle"
      justify="center"
    >
      <ButtonGroup
        class="btn-group"
        :class="{ editing: isEdit }"
      >
        <!-- @click="addMenu" -->
        <!-- icon="md-add" -->
        <Button size="small" :disabled="isEdit">
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
          :disabled="isEdit"
          @click="editMenu"
        >编辑</Button>

        <Button
          size="small"
          type="error"
          icon="md-trash"
          :disabled="isEdit"
          @click="deleteMenu"
        >删除</Button>
      </ButtonGroup>
    </Row>

    <Tree :data="menuData" @on-select-change="handleTreeSelect"></Tree>
  </div>
</template>

<script>
export default {
  name: 'TreeCom',
  props: {
    menu: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectNode: []
    }
  },
  computed: {
    menuData () {
      return this.menu
    }
  },
  methods: {
    handleTreeSelect (item) {
      this.selectNode = item
      this.$emit('on-select', item)
    },
    addMenu (type) {
      if (this.selectNode.length || this.menuData.length === 0) {
        this.$emit('addMenuEvent', type)
      } else {
        this.$Message.info('请选择菜单节点后, 再添加')
      }
    },
    editMenu () {
      if (this.selectNode.length) {
        this.$emit('editMenuEvent', {
          ...this.selectNode[0]
        })
      } else {
        this.$Message.info('请选择菜单节点后, 再编辑')
      }
    },
    deleteMenu () {
      if (this.selectNode.length) {
        this.$Modal.confirm({
          title: '确定要执行删除操作吗?',
          content: `删除 ${this.selectNode[0].title} 菜单节点`,
          onOk: () => {
            this.$emit('delMenuEvent', this.selectNode[0])
            this.selectNode = []
          },
          onCancel: () => {
            this.$Message.info('操作取消')
          }
        })
      } else {
        this.$Message.info('请选择菜单节点后, 再删除')
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
  &.editing {
    a {
      color: #dcdee2;
    }
    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }
    button:first-child {
      border-right: 0;
    }
  }
}
</style>
