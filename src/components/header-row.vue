<template>
  <div class="grid-row grid-item--header">
    <div
      v-if="rowsAreSelectable"
      class="grid-item grid-col--fixed-left grid-item-system"
      :style="{ width: '55px', left: 0, height: headerHeight + 'px' }"
    >
      <component :is="copySelectionToClipboard"/>
    </div>

    <div
      v-if="allowShowChildren"
      class="grid-item grid-col--fixed-left grid-item-system"
      :style="{ width: '111px', left: '55px', height: headerHeight + 'px' }"
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
        :header="header"
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
        left += this.allowShowChildren ? 111 : 0
        for (let i = 0; i <= (colPosition - 1); i++) {
          if (this.fixedLeftCols > i) {
            left += this.headers[i].width
          }
        }
        return left + 'px'
      },
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
      headerCell: {
        type: Object,
        default: () => {
          console.log('headerCell NOT provided to header-row')
        }
      },
      copySelectionToClipboard: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
  }
</script>
