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
          :cell-height="90"
          :child-cell-height="90"
          fit-to-space
          :fixedLeftCols="1"
          allowShowChildren
          @columnResized="resizeColumn"
          rowsAreSelectable
          :markRowIdFnc="markRowIdMutation"
          :getSelectedRowIdsGetter="getSelectedRowIdsGetter"
          :getDocValueByAttrNameGetter="get"
          :toggleSelectedRowsFnc="toggleSelectedRowsMutation"
          :toggleShowChildrenFnc="toggleShowChildrenMutation"
          :cell="cell"
          :child="child"
        >
          <header-cell
            slot="header"
            slot-scope="{ headers, headerIdx, rowsAreSelectable, allowShowChildren, fixedLeftCols }"
            :headers="headers"
            :headerIdx="headerIdx"
            :rowsAreSelectable="rowsAreSelectable"
            :allowShowChildren="allowShowChildren"
            :fixedLeftCols="fixedLeftCols"
            class="title"
          />

          <row
            slot="row"
            slot-scope="{
              headers,
              rowIdx,
              numOfChildren,
              rowsAreSelectable,
              allowShowChildren,
              fixedLeftCols,
              cellHeight,
              getSelectedRowIdsGetter,
              markRowIdFnc,
              toggleSelectedRowsFnc,
              toggleShowChildrenFnc
              }"
            :headers="headers"
            :rowIdx="rowIdx"
            :numOfChildren="numOfChildren"
            :rowsAreSelectable="rowsAreSelectable"
            :allowShowChildren="allowShowChildren"
            :fixedLeftCols="fixedLeftCols"
            :cellHeight="cellHeight"
            :getSelectedRowIdsGetter="getSelectedRowIdsGetter"
            :markRowIdFnc="markRowIdFnc"
            :toggleSelectedRowsFnc="toggleSelectedRowsFnc"
            :toggleShowChildrenFnc="toggleShowChildrenFnc"
            :getDocValueByAttrNameGetter="getDocValueByAttrNameGetter"
          />

          <cell
            slot="cell"
            slot-scope="{ headers, header, headerIdx, rowIdx, rowsAreSelectable, allowShowChildren, fixedLeftCols, cellHeight, getMarkedRowIdGetter }"
            :headers="headers"
            :header="header"
            :headerIdx="headerIdx"
            :rowIdx="rowIdx"
            :rowsAreSelectable="rowsAreSelectable"
            :allowShowChildren="allowShowChildren"
            :fixedLeftCols="fixedLeftCols"
            :cellHeight="cellHeight"
            :getMarkedRowIdGetter="getMarkedRowIdGetter"
          ></cell>

          <children
            slot="children"
            slot-scope="{ headers, rowIdx, childIdx, rowsAreSelectable, allowShowChildren, fixedLeftCols, childCellHeight }"
            :headers="headers"
            :rowIdx="rowIdx"
            :childIdx="childIdx"
            :rowsAreSelectable="rowsAreSelectable"
            :allowShowChildren="allowShowChildren"
            :fixedLeftCols="fixedLeftCols"
            :childCellHeight="childCellHeight"
          />
        </vue-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import VueTable from '../table'
  import HeaderCell from '../header'
  import Row from '../row'
  import Cell from './cell'
  import Child from './child'
  import children from '../children'

  export default {
    components: {
      children,
      HeaderCell,
      Row,
      VueTable,
    },

    computed: {
      ...mapGetters({
        getAll: 'getAll',
        get: 'get',
        getSelectedRowIdsGetter: 'getSelectedRowIds',
        getMarkedRowIdGetter: 'getMarkedRowId',
      }),
      items () {
        return this.getAll.map(item => {
          return {
            id: item._id,
            children: item.children.length,
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
        headers: [
          { text: 'Head 0', attr: 'a', width: 200, minWidth: 100, },
          { text: 'Head 1', attr: 'b', width: 120, minWidth: 100, },
          { text: 'Head 2', attr: 'c', width: 140, minWidth: 100, },
          { text: 'Head 3', attr: 'd', width: 160, minWidth: 100, },
          { text: 'Head 4', attr: 'e', width: 180, minWidth: 100, },
          { text: 'Head 5', attr: 'f', width: 200, minWidth: 100, },
          { text: 'Head 6', attr: 'g', width: 220, minWidth: 100, },
          { text: 'Head 7', attr: 'h', width: 240, minWidth: 100, },
          { text: 'Head 8', attr: 'i', width: 260, minWidth: 100, },
          { text: 'Head 9', attr: 'j', width: 280, minWidth: 100, },
          { text: 'Head 10', attr: 'k', width: 300, minWidth: 100, },
          { text: 'Head 11', attr: 'l', width: 320, minWidth: 100, },
          { text: 'Head 12', attr: 'm', width: 340, minWidth: 100, },
        ],
      }
    },

    methods: {
      ...mapMutations({
        toggleSelectedRowsMutation: 'toggleSelectedRowsMutation',
        toggleShowChildrenMutation: 'toggleShowChildrenMutation',
        markRowIdMutation: 'markRowIdMutation',
      }),
      resizeColumn ({ col, width }) {
        this.headers[col].width = width
      },
    }
  }
</script>

<style>
  #table-wrapper {
    border: 1px solid #ddd;
    position: relative;
    left: 0px;
    height: calc(100vh - 130px);
    width: calc(100% - 0px);
    background-color: white;
  }

  .title {
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
