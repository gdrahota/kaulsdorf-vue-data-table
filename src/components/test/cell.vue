<template>
  <div>
    <v-text-field
      v-if="headerIdx === 0"
      :value="data"
      label="label"
      hide-details
      dense
      @change="save"
      @click:clear="() => save()"
      clearable
    ></v-text-field>

    <v-btn
      v-else-if="headerIdx === 1"
      fab
      small
      color="primary"
      @click="changeValue"
    >
      <v-icon>check</v-icon>
    </v-btn>

    <v-switch
      v-else-if="headerIdx === 2"
      :value="data"
      @change="save"
      color="primary"
      hide-details
      :true-value="true"
      :false-value="false"
    ></v-switch>

    <v-checkbox
      v-else-if="headerIdx === 3"
      :value="data"
      @change="save"
      hide-details
      :true-value="true"
      :false-value="false"
    ></v-checkbox>

    <v-slider
      v-else-if="headerIdx === 4"
      :value="data"
      inverse-label
      @change="save"
    ></v-slider>

    <div>{{ data }}</div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        rowValue: 'getRowValue',
        getMarkedRowId: 'getMarkedRowId',
      }),
      data: {
        get () {
          return this.rowValue(this.docId, this.header.attr)
        },
        set (value) {
          this.setRowValue({ id: this.docId, attrName: this.header.attr, value })
        }
      }
    },

    methods: {
      ...mapMutations({
        setRowValue: 'setRowValueMutation',
      }),
      changeValue () {
        this.save(Math.round(Math.random() * 100 - 50) + this.data)
      },
      save (value) {
        this.setRowValue({ id: this.docId, attrName: this.header.attr, value })
      },
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
    },
  }
</script>

<style>
  .cell-value {
    padding: 10px;
  }
</style>
