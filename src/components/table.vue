<template>
  <div class="grid-container" :style="{ width: getControlWidth, height: getControlHeight }" :class="classList">
    <div class="grid">
      <template v-if="selectedRowsCb">
        <div
          class="grid-col grid-col--fixed-left"
          :style="{ width: '50px', minWidth: '50px', left: 0 }"
        >
          <div class="grid-item grid-item--header" :style="{ height: getHeaderHeight + 'px', padding: '10px' }"></div>

          <div
            v-for="rowIdx of rowCount"
            :key="'showSelect-' + rowIdx"
            @click="() => markRow(rowIdx)"
            :class="{ marked: marked === rowIdx }"
          >
            <div class="grid-item select-control" :style="{ height: getCellHeight, padding: '10px' }">
              <v-checkbox
                v-model="selected"
                :value="rowIdx"
                :style="{ top: '-18px', position: 'relative' }"
              ></v-checkbox>
            </div>
            <template v-if="getValueOfRow(rowIdx, 'showChildren')">
              <div
                v-for="(child, childPos) of getChildren(rowIdx)"
                :key="'child-' + childPos"
                class="grid-item child"
                :style="{ height: getChildCellHeight, padding: '10px' }"
              ></div>
            </template>
          </div>
        </div>
      </template>

      <template v-if="allowChildren">
        <div
          class="grid-col grid-col--fixed-left"
          :style="{ width: '110px', minWidth: '110px', left: selectedRowsCb ? '50px' : 0 }"
        >
          <div class="grid-item grid-item--header" :style="{ height: getHeaderHeight + 'px' }"></div>

          <div
            v-for="rowIdx of rowCount"
            :key="'showChild-' + rowIdx"
            :class="{ marked: marked === rowIdx }"
            @click="() => markRow(rowIdx)"
          >
            <div class="grid-item child-control pt-3 pl-1" :style="{ height: getCellHeight }">
              <v-chip :style="{ top: '-13px', position: 'relative', width: '50px' }" label v-text="getChildren(rowIdx).length"></v-chip>
              <v-btn
                icon
                outline
                small
                :style="{ top: '-13px', position: 'relative' }"
                @click="() => toggleShowChildrenCb(rowIdx - 1)"
              >
                <v-icon v-if="getValueOfRow(rowIdx, 'showChildren')">expand_less</v-icon>
                <v-icon v-else>chevron_right</v-icon>
              </v-btn>
            </div>
            <template v-if="getValueOfRow(rowIdx, 'showChildren')">
              <div
                v-for="(child, childPos) of getChildren(rowIdx)"
                :key="'child-' + childPos"
                class="grid-item child"
                :style="{ height: getChildCellHeight }"
              ></div>
            </template>
          </div>
        </div>
      </template>

      <div
        v-for="(header, colId) of headers"
        :key="colId"
        :class="{ 'grid-col': true, 'grid-col--fixed-left': colId < fixedLeftCols }"
        :style="{ width: header.width + 'px', minWidth: header.width + 'px', left: getLeftPosition(colId) }"
      >
        <vue-drag-resize
          :isActive="resizeCol === colId"
          :isResizable="!!selectedRowsCb"
          :isDraggable="false"
          :w="header.width"
          :minw="header.minWidth"
          :h="getHeaderHeight"
          :parentLimitation="false"
          :sticks="['mr']"
          @resizing="square => resize(header.attr, square)"
          @clicked.stop="() => setActive(colId)"
          @resizestop="() => setActive(null)"
          class="grid-item grid-item--header"
        >
          <slot name="header-cell" :props="{ header, sorting }">
            <span>{{ header.text }}</span>
          </slot>
        </vue-drag-resize>

        <template
          v-for="rowIdx of rowCount"
        >
          <div @click="setActive(null)" :key="'wert' + rowIdx" :class="{ marked: marked === rowIdx }">
            <div :style="{ height: getCellHeight }" class="grid-item">
              <slot
                name="cell"
                :props="{
                  item: () => getRowCb(rowIdx - 1),
                  colId,
                  rowId: rowIdx,
                  value: () => getValueOfRow(rowIdx, header.attr),
                  header,
                  height: getCellHeight,
                  sorting: sorting
                }"
              >
                {{ getValueOfRow(rowIdx, header.attr) }}
              </slot>
            </div>

            <template
              v-if="allowChildren && getValueOfRow(rowIdx, 'showChildren') && getChildren(rowIdx)"
            >
              <div
                v-for="(child, idx) of getChildren(rowIdx)"
                :key="'child_' + rowIdx + idx"
                :style="{ height: getChildCellHeight }"
                class="grid-item child"
              >
                <!--<slot-->
                  <!--name="child"-->
                  <!--:props="{-->
                    <!--item: child,-->
                    <!--colId,-->
                    <!--rowId: rowIdx,-->
                    <!--value: child[header.attr],-->
                    <!--header,-->
                    <!--child-->
                  <!--}"-->
                <!--&gt;-->
                  <!--<div>{{ child[header.attr] }}</div>-->
                <!--</slot>-->
              </div>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
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

    beforeUpdate () {
      console.log('beforeUpdate', new Date())
    },

    data () {
      return {
        records: this.items,
        resizeCol: null,
        marked: null,
        selected: [],
      }
    },

    methods: {
      getValueOfRow (rowIdx, attrName) {
        const row = this.getRowCb(rowIdx - 1)
        if (row && row[attrName]) {
          return row[attrName]
        }

        return null
      },
      getChildren (rowIdx) {
        const row = this.getRowCb(rowIdx - 1)
        if (row && row.children && row.children.length > 0) {
          return row.children
        }

        return null
      },
      setActive (colPos) {
        if (this.resizeCol === colPos) {
          this.resizeCol = null
        } else {
          this.resizeCol = colPos
        }
      },
      getLeftPosition (colPosition) {
        let left = 0
        left += this.selectedRowsCb ? 105 : 0
        left += this.allowChildren ? 55 : 0
        for (let i = 0; i <= (colPosition - 1); i++) {
          left += this.headers[i].width
        }
        return left + 'px'
      },
      resize (col, newRect) {
        const payload = {
          col,
          width: newRect.width
        }
        this.$emit('columnResized', payload)
      },
      markRow (rowIdx) {
        //this.setSelectedCb(rowIdx)
      },
      handleKeyPress (e) {
        if (this.selectedRowsCb && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
          this.selectedRowsCb(this.selected.map(idx => this.items[idx]))
        }
      }
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
        required: true
      },
      rowCount: {
        type: Number,
        required: true,
      },
      getRowCb: {
        type: Function,
        required: true,
      },
      toggleShowChildrenCb: {
        type: Function,
        required: true,
      },
      fitToSpace: {
        type: Boolean,
        default: false
      },
      height: {
        type: Number,
        default: 500
      },
      width: {
        type: Number,
        default: 1000
      },
      fixedLeftCols: {
        type: Number,
        default: 0
      },
      classList: {
        type: String,
        required: false
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
      allowChildren: {
        type: Boolean,
        default: false
      },
      selectedRowsCb: {
        type: Function,
        default: null
      },
      sorting: {
        type: Object,
        default: () => {
          return {
            descending: null,
            sortBy: null
          }
        }
      },
    },
  }
