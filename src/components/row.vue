<template>
  <div
    class="grid-row"
    :style="{ height: cellHeight }"
    :key="'row-' + rowIdx"
    @click="markRowIdFnc(rowIdx)"
  >

    <!-- select row -->
    <select-row
      :docId="docId"
      :cellHeight="cellHeight"
      :toggleSelectRow="toggleSelectRow"
    />

    <!-- show children -->
    <div class="grid-item grid-col--fixed-left toggle-show-children" :style="{ height: cellHeight }">
      <component
        :is="toggleShowChildren"
        v-if="allowShowChildren"
        :rowIdx="rowIdx"
        :docId="docId"
        :numOfChildren="numOfChildren"
        :style="{ width: '110px', left: '55px' }"
        :cellHeight="cellHeight"
        :getDocValueByAttrNameGetter="getDocValueByAttrNameGetter"
        :toggleShowChildrenFnc="toggleShowChildrenFnc"
      />
    </div>

    <!-- data cells -->
    <template v-for="(header, headerIdx) of headers">
      <div
        :key="'cell-' + rowIdx + '-' + headerIdx"
        class="grid-item cell-value"
        :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx, active: getMarkedRowIdGetter === rowIdx }"
        :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx), height: cellHeight }"
      >
        <component
          :is="cell"
          :headers="headers"
          :header="header"
          :headerIdx="headerIdx"
          :rowIdx="rowIdx"
          :docId="docId"
        />
      </div>
    </template>
  </div>
</template>

<script>
  import SelectRow from './select-row'

  export default {
    components: {
      SelectRow,
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

    props: {
      rowIdx: {
        type: Number,
        required: true,
      },
      docId: {
        type: [Number, String],
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
      cellHeight: {
        type: String,
        required: true,
      },
      getMarkedRowIdGetter: {
        type: Number,
      },
      getDocValueByAttrNameGetter: {
        type: Function,
        required: true,
      },
      markRowIdFnc: {
        type: Function,
        default: () => {
          console.log('markRowIdFnc NOT provided to row')
        },
      },
      toggleShowChildrenFnc: {
        type: Function,
        default: () => {
          console.log('toggleShowChildrenFnc NOT provided to row')
        },
      },
      cell: {
        type: Object,
        default: () => {
          console.log('cell NOT provided to row')
        }
      },
      toggleSelectRow: {
        type: Object,
        default: () => {
          console.log('toggleSelectRow NOT provided to row')
        }
      },
      toggleShowChildren: {
        type: Object,
        default: () => {
          console.log('toggleShowChildren NOT provided to row')
        }
      },
    },
  }
</script>
