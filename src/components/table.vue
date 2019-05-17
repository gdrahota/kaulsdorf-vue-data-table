<template>
  <div class="grid-container" :style="{ width: getControlWidth, height: getControlHeight }" :class="classList">
    <div class="grid">

      <header-row
        :headers="headers"
        :rowsAreSelectable="rowsAreSelectable"
        :allowShowChildren="allowShowChildren"
        :fixedLeftCols="fixedLeftCols"
        :setHeaderWidthFnc="setHeaderWidthFnc"
        :headerHeight="getHeaderHeight"
        :headerCell="headerCell"
      />

      <template v-for="(item, rowIdx) of items">
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
          :getDocValueByAttrNameGetter="getDocValueByAttrNameGetter"
          :markRowIdFnc="markRowIdFnc"
          :toggleShowChildrenFnc="toggleShowChildrenFnc"
          :cell="cell"
          :toggleSelectRow="toggleSelectRow"
          :toggleShowChildren="toggleShowChildren"
        />

        <!-- main row children -->
        <child-row
          v-if="Array.isArray(item.children) && item.children.length > 0"
          v-for="childIdx of item.children"
          :key="'child-doc-' + rowIdx + '-' + childIdx"
          :headers="headers"
          :rowIdx="rowIdx"
          :docId="item.id"
          :childIdx="childIdx - 1"
          :rowsAreSelectable="rowsAreSelectable"
          :allowShowChildren="allowShowChildren"
          :fixedLeftCols="fixedLeftCols"
          :childCellHeight="getChildCellHeight"
          :getDocValueByAttrNameGetter="getDocValueByAttrNameGetter"
          :child="child"
        />

      </template>
    </div>
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
      console.log('kaulsdorf-vue-data-table => Vue instance created')
    },

    components: {
      HeaderRow,
      Row,
      ChildRow,
    },

    computed: {
      getControlHeight () {
        return this.fitToSpace ? '100%' : this.height + 'px'
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
        type: Number,
        default:
          500
      },
      width: {
        type: Number,
        default:
          1000
      },
      fixedLeftCols: {
        type: Number,
        default:
          0
      },
      classList: {
        type: String,
        required:
          false
      },
      cellHeight: {
        type: [Number, String],
        default:
          20
      },
      childCellHeight: {
        type: [Number, String],
        default:
          20
      },
      headerHeight: {
        type: [Number, String],
        default:
          40
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
      getDocValueByAttrNameGetter: {
        type: Function,
        required: true,
      },
      markRowIdFnc: {
        type: Function,
        default: () => {
          //console.log('markRowIdFnc NOT provided to table')
        },
      },
      toggleShowChildrenFnc: {
        type: Function,
        default: () => {
          //console.log('toggleShowChildrenFnc NOT provided to table')
        },
      },
      setHeaderWidthFnc: {
        type: Function,
        default: () => {
          //console.log('setHeaderWidthFnc NOT provided to table')
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
    },
  }
</script>

<style>
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

  .grid-row > .grid-item:last-child {
    border-right: 1px solid gray;
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

  /*.grid > .grid-col:first-child > div > .grid-item {*/
  /*border-left: 1px solid transparent;*/
  /*}*/

  /*.grid > .grid-col:last-child > div > .grid-item {*/
  /*border-right: 1px solid transparent;*/
  /*}*/

  /*.grid > .grid-col > div > .grid-item:first-child {*/
  /*border-top: 1px solid transparent;*/
  /*}*/

  /*.grid > .grid-col > div > .grid-item:last-child {*/
  /*border-bottom: 1px solid #ddd;*/
  /*}*/

  /*.grid > .grid-col:first-child > .marked > .grid-item {*/
  /*border-left: 1px solid #f73636;*/
  /*}*/

  /*.grid > .grid-col:last-child > .marked > .grid-item {*/
  /*border-right: 1px solid #f73636;*/
  /*}*/

  /*.grid > .grid-col > .marked > .grid-item:first-child {*/
  /*border-top: 1px solid #f73636;*/
  /*}*/

  /*.grid > .grid-col > .marked > .grid-item:last-child {*/
  /*border-bottom: 1px solid #f73636;*/
  /*}*/

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