</script>

<style scoped>
  .grid-container {
    display: grid; /* This is a (hacky) way to make the .grid element size to fit its content */
    overflow: auto;
  }

  .grid {
    display: flex;
    flex-wrap: nowrap;
  }

  .grid-item--header {
    background-color: white;
    resize: horizontal;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 2 !important;
  }

  .grid-col--fixed-left {
    position: sticky;
    left: 0;
    z-index: 3;
  }

  .grid-col--fixed-right {
    position: sticky;
    right: 0;
    z-index: 3;
  }

  .grid-item {
    background-color: white;
    border-right: 1px solid gray;
    border-bottom: 1px solid gray;
    overflow: visible;
  }

  .child-control {
    overflow: hidden;
    padding: unset;
  }

  .grid-col > .grid-item:last-child {
    border-bottom: none;
  }

  .grid-col:last-child > .grid-item {
    border-right: none;
  }

  .drag-handle {
    background-color: red;
    float: right;
    width: 5px;
    cursor: ew-resize;
  }

  .grid > .grid-col:first-child > div > .grid-item {
    border-left: 1px solid transparent;
  }

  .grid > .grid-col:last-child > div > .grid-item {
    border-right: 1px solid transparent;
  }

  .grid > .grid-col > div > .grid-item:first-child {
    border-top: 1px solid transparent;
  }

  .grid > .grid-col > div > .grid-item:last-child {
    border-bottom: 1px solid #ddd;
  }

  .grid > .grid-col:first-child > .marked > .grid-item {
    border-left: 1px solid #f73636;
  }

  .grid > .grid-col:last-child > .marked > .grid-item {
    border-right: 1px solid #f73636;
  }

  .grid > .grid-col > .marked > .grid-item:first-child {
    border-top: 1px solid #f73636;
  }

  .grid > .grid-col > .marked > .grid-item:last-child {
    border-bottom: 1px solid #f73636;
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

  .select-control {
    overflow: hidden;
  }
</style>
