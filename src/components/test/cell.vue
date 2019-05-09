<template>
  <div>
    <v-text-field
      v-if="headerIdx === 0"
      :v-model="data"
      label="label"
      hide-details
      dense
    ></v-text-field>

    <v-btn v-else-if="headerIdx === 1" fab small color="primary">
      <v-icon>check</v-icon>
    </v-btn>

    <v-switch v-else-if="headerIdx === 2" color="primary" v-model="data"/>

    <v-checkbox v-else-if="headerIdx === 3" v-model="data"/>

    <div v-else>
      {{ rowValue(rowIdx, headers[headerIdx].attr) }}
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        rowValue: 'getRowValue',
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
    },
  }
</script>
