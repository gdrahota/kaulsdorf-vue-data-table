<template>
  <div id="table-wrapper" :style="{ width: getControlWidth, 'max-height': getHeight }">
    <div class="grid-container" :style="{ width: getControlWidth, 'max-height': getHeight }" :class="classList">
      <div class="grid" :style="{ 'max-height': getTableHeight }">

        <header-row
          :headers="headers"
          :rowsAreSelectable="rowsAreSelectable"
          :allowShowChildren="allowShowChildren"
          :fixedLeftCols="fixedLeftCols"
          :setHeaderWidthFnc="setHeaderWidthFnc"
          :headerHeight="getHeaderHeight"
          :headerCell="headerCell"
        />

        <template v-for="(item, rowIdx) of getItems">
          <!-- main row -->
          <row
            :key="'doc-' + rowIdx"
            :headers="headers"
            :docId="item.id"
            :rowIdx="rowIdx"
            :numOfChildren="item.children"
            :fixedLeftCols="fixedLeftCols"
            :rowsAreSelectable="rowsAreSelectable"
            :allowShowChildren="allowShowChildren"
            :cellHeight="getCellHeight"
            :markRowIdFnc="markRowIdFnc"
            :cell="cell"
            :toggleSelectRow="toggleSelectRow"
            :toggleShowChildren="toggleShowChildren"
          />

          <!--main row children -->
          <child-row
            v-for="childIdx of Array.from(Array(item.children).keys())"
            v-if="allowShowChildren && item.showChildren && item.children > 0"
            :key="'child-doc-' + rowIdx + '-' + childIdx"
            :headers="headers"
            :rowIdx="rowIdx"
            :docId="item.id"
            :childIdx="childIdx"
            :rowsAreSelectable="rowsAreSelectable"
            :allowShowChildren="allowShowChildren"
            :fixedLeftCols="fixedLeftCols"
            :childCellHeight="getChildCellHeight"
            :child="child"
          />
        </template>
      </div>
    </div>

    <v-layout id="table-footer" wrap row>
      <v-flex>
        <div id="page-of-pages">Seite {{ page }} von {{ getPages }}</div>
        <v-pagination
          v-model="page"
          :length="getPages"
          :total-visible="9"
          circle
        ></v-pagination>
        <div id="items-per-page-label">Zeilen pro Seite</div>
        <v-select
          :items="[10, 20, 50, 100]"
          v-model="itemsPerPageParam"
          solo
          dense
          hide-details
        ></v-select>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import HeaderRow from './header-row'
  import Row from './row'
  import ChildRow from './child-row'

  export default {
    beforeUpdate () {
      console.log('kaulsdorf-vue-data-table => Vue instance beforeUpdate')
    },

    created () {
      this.start = new Date()
      console.log('kaulsdorf-vue-data-table => Vue instance created')
    },

    components: {
      HeaderRow,
      Row,
      ChildRow,
    },

    computed: {
      getHeight () {
        const height = this.fitToSpace ? '100%' : this.height + 'px'
        return 'calc(' + height + ' - 60px)'
      },
      getTableHeight () {
        const height = this.fitToSpace ? '100%' : this.height + 'px'
        return 'calc(' + height + ' - 50px)'
      },
      getControlWidth () {
        return this.fitToSpace ? '100%' : this.width + 'px'
      },
      getCellHeight () {
        return typeof this.cellHeight === "number" ? this.cellHeight + 'px' : this.cellHeight
      },
      getChildCellHeight () {
        return typeof this.childCellHeight === "number" ? this.childCellHeight + 'px' : this.childCellHeight
      },
      getHeaderHeight () {
        return typeof this.headerHeight === "number" ? this.headerHeight : parseInt(this.headerHeight)
      },
      getItems () {
        return this.items.slice((this.page - 1) * this.itemsPerPageParam, this.page * this.itemsPerPageParam)
      },
      getPages () {
        return Math.ceil(this.items.length / this.itemsPerPageParam)
      },
    },

    data () {
      return {
        page: 1,
        start: null,
        itemsPerPageParam: this.itemsPerPage,
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
      handleKeyPress (e) {
        if (this.rowsAreSelectable && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
          this.rowsAreSelectable(this.selected.map(idx => this.items[idx]))
        }
      },
    },

    mounted () {
      window.addEventListener("keydown", this.handleKeyPress, true)
    },

    beforeDestroy () {
      window.removeEventListener("keydown", this.handleKeyPress, true)
    },

    props: {
      headers: {
        type: Array,
        required:
          true
      },
      items: {
        type: Array,
        default:
          () => []
      },
      fitToSpace: {
        type: Boolean,
        default:
          false
      },
      height: {
        type: [Number, String],
        default: 500
      },
      width: {
        type: [Number, String],
        default: 500
      },
      fixedLeftCols: {
        type: Number,
        default: 0
      },
      itemsPerPage: {
        type: Number,
        default: 20
      },
      classList: {
        type: String,
        required:
          false
      },
      cellHeight: {
        type: [Number, String],
        default: 20
      },
      childCellHeight: {
        type: [Number, String],
        default: 20
      },
      headerHeight: {
        type: [Number, String],
        default: 40
      },
      allowShowChildren: {
        type: Boolean,
        default:
          false
      },
      rowsAreSelectable: {
        type: Boolean,
        default: false,
      },
      markRowIdFnc: {
        type: Function,
        default: () => {
          //console.log('markRowIdFnc NOT provided to table')
        },
      },
      setHeaderWidthFnc: {
        type: Function,
        required: false,
      },
      cell: {
        type: Object,
        default: () => {
          //console.log('cell NOT provided to table')
        }
      },
      child: {
        type: Object,
        default: () => {
          //console.log('child NOT provided to table')
        }
      },
      headerCell: {
        type: Object,
        default: () => {
          //console.log('headerCell NOT provided to table')
        }
      },
      toggleShowChildren: {
        type: Object,
        default: () => {
          //console.log('toggleShowChildren NOT provided to table')
        }
      },
      toggleSelectRow: {
        type: Object,
        default: () => {
          //console.log('toggleSelectRow NOT provided to table')
        }
      },
    },
  }
</script>

<style scoped>
  #table-wrapper {
    border: 1px solid #ddd;
    background-color: white;
    height: calc(100vh - 180px);
    left: 0px;
    position: relative;
    width: 100%;
  }

  #table-footer {
    background-color: #eee;
    padding-top: 5px !important;
    position: static;
    height: 65px;
    width: 100%;
    overflow: hidden;
  }

  #paging {
    height: 70px;
    padding: 10px;
    position: relative;
    top: -35px;
    z-index: 10;
    width: 80%;
    white-space: nowrap;
  }

  #page-of-pages,
  #items-per-page-label {
    top: -4px;
    position: relative;
    float: left;
    font-size: 16px;
    height: 70px;
    padding-right: 10px;
    padding-top: 20px;
    text-align: right;
    width: 150px;
  }

  .v-pagination {
    float: left;
    height: 70px;
    position: relative;
    top: -8px;
  }

  .v-input {
    float: left;
    height: 70px;
    position: relative;
    top: 3px;
    width: 100px;
  }
