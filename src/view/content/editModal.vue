<template>
  <div>
    <Modal
      v-model="showStatus"
      title="编辑帖子"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form :model="localItem" :label-width="80">
        <FormItem label="帖子标题">
          <Input
            v-model="localItem.title"
            placeholder="请输入帖子标题"
          ></Input>
        </FormItem>

        <FormItem label="帖子分类">
          <Select v-model="localItem.catalog">
            <Option value="ask">提问</Option>
            <Option value="advise">建议</Option>
            <Option value="discuss">讨论</Option>
            <Option value="share">分享</Option>
            <Option value="logs">动态Sydney</Option>
            <Option value="notice">公告</Option>
          </Select>
        </FormItem>

        <FormItem label="是否结帖">
          <RadioGroup v-model="localItem.isEnd">
            <Radio label="0">已结帖</Radio>
            <Radio label="1">未结帖</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="回复状态">
          <RadioGroup v-model="localItem.status">
            <Radio label="0">打开回复</Radio>
            <Radio label="1">关闭回复</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="是否置顶">
          <RadioGroup v-model="localItem.isTop">
            <Radio label="0">未置顶</Radio>
            <Radio label="1">已置顶</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="帖子积分">
          <Slider
            v-model="formatFav"
            show-input
            :step="10"
            :max="1000"
          ></Slider>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'EditModal',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        tid: '',
        uid: '',
        title: '',
        content: '',
        created: '',
        catalog: '',
        fav: 0,
        isEnd: '0',
        reads: 0,
        answer: 0,
        status: '0',
        isTop: '0',
        sort: 'created',
        tags: []
      }
    }
  },
  computed: {
    formatFav: {
      get () {
        return +this.localItem.fav
      },
      set (value) {
        this.localItem.fav = value
      }
    }
  },
  methods: {
    ok () {
      this.$emit('eidtEvent', this.localItem)
    },
    cancel () {
      this.$emit('changeEvent', false)
    }
  },
  watch: {
    item (newVal, oldVal) {
      this.localItem = newVal
    },
    isShow (newVal, oldVal) {
      console.log(newVal)
      this.showStatus = newVal
    }
  }
}
</script>
