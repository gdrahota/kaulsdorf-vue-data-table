<template>
  <div>
    <v-checkbox v-if="headerIdx === 0" v-model="data"/>

    <v-switch v-else-if="headerIdx === 1" color="primary" v-model="data"/>

    <v-btn v-else-if="headerIdx === 2" fab small color="primary">
      <v-icon>check</v-icon>
    </v-btn>

    <v-text-field
      v-else-if="headerIdx === 3"
      :v-model="data"
      label="label"
      hide-details
      dense
    ></v-text-field>

    <div v-else>
      {{ getChildValue(docId, childIdx, header.attr) }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        rowValue: 'getRowValue',
        getChildValue: 'getChildValue',
        getMarkedRowId: 'getMarkedRowId',
      }),
    },

    data () {
      return {
        data: null
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
    },

    props: {
      headers: {
        type: Array,
        required: true,
      },
      header: {
        type: Object,
        required: true,
      },
      headerIdx: {
        type: Number,
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
      getSelectedRowIdsGetter: {
        type: Array,
        default: () => []
      },
    },
  }
</script>
