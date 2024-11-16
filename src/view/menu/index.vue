<template>
  <div>
    <Row :gutter="10">
      <Col
        span="5"
        :sm="24"
        :md="9"
        :lg="5"
        style="margin-bottom: 10px;"
      >
        <Card dis-hover shadow>
          <Tree :data="data1"></Tree>
        </Card>
      </Col>

      <Col
        span="19"
        :sm="24"
        :md="15"
        :lg="19"
      >
        <Card
          dis-hover
          shadow
          :title="$t('Menu Options')"
          icon="ios-options"
          style="margin-bottom: 10px;"
        >
          <Form
            ref="formValidate"
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

            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
            </FormItem>
          </Form>
        </Card>

        <Card
          dis-hover
          shadow
          :title="$t('Resources')"
          icon="ios-send"
        >
          <Table border ref="selection" :columns="columns4" :data="data2"></Table>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'MenuManagement',
  data () {
    return {
      data1: [
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
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data2: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
