<template>
  <div
    :key="'child-row-' + rowIdx + '-' + childIdx"
    class="grid-row child-row"
  >
    <div
      v-if="rowsAreSelectable"
      class="grid-item grid-item--header grid-col--fixed-left"
      :style="{ width: '55px', left: 0 }"
    >
    </div>

    <div
      v-if="allowShowChildren"
      class="grid-item grid-item--header grid-col--fixed-left"
      :style="{ width: '110px', left: '55px' }"
    >
    </div>

    <div
      v-for="(header, headerIdx) of headers"
      :key="'child-cell-' + rowIdx + childIdx + headerIdx"
      class="grid-item child-value"
      :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx }"
      :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx), height: childCellHeight }"
    >
      <component
        :is="child"
        :headers="headers"
        :header="header"
        :headerIdx="headerIdx"
        :rowIdx="rowIdx"
        :docId="docId"
        :childIdx="childIdx"
      ></component>
    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        get: 'get',
      }),
    },

    methods: {
      getLeftPosition (colPosition) {
        let left = 55
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
      childCellHeight: {
        type: String,
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
      child: {
        type: Object,
        default: () => {
          console.log('child NOT provided to table-row')
        }
      },
    },
  }
</script>
