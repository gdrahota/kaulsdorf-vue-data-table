<template>
  <div
    v-if="show"
    :key="'row-child-' + childIdx + '-' + rowIdx"
    class="grid-row child"
    :style="{ height: childCellHeight }"
  >
    <div
      v-if="rowsAreSelectable"
      class="grid-item grid-col--fixed-left"
      :style="{ width: '55px', left: 0 }"
    ></div>

    <div
      v-if="allowShowChildren"
      class="grid-item grid-col--fixed-left"
      :style="{ width: '110px', left: '55px' }"
    ></div>

    <div
      v-for="(header, headerIdx) of headers"
      :key="'child-cell-' + rowIdx + childIdx + headerIdx"
      class="grid-item child-value"
      :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx }"
      :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx), height: childCellHeight }"
    >
      <!--{{ value(header) }}-->
      <component :is="child"
      ></component>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        get: 'get',
      }),
      show () {
        const row = this.get(this.rowIdx)
        return row.showChildren
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
      value (header) {
        const row = this.get(this.rowIdx)
        const children = row.children
        return children[this.childIdx][header.attr]
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
      allowShowChildren: {
        type: Boolean,
        required: true,
      },
      childCellHeight: {
        type: String,
        required: true,
      },
      child: {
        type: Object,
        default: () => {
          console.log('child NOT provided to children')
        }
      },
    },
  }
</script>