</style>

<style>
  #paging > .page-of-pages {
    float: left;
    font-size: 16px;
    top: -5px !important;
    position: relative;
    padding-left: 20px;
    padding-right: 20px;
  }

  .grid-container {
    display: grid; /* This is a (hacky) way to make the .grid element size to fit its content */
    overflow: auto;
  }

  .grid > .grid-row {
    display: flex;
    flex-wrap: nowrap;
  }

  .grid > .grid-row > * {
    float: left;
  }

  .grid-row.grid-item--header > div {
    border-top: 1px solid grey;
  }

  .grid-item--header {
    resize: horizontal;

    position: sticky !important;
    top: 0 !important;
    z-index: 2 !important;
  }

  .grid-col--fixed-left {
    position: sticky;
    left: 0;
    z-index: 3;
  }

  .grid-item {
    background-color: white;
    border-bottom: 1px solid gray;
    border-left: 1px solid gray;
    overflow: auto;
    resize: none;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .grid-row > .grid-item:first-child {
    border-left: none;
  }

  .grid-row > .grid-item:last-child {
    border-right: 1px solid gray;
  }

  .grid-row:last-child > .grid-item {
    border-bottom: none;
  }

  /* in component toggle-show.children.vue */
  .toggle-show-children > .children-counter {
    float: left;
    background-color: #eee;
    margin: 10px 5px 10px 10px;
    padding: 5px;
    position: inherit;
    text-align: right;
    width: 45px;
  }

  .toggle-show-children > button {
    top: 5px;
  }

  .child-control {
    overflow: hidden;
    padding: unset;
  }

  .drag-handle {
    background-color: red;
    float: right;
    width: 5px;
    cursor: ew-resize;
  }

  .active {
    background-color: aliceblue;
    border: 2px solid #1976d2;
  }

  .number-of-children {
    width: 20px;
    text-align: center;
    position: relative;
    float: left;
  }

  .select-control > * {
    text-align: center;
  }

  .child-row > * {
    background-color: rgba(238, 238, 238, 0.5);
    padding: 15px 10px;
    text-align: right;
  }
</style>
