<template>
  <div
    :key="'child-row-' + rowIdx + '-' + childIdx"
    class="grid-row child-row"
    :style="{ maxHeight: maxChildCellHeight + 'px' }"
  >
    <div
      :style="{ width: '55px', left: 0 }"
      class="grid-item grid-col--fixed-left"
      v-if="rowsAreSelectable"
    >
    </div>

    <div
      :style="{ width: '111px', left: '55px' }"
      class="grid-item grid-col--fixed-left"
      v-if="allowShowChildren"
    >
    </div>

    <div
      :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx }"
      :key="'child-cell-' + rowIdx + childIdx + headerIdx"
      :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx), maxHeight: maxChildCellHeight + 'px' }"
      class="grid-item child-value"
      v-for="(header, headerIdx) of headers"
    >
      <component
        :childIdx="childIdx"
        :docId="docId"
        :header="header"
        :headerIdx="headerIdx"
        :headers="headers"
        :is="child"
        :rowIdx="rowIdx"
      ></component>
    </div>

  </div>
</template>

<script>
  export default {
    methods: {
      getLeftPosition (colPosition) {
        let left = 55
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
      rowIdx: {
        type: Number,
        required: true,
      },
      docId: {
        type: [Number, String],
        required: true,
      },
      childIdx: {
        type: Number,
        required: true,
      },
      fixedLeftCols: {
        type: Number,
        required: true,
      },
      rowsAreSelectable: {
        type: Boolean,
        required: true,
      },
      show: {
        type: Boolean,
        required: false,
      },
      allowShowChildren: {
        type: Boolean,
        required: false,
      },
      maxChildCellHeight: {
        type: Number,
        default: 20
      },
      child: {
        type: Object,
        default: () => {
          console.log('child NOT provided to table-row')
        }
      },
    },
  }
</script>
