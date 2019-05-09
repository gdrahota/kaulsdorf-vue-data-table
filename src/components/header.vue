<template>
  <div
    class="grid-item"
    :class="{ 'grid-col--fixed-left': fixedLeftCols > headerIdx }"
    :style="{ width: header.width + 'px', left: getLeftPosition(headerIdx) }"
  >
    {{ header.text }}
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({}),
      header () {
        return this.headers[this.headerIdx]
      }
    },

    methods: {
      getLeftPosition (colPosition) {
        let left = 0
        left += this.rowsAreSelectable ? 110 : 0
        left += this.allowShowChildren ? 55 : 0
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
      headerIdx: {
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
    },
  }
</script>
