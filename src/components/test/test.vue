<template>
  <v-card>
    <v-card-text>
      <div id="table-wrapper">
        <vue-table
          :cell="cell"
          :cell-height="110"
          :child="child"
          :child-cell-height="90"
          :fixedLeftCols="0"
          :headerCell="headerCell"
          :headers="headers"
          :height="300"
          :items="items"
          :markRowIdFnc="markRowIdMutation"
          :rowCount="getAll.length"
          :setHeaderWidthFnc="setHeaderWidthMutation"
          :toggleSelectRow="toggleSelectRow"
          :toggleShowChildren="toggleShowChildren"
          :toggleShowChildrenFnc="toggleShowChildrenMutation"
          :width="1200"
          @columnResized="resizeColumn"
          allowShowChildren
          fit-to-space
          rowsAreSelectable
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import VueTable from '../table'
  import HeaderCell from './header'
  import Cell from './cell'
  import Child from './child'
  import ToggleSelectRow from './toggle-select-row'
  import ToggleShowChildren from './toggle-show-children'

  export default {
    components: {
      VueTable,
    },

    computed: {
      ...mapGetters({
        getAll: 'getAll',
        get: 'get',
        headers: 'getHeaders',
        getSelectedRowIdsGetter: 'getSelectedRowIds',
        getMarkedRowIdGetter: 'getMarkedRowId',
      }),
      items () {
        return this.getAll.map(item => {
          return {
            id: item._id,
            children: item.children.length,
            showChildren: item.showChildren,
          }
        })
      }
    },

    beforeUpdate () {
      console.log('beforeUpdate test', new Date())
    },

    created () {
      console.log('created test', new Date())
    },

    data () {
      return {
        cell: Cell,
        child: Child,
        headerCell: HeaderCell,
        toggleSelectRow: ToggleSelectRow,
        toggleShowChildren: ToggleShowChildren,
      }
    },

    methods: {
      ...mapMutations({
        toggleSelectedRowsMutation: 'toggleSelectedRowsMutation',
        toggleShowChildrenMutation: 'toggleShowChildrenMutation',
        markRowIdMutation: 'markRowIdMutation',
        setHeaderWidthMutation: 'setHeaderWidthMutation',
      }),
      resizeColumn ({ col, width }) {
        this.headers[col].width = width
      },
    },
  }
</script>

<style scoped>
  .grid > .grid-row {
    float: left;
    clear: left;
  }

  .table-header {
    background-color: white;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    padding: 10px;
    white-space: nowrap;
  }

  .cell-value.grid-item {
    /*padding: 15px 10px;*/
    text-align: right;
  }

  .grid-row.child > .grid-item.child-value {
    /*padding: 10px;*/
    text-align: right;
  }
</style>
