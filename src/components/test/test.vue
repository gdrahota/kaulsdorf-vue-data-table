<template>
  <v-card>
    <v-card-text>
      <div id="table-wrapper">
        <vue-table
          :headers="headers"
          :items="items"
          :rowCount="getAll.length"
          :width="1200"
          :height="300"
          :cell-height="110"
          :child-cell-height="90"
          fit-to-space
          :fixedLeftCols="0"
          allowShowChildren
          @columnResized="resizeColumn"
          rowsAreSelectable
          :markRowIdFnc="markRowIdMutation"
          :toggleShowChildrenFnc="toggleShowChildrenMutation"
          :setHeaderWidthFnc="setHeaderWidthMutation"
          :cell="cell"
          :child="child"
          :headerCell="headerCell"
          :toggleSelectRow="toggleSelectRow"
          :toggleShowChildren="toggleShowChildren"
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
  /*#table-wrapper {*/
    /*border: 1px solid #ddd;*/
    /*background-color: white;*/
    /*height: calc(100vh - 200px);*/
    /*left: 0px;*/
    /*position: relative;*/
    /*width: 100%;*/
  /*}*/

  .table-header {
    background-color: white;
    font-size: 16px;
    font-weight: bold;
    overflow: hidden;
    padding: 10px;
    white-space: nowrap;
  }

  .cell-value.grid-item {
    padding: 15px 10px;
    text-align: right;
  }

  .grid-row.child > .grid-item.child-value {
    padding: 10px;
    text-align: right;
  }
</style>
