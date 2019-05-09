<template>
  <div class="grid-item grid-col--fixed-left toggle-show-children" :style="{ height: cellHeight }">
    <span class="children-counter" v-text="numOfChildren"></span>
    <v-btn
      icon
      outline
      small
      @click="toggle"
    >
      <v-icon v-if="showChildren">expand_less</v-icon>
      <v-icon v-else>chevron_right</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getAll: 'getAll',
        get: 'get',
        rowCount: 'getRowCount',
      }),
      showChildren () {
        return this.getDocValueByAttrNameGetter(this.docId).showChildren
      }
    },

    methods: {
      toggle () {
        this.toggleShowChildrenFnc(this.docId)
      }
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
        required: true,
      },
      cellHeight: {
        type: String,
        required: true,
      },
      toggleShowChildrenFnc: {
        type: Function,
        default: () => {
          console.log('toggleShowChildrenFnc NOT provided to toggle-show-children')
        },
      },
      getDocValueByAttrNameGetter: {
        type: Function,
        required: true,
      },
    },
  }
</script>
