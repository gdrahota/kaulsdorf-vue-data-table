<template>
  <div :style="{ width: getControlWidth, 'max-height': getHeight }" id="table-wrapper">
    <div :class="classList" :style="{ width: getControlWidth, 'max-height': getHeight }" class="grid-container">
      <div :style="{ 'max-height': getTableHeight }" class="grid">

        <header-row
          :allowShowChildren="allowShowChildren"
          :fixedLeftCols="fixedLeftCols"
          :headerCell="headerCell"
          :headerHeight="getHeaderHeight"
          :headers="headers"
          :rowsAreSelectable="rowsAreSelectable"
          :setHeaderWidthFnc="setHeaderWidthFnc"
        />

        <template v-for="(item, rowIdx) of getItems">
          <!-- main row -->
          <row
            :allowShowChildren="allowShowChildren"
            :cell="cell"
            :cellHeight="getCellHeight"
            :docId="item.id"
            :fixedLeftCols="fixedLeftCols"
            :headers="headers"
            :key="'doc-' + rowIdx"
            :markRowIdFnc="markRowIdFnc"
            :numOfChildren="item.children"
            :rowIdx="rowIdx"
            :rowsAreSelectable="rowsAreSelectable"
            :toggleSelectRow="toggleSelectRow"
            :toggleShowChildren="toggleShowChildren"
          />

          <!--main row children -->
          <child-row
            :allowShowChildren="allowShowChildren"
            :child="child"
            :childCellHeight="getChildCellHeight"
            :childIdx="childIdx"
            :docId="item.id"
            :fixedLeftCols="fixedLeftCols"
            :headers="headers"
            :key="'child-doc-' + rowIdx + '-' + childIdx"
            :rowIdx="rowIdx"
            :rowsAreSelectable="rowsAreSelectable"
            v-for="childIdx of Array.from(Array(item.children).keys())"
            v-if="allowShowChildren && item.children > 0 && showThisChildren[item.id]"
          />
        </template>
      </div>
    </div>

    <v-layout id="table-footer" row wrap>
      <v-flex>
        <div id="total-number">
          <span v-if="items.length === 0"><i>keine Einträge</i></span>
          <span v-else-if="items.length === 1">1 Eintrag</span>
          <span v-else>{{ items.length }} Einträge</span>
        </div>
        <v-pagination
          :length="getPages"
          :total-visible="9"
          circle
          v-model="page"
        ></v-pagination>
        <v-select
          :items="[10, 20, 50, 100]"
          class="items-per-page"
          dense
          hide-details
          solo
          suffix="Einträge pro Seite"
          v-model="itemsPerPageParam"
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
        return this.fitToSpace ? '100%' : this.width ? this.width + 'px' : '100%'
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
        left += this.allowShowChildren ? 111 : 0
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
        required: false,
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
      showThisChildren: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },

    watch: {
      itemsPerPageParam () {
        this.page = 1
      },
      items () {
        this.page = 1
      },
    }
  }
</script>

<style scoped>
  #table-wrapper {
    background-color: white;
    height: calc(100vh - 180px);
    left: 0px;
    position: relative;
    width: 100%;
  }

  #table-footer {
    background-color: #eee;
    border: 1px solid;
    padding-top: 5px !important;
    position: static;
    height: 65px;
    width: 100%;
    overflow: hidden;
  }

  #total-number {
    position: relative;
    float: left;
    font-size: 16px;
    height: 40px;
    padding: 7px 10px;
    text-align: right;
    margin: 8px;
  }

  .items-per-page {
    top: -4px;
    position: relative;
    float: left;
    font-size: 16px;
    height: 70px;
    padding: 8px 10px;
    text-align: right;
    width: 230px;
  }

  .v-pagination {
    float: left;
    height: 70px;
    position: relative;
    top: -8px;
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
    border-bottom: 1px solid grey;
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
    overflow: auto;
    resize: none;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .grid-row:nth-child(even) .grid-item {
    background-color: rgb(241, 241, 241);
  }

  .grid-row > .grid-item:first-child {
    border-left: 1px solid gray;
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
    text-align: right;
    padding: 0;
  }
</style>
