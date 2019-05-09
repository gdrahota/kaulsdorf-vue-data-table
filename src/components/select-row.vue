<template>
  <div
    class="grid-item grid-col--fixed-left"
    :style="{ width: '55px', height: cellHeight }"
  >
    <v-checkbox
      v-model="selection"
      class="select-control"
      :style="{ top: '-8px', position: 'relative', left: '15px' }"
    ></v-checkbox>
  </div>

</template>

<script>
  export default {
    computed: {
      selection: {
        get () {
          return this.getSelectedRowIdsGetter.indexOf(this.docId) > -1
        },
        set () {
          this.toggleSelectedRowsFnc(this.docId)
        }
      }
    },

    props: {
      docId: {
        type: [Number, String],
        required: true,
      },
      cellHeight: {
        type: String,
        required: true,
      },
      getSelectedRowIdsGetter: {
        type: Array,
        default: () => []
      },
      toggleSelectedRowsFnc: {
        type: Function,
        default: () => {}
      },
    }
  }
</script>
