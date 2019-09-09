<template>
  <div
    :key="'row-' + rowIdx"
    :style="{ maxHeight: maxCellHeight + 'px' }"
    @click="markRowIdFnc(docId)"
    @mouseenter="setHoveredOverItemFnc(docId)"
    class="grid-row"
  >

    <!-- select row -->
    <div
      :style="{ width: '55px', left: '0' }"
      class="grid-item grid-col--fixed-left"
      v-if="rowsAreSelectable"
    >
      <component
        :docId="docId"
        :is="toggleSelectRow"
      />
    </div>

    <!-- show children -->
    <div
      :docId="docId"
      :style="{ left: '55px' }"
      class="grid-item grid-col--fixed-left toggle-show-children"
      v-if="allowShowChildren"
    >
      <component
        :docId="docId"
        :is="toggleShowChildren"
        :maxCellHeight="maxCellHeight"
        :numOfChildren="numOfChildren"
        :rowIdx="rowIdx"
        :style="{ width: '110px' }"
      />
    </div>

    <!-- data cells -->
    <template v-for="(header, headerIdx) of headers">
      <div
        :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx, 'is-active': getMarkedRowIdGetter === rowIdx }"
        :key="'cell-' + rowIdx + '-' + headerIdx"
        :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx), maxHeight: maxCellHeight + 'px' }"
        class="grid-item cell-value"
      >
        <component
          :docId="docId"
          :header="header"
          :headerIdx="headerIdx"
          :headers="headers"
          :is="cell"
          :item="item"
          :rowIdx="rowIdx"
        />
      </div>
    </template>
  </div>
</template>

<script>
  export default {
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
      rowIdx: {
        type: Number,
        required: true,
      },
      docId: {
        type: [Number, String],
        required: true,
      },
      item: {
        type: Object,
        required: true,
      },
      numOfChildren: {
        type: Number,
        default: 0,
      },
      headers: {
        type: Array,
        default: () => [],
      },
      fixedLeftCols: {
        type: Number,
        default: 0,
      },
      rowsAreSelectable: {
        type: Boolean,
        default: false,
      },
      allowShowChildren: {
        type: Boolean,
        default: false,
      },
      maxCellHeight: {
        type: Number,
        required: true,
      },
      getMarkedRowIdGetter: {
        type: Number,
      },
      markRowIdFnc: {
        type: Function,
        default: () => {
          //console.log('markRowIdFnc NOT provided to row')
        },
      },
      cell: {
        type: Object,
        default: () => {
          //console.log('cell NOT provided to row')
        }
      },
      toggleSelectRow: {
        type: Object,
        default: () => {
          //console.log('toggleSelectRow NOT provided to row')
        }
      },
      toggleShowChildren: {
        type: Object,
        default: () => {
          //console.log('toggleShowChildren NOT provided to row')
        }
      },
      setHoveredOverItemFnc: {
        type: Function,
        default: false,
      },
    },
  }
</script>
