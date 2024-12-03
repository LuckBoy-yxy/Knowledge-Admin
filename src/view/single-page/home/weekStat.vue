<template>
    <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import dayjs from 'dayjs'

const labelOptions = {
  show: true,
  position: 'top',
  distance: 10,
  align: 'center',
  verticalAlign: 'middle',
  rotate: 0,
  formatter: '{c}',
  fontSize: 12
  // rich: {
  //   name: {
  //     textBorderColor: '#fff'
  //   }
  // }
}

export default {
  name: 'serviceRequests',
  props: {
    weekData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    const dataArr = []
    for (let i = 0; i <= 6; i++) {
      dataArr.push(dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD'))
    }
    const seriesArr = []
    Object.keys(this.weekData).forEach(key => {
      let name = ''
      if (key === 'user') {
        name = '新增用户'
      } else if (key === 'sign') {
        name = '签到总数'
      } else if (key === 'post') {
        name = '发帖总数'
      } else if (key === 'comments') {
        name = '回复总数'
      }
      seriesArr.push({
        name: name,
        type: 'bar',
        barGap: 0,
        data: this.weekData[key],
        label: labelOptions
      })
    })

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          // boundaryGap: false,
          axisTick: { show: true },
          // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          data: dataArr
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: seriesArr
      // series: [
      //   {
      //     name: '运营商/网络服务',
      //     type: 'bar',
      //     // stack: '总量',
      //     barGap: 0,
      //     data: [120, 132, 101, 134, 90, 230, 210],
      //     label: labelOptions
      //   },
      //   {
      //     name: '银行/证券',
      //     type: 'bar',
      //     // stack: '总量',
      //     data: [257, 358, 278, 234, 290, 330, 310],
      //     label: labelOptions
      //   },
      //   {
      //     name: '游戏/视频',
      //     type: 'bar',
      //     // stack: '总量',
      //     data: [379, 268, 354, 269, 310, 478, 358],
      //     label: labelOptions
      //   },
      //   {
      //     name: '餐饮/外卖',
      //     type: 'bar',
      //     // stack: '总量',
      //     data: [320, 332, 301, 334, 390, 330, 320],
      //     label: labelOptions
      //   }
      // ]
    }
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
