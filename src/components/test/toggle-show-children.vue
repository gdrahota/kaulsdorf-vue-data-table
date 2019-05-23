<template>
  <div>
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
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getAll: 'getAll',
        get: 'get',
        rowCount: 'getRowCount',
      }),
      showChildren () {
        return this.get(this.docId).showChildren
      }
    },

    methods: {
      ...mapMutations({
        toggleShowChildren: 'toggleShowChildrenMutation',
      }),
      toggle () {
        this.toggleShowChildren(this.docId)
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
    },
  }
</script>
