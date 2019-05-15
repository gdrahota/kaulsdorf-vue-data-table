<template>
  <v-checkbox
    v-model="selection"
    class="select-control"
    :style="{ top: '-8px', position: 'relative', left: '15px' }"
  ></v-checkbox>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getSelectedRowIds: 'getSelectedRowIds',
      }),
      selection: {
        get () {
          return this.getSelectedRowIds.indexOf(this.docId) > -1
        },
        set () {
          this.toggleSelectedRows(this.docId)
        }
      }
    },

    methods: {
      ...mapMutations({
        toggleSelectedRows: 'toggleSelectedRowsMutation',
      }),
    },

    props: {
      docId: {
        type: [String, Number],
        required: true,
      },
    }
  }
</script>
