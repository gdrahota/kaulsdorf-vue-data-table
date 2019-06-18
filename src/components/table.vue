<template>
  <div :style="{ width: getControlWidth, 'max-height': getHeight }" id="table-wrapper">
    <div :class="classList" :style="{ width: getControlWidth, 'max-height': getHeight }" class="grid-container">
      <div class="grid">

        <header-row
          :allowShowChildren="allowShowChildren"
          :copySelectionToClipboard="copySelectionToClipboard"
          :fixedLeftCols="fixedLeftCols"
          :headerCell="headerCell"
          :headerHeight="getHeaderHeight"
          :headers="headers"
          :rowsAreSelectable="rowsAreSelectable"
        />

        <template v-for="(item, rowIdx) of getItems">
          <!-- main row -->
          <row
            :allowShowChildren="allowShowChildren"
            :cell="cell"
            :docId="item.id"
            :fixedLeftCols="fixedLeftCols"
            :headers="headers"
            :key="'doc-' + rowIdx"
            :markRowIdFnc="markRowIdFnc"
            :maxCellHeight="maxCellHeight"
            :numOfChildren="item.children"
            :rowIdx="rowIdx"
            :rowsAreSelectable="rowsAreSelectable"
            :setHoveredOverItemFnc="setHoveredOverItemFnc"
            :toggleSelectRow="toggleSelectRow"
            :toggleShowChildren="toggleShowChildren"
          />

          <!--main row children -->
          <child-row
            :allowShowChildren="allowShowChildren"
            :child="child"
            :childIdx="childIdx"
            :docId="item.id"
            :fixedLeftCols="fixedLeftCols"
            :headers="headers"
            :key="'child-doc-' + rowIdx + '-' + childIdx"
            :maxChildCellHeight="maxChildCellHeight"
            :rowIdx="rowIdx"
            :rowsAreSelectable="rowsAreSelectable"
            v-for="childIdx of Array.from(Array(item.children).keys())"
            v-if="allowShowChildren && item.children > 0 && showThisChildren[item.id]"
          />
        </template>
      </div>
    </div>

    <v-layout class="elevation-2" id="table-footer" row wrap>
      <v-flex>
        <div class="label">Zeilen pro Seite:</div>
        <v-select
          :items="[10, 20, 50, 100]"
          class="items-per-page"
          dense
          hide-details
          solo-
          v-model="itemsPerPageParam"
        ></v-select>
        <v-pagination
          :length="getPages"
          :total-visible="9"
          circle
          v-model="page"
        ></v-pagination>
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
      maxCellHeight: {
        type: Number,
        default: 50
      },
      maxChildCellHeight: {
        type: Number,
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
      copySelectionToClipboard: {
        type: Object,
        default: () => {
          return {}
        },
      },
      setHoveredOverItemFnc: {
        type: Function,
        default: () => {},
      },
    },

    watch: {
      itemsPerPageParam () {
        this.page = 1
      },
      items () {
        this.page = 1
      },
    },
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
    background-color: #fff;
    border-top: 2px solid #eee;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    padding-top: 5px !important;
    position: static;
    height: 55px;
    width: 100%;
    overflow: hidden;
  }

  #table-footer > .flex > * {
    float: left;
    height: 100%;
  }

  #table-footer > .flex > div.label {
    position: relative;
    top: 14px;
    left: 20px;
  }

  .items-per-page {
    top: -15px;
    position: relative;
    float: left;
    font-size: 16px;
    padding: 8px 30px 0 8px;
    text-align: right;
    width: 100px;
    left: 20px;
  }

  .v-pagination {
    float: left;
    height: 70px;
    position: relative;
    top: -8px;
    left: 200px;
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
    border-bottom: 2px solid blue;
    border-top: none;
  }

  .grid-row > .grid-item:first-child {
    border-left: none;
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
    background-color: rgb(247, 247, 247);
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
