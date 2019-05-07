<template>
  <v-card>
    <v-card-text>
      <div id="table-wrapper">
        <vue-table
          :headers="headers"
          :getRowCb="getRow"
          :rowCount="items.length"
          :width="1200"
          :height="300"
          :cell-height="110"
          :child-cell-height="80"
          fit-to-space
          :fixedLeftCols="1"
          allowChildren
          @columnResized="resizeColumn"
          :selectedRowsCb="selectedRowsCb"
          @toggleSelectCb="item => toggleSelectCb(item)"
          :toggleShowChildrenCb="toggleShowChildren"
        >
          <div slot="header-cell" slot-scope="{ props }" class="title">{{ props.header.text }}</div>
          <cell slot="cell" slot-scope="{ props }" :props="props"/>
        </vue-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import VueTable from './table'
  import Cell from './cell'

  export default {
    components: {
      Cell,
      VueTable,
    },

    data () {
      return {
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
        items: this.getData()
      }
    },

    methods: {
      resizeColumn ({ col, width }) {
        this.headers[col].width = width
      },
      getRow (rowIdx) {
        if (this.items[rowIdx]) {
          return this.items[rowIdx]
        }
        return null
      },
      toggleShowChildren (rowIdx) {
        this.items[rowIdx].showChildren = !this.items[rowIdx].showChildren
      },
      getData () {
        return Array.from(Array(100).keys()).map(() => {
          return {
            a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12,
            showChildren: false,
            children: [
              { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12, },
              { a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, g: 16, h: 17, i: 18, j: 19, k: 110, l: 111, m: 112, },
            ]
          }
        })
      },
      selectedRowsCb (data) {
        console.log('data', data)
      },
      toggleSelectCb () {

      }
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
    background-color: transparent;
  }

  .title {
    background-color: white;
    font-size: 20px;
    font-weight: bold;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    white-space: nowrap;
  }
</style>
