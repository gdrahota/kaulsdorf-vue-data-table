<template>
  <div
    class="grid-row"
    :style="{ height: cellHeight }"
    :key="'row-' + rowIdx"
    @click="markRowIdFnc(docId)"
  >

    <!-- select row -->
    <div
      v-if="rowsAreSelectable"
      class="grid-item grid-col--fixed-left"
      :style="{ width: '55px', height: cellHeight, left: '0' }"
    >
      <component
        :is="toggleSelectRow"
        :docId="docId"
      />
    </div>

    <!-- show children -->
    <div
      v-if="allowShowChildren"
      class="grid-item grid-col--fixed-left toggle-show-children"
      :style="{ height: cellHeight, left: '55px' }"
      :docId="docId"
    >
      <component
        :is="toggleShowChildren"
        :rowIdx="rowIdx"
        :docId="docId"
        :numOfChildren="numOfChildren"
        :style="{ width: '110px' }"
        :cellHeight="cellHeight"
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
    },
  }
</script>
