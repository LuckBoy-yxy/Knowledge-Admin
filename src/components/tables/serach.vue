<template>
  <div class="wrapper">
    <template v-if="item.type === 'radio'">
      <RadioGroup
        @on-change="handleChange"
        :value="inputValue"
      >
        <Radio
          v-for="(item, index) in finalRadio"
          :key="'search-radio-' + index"
          :label="item.value"
        >
          <span>{{ item.key }}</span>
        </Radio>
      </RadioGroup>
    </template>

    <template v-else-if="item.type === 'date'">
      <DatePicker
        type="daterange"
        placement="bottom-end"
        placeholder="请选择时间区间"
        style="width: 200px"
        @on-change="handleChange"
      />
    </template>

    <template v-else-if="item.type === 'select'">
      <Select
        v-model="selection"
        multiple
        style="width:260px"
        @on-change="handleChange"
        :value="inputValue"
      >
        <Option
          v-for="(opt, index) in item.options"
          :value="opt.value"
          :key="'selection-' + index"
        >{{ opt.key }}</Option>
      </Select>
    </template>

    <template v-else>
      <Input
        clearable placeholder="输入关键字搜索"
        class="search-input"
        @on-change="handleChange"
        :value="inputValue"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'SearchCom',
  props: {
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      type: [String, Array, Number],
      default: ''
    }
  },
  data () {
    return {
      selection: [],
      radioOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '否',
          value: '0'
        },
        {
          key: '是',
          value: '1'
        }
      ]
    }
  },
  computed: {
    finalRadio () {
      let options = []
      if (this.item.type === 'radio') {
        if (this.item.options && this.item.options.length) {
          options = this.item.options
        } else {
          options = this.radioOptions
        }
      }
      return options
    },
    inputValue () {
      return this.value
    }
  },
  methods: {
    // handleClear (e) {
    //   if (e.target.value === '') this.insideTableData = this.value
    // }
    handleChange (value) {
      // console.log(value)
      this.$emit('chooseEvent', value)
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  display: inline-block;
  margin: 0 10px;
}
</style>
