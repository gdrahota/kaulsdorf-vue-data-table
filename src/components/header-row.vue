<template>
  <div class="grid-row grid-item--header">
    <div
      v-if="rowsAreSelectable"
      class="grid-item grid-col--fixed-left grid-item-system"
      :style="{ width: '55px', left: 0, height: headerHeight + 'px' }"
    ></div>

    <div
      v-if="allowShowChildren"
      class="grid-item grid-col--fixed-left grid-item-system"
      :style="{ width: '110px', left: '55px', height: headerHeight + 'px' }"
    ></div>

    <div
      v-for="(header, headerIdx) of headers"
      :key="headerIdx"
      class="grid-item table-header"
      :id="'header-' + headerIdx"
      :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx }"
      :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx), height: headerHeight + 'px' }"
    >
      <component
        :is="headerCell"
        :headers="headers"
        :headerIdx="headerIdx"
      />
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      header () {
        return this.headers[this.headerIdx]
      }
    },

    methods: {
      getLeftPosition (colPosition) {
        let left = 0
        left += this.rowsAreSelectable ? 55 : 0
        left += this.allowShowChildren ? 110 : 0
        for (let i = 0; i <= (colPosition - 1); i++) {
          if (this.fixedLeftCols > i) {
            left += this.headers[i].width
          }
        }
        return left + 'px'
      },
    },

    mounted () {
      if (this.setHeaderWidthFnc) {
        console.log('setHeaderWidthFnc')
        window.setTimeout(() => {
          this.headers.forEach((header, headerIdx) => {
            const observer = new ResizeObserver(entries => entries.forEach(entry => {
              const width = entry.target.offsetWidth
              const minWidth = header.minWidth

              if (width < minWidth) {
                window.setTimeout(() => window.document.getElementById('header-' + headerIdx).style.width = minWidth + 'px', 200)
                this.setHeaderWidthFnc({ headerIdx: headerIdx, width: minWidth })
              } else {
                this.setHeaderWidthFnc({ headerIdx: headerIdx, width: width })
              }
            }))

            observer.observe(document.querySelector('#header-' + headerIdx))
          })
        }, 1000)
      }
    },

    props: {
      headers: {
        type: Array,
        required: true,
      },
      fixedLeftCols: {
        type: Number,
        required: true,
      },
      headerHeight: {
        type: [Number, String],
        required: true,
      },
      rowsAreSelectable: {
        type: Boolean,
        required: true,
      },
      allowShowChildren: {
        type: Boolean,
        required: true,
      },
      setHeaderWidthFnc: {
        type: Function,
        required: false,
      },
      headerCell: {
        type: Object,
        default: () => {
          console.log('headerCell NOT provided to header-row')
        }
      },
    },
  }
</script>
