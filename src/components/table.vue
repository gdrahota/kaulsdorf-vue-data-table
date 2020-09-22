<template>
  <div id="table-wrapper" :class="classList" :style="{ width: getControlWidth, height: controlHeight }">
    <div :style="{ width: getControlWidth, height: rowsAreaHeight }" class="grid-container">
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
            :key="'doc-' + rowIdx"
            :allowShowChildren="allowShowChildren"
            :cell="cell"
            :class="item.oddOrEvenClass"
            :docId="item.id"
            :fixedLeftCols="fixedLeftCols"
            :headers="headers"
            :item="item"
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
            v-for="childIdx of Array.from(Array(item.children).keys())"
            v-if="allowShowChildren && item.children > 0 && showThisChildren[item.id]"
            :key="'child-doc-' + rowIdx + '-' + childIdx"
            :allowShowChildren="allowShowChildren"
            :child="child"
            :childIdx="childIdx"
            :docId="item.id"
            :fixedLeftCols="fixedLeftCols"
            :headers="headers"
            :max-child-cell-height="maxChildCellHeight"
            :rowIdx="rowIdx"
            :rowsAreSelectable="rowsAreSelectable"
          />
        </template>
      </div>
    </div>

    <div v-if="showFooter" id="table-footer">
      <span v-if="showRecordTotalInFooter" id="number-of-records">{{ getNumberOfItems | number }} Zeilen</span>

      <v-pagination
        id="table-pagination"
        v-model="page"
        :length="getPages"
        :total-visible="9"
        circle
      />

      <span id="items-per-page-label">Zeilen pro Seite:</span>
      <span id="items-per-page">
        <v-select
          v-model="itemsPerPageParam"
          :items="[10, 20, 50, 100]"
          hide-details
          style="width: 60px"
        />
      </span>
    </div>
  </div>
</template>

<script>
import HeaderRow from './header-row'
import Row from './row'
import ChildRow from './child-row'

export default {
  components: {
    HeaderRow,
    Row,
    ChildRow,
  },

  computed: {
    controlHeight() {
      return this.fitToSpace ? '100%' : this.height + 'px'
    },
    rowsAreaHeight() {
      const height = this.fitToSpace ? '100%' : this.height + 'px'
      return this.showFooter ? 'calc(' + height + ' - 50px)' : height
    },
    getControlWidth() {
      return this.fitToSpace ? '100%' : this.width ? this.width + 'px' : '100%'
    },
    getHeaderHeight() {
      return typeof this.headerHeight === 'number' ? this.headerHeight : parseInt(this.headerHeight)
    },
    getItems() {
      return this.items.slice((this.page - 1) * this.itemsPerPageParam, this.page * this.itemsPerPageParam)
    },
    getNumberOfItems() {
      return this.numberOfItems ? this.numberOfItems : this.items.length
    },
    getPages() {
      return Math.ceil(this.getNumberOfItems / this.itemsPerPageParam)
    },
  },

  data() {
    return {
      page: 1,
      itemsPerPageParam: this.showFooter ? this.itemsPerPage : -1,
    }
  },

  methods: {
    getLeftPosition(colPosition) {
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
    setItemsPerPage: {
      type: Function,
      default: () => {},
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
      default: false
    },
    rowsAreSelectable: {
      type: Boolean,
      default: false,
    },
    markRowIdFnc: {
      type: Function,
      default: () => {},
    },
    cell: {
      type: Object,
      default: () => {}
    },
    child: {
      type: Object,
      default: () => {}
    },
    headerCell: {
      type: Object,
      default: () => {}
    },
    toggleShowChildren: {
      type: Object,
      default: () => {}
    },
    toggleSelectRow: {
      type: Object,
      default: () => {}
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
    showRecordTotalInFooter: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    numberOfItems: {
      type: Number,
      required: false,
    },
    setPageFnc: {
      type: Function,
      default: () => {},
    }
  },

  watch: {
    itemsPerPage(itemsPerPage) {
      this.itemsPerPageParam = itemsPerPage
    },
    itemsPerPageParam(itemsPerPage) {
      if (this.itemsPerPage !== this.itemsPerPageParam) {
        this.page = 1
        this.setItemsPerPage(itemsPerPage)
      }
    },
    items(newItems, oldItems) {
      if (newItems.length !== oldItems.length) {
        this.page = 1
      }
    },
    page(newPage) {
      console.log('set page', newPage)
      this.setPageFnc(newPage)
    }
  },
}
</script>

<style>
#table-footer {
  background-color: #fff;
  border-top: 2px solid #eee;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  display: flex;
  height: 55px;
  padding-top: 5px !important;
  position: static;
  overflow: hidden;
  width: 100%;
}

#table-footer > span {
  float: left;
  position: relative;
}

#number-of-records {
  padding: 12px 18px;
  width: 170px;
}

#items-per-page-label {
  font-size: 14px;
  padding: 12px 18px;
  text-align: right;
  width: 200px;
}

#items-per-page {
  top: -10px;
  width: 100px;
}

#table-pagination {
  top: -10px;
  left: 0 !important;
}

.grid-container {
  display: grid;
  overflow: auto;
}

.grid > .grid-row {
  float: left;
  clear: left;
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

.is-active {
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
  background-color: rgb(238, 238, 238);
  text-align: right;
  padding: 0;
}
</style>
