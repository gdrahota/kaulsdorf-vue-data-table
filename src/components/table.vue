<template>
  <div class="grid-container" :style="{ width: getControlWidth, height: getControlHeight }" :class="classList">
    <div class="grid">
      <template v-if="selectedRowsCb">
        <div
          class="grid-col grid-col--fixed-left"
          :style="{ width: '50px', minWidth: '50px', left: 0 }"
        >
          <div class="grid-item grid-item--header" :style="{ height: getHeaderHeight + 'px' }"></div>

          <div
            v-for="(item, rowId) of Object.values(items)"
            :key="'showSelect-' + rowId"
            @click="() => markRow(rowId)"
            :class="{ marked: marked === rowId }"
          >
            <div class="grid-item select-control" :style="{ height: getCellHeight }">
              <v-checkbox v-model="selected" :value="rowId"></v-checkbox>
            </div>
            <template v-if="item.showChildren">
              <div
                v-for="(child, childPos) of item.children"
                :key="'child-' + childPos"
                class="grid-item child"
                :style="{ height: getChildCellHeight }"
              />
            </template>
          </div>
        </div>
      </template>

      <template v-if="allowChildren">
        <div
          class="grid-col grid-col--fixed-left"
          :style="{ width: '55px', minWidth: '55px', left: selectedRowsCb ? '50px' : 0 }"
        >
          <div class="grid-item grid-item--header" :style="{ height: getHeaderHeight + 'px' }"></div>

          <div
            v-for="(item, rowId) of Object.values(items)"
            :key="'showChild-' + rowId"
            @click="() => markRow(rowId)"
            :class="{ marked: marked === rowId }"
          >
            <div class="grid-item child-control pt-3" :style="{ height: getCellHeight }">
              <v-btn v-if="item.children" icon @click="() => toggleShowChildren(item)">
                <v-icon v-if="item.showChildren">expand_less</v-icon>
                <v-icon v-else>chevron_right</v-icon>
              </v-btn>

              <span class="number-of-children">{{item.children.length}}</span>
            </div>
            <template v-if="item.showChildren">
              <div
                v-for="(child, childPos) of item.children"
                :key="'child-' + childPos"
                class="grid-item child"
                :style="{ height: getChildCellHeight }"
              />
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
          :isDraggable="false"
          :w="header.width"
          :h="getHeaderHeight"
          :parentLimitation="false"
          :minw="header.minWidth"
          :sticks="['mr']"
          @resizing="square => resize(colId, square)"
          @clicked.stop="() => setActive(colId)"
          @resizestop="() => setActive(null)"
          class="grid-item grid-item--header"
        >
          <slot name="header-cell" :props="{ header }">
            <span>{{ header.text }}</span>
          </slot>
        </vue-drag-resize>

        <template
          v-for="(item, rowId) of Object.values(items)"
        >
          <div @click="setActive(null)" :key="'wert' + rowId" :class="{ marked: marked === rowId }">
            <div :style="{ height: getCellHeight }" class="grid-item">
              <slot
                name="cell"
                :props="{ item, colId, rowId, value: item[Object.keys(item)[colId]], header, height: getCellHeight }"
              >
                {{ item[header.attr] }}
              </slot>
            </div>

            <template
              v-if="allowChildren && item.showChildren && item.children"
            >
              <div
                v-for="(child, idx) of item.children"
                :key="'child_' + idx"
                :style="{ height: getChildCellHeight }"
                class="grid-item child"
              >
                <slot
                  name="child"
                  :props="{ item, colId, rowId, value: item[Object.keys(item)[colId]], header, child }"
                >
                  <div>child {{ child[header.attr] }}</div>
                </slot>
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
      hasChildren () {
        return this.items.some(item => item.children)
      }
    },

    data () {
      return {
        resizeCol: null,
        marked: null,
        selected: [],
      }
    },

    methods: {
      setActive (colPos) {
        if (this.resizeCol === colPos) {
          this.resizeCol = null
        } else {
          this.resizeCol = colPos
        }
      },
      getLeftPosition (colPosition) {
        let left = 0
        left += this.selectedRowsCb ? 50 : 0
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
      toggleShowChildren (item) {
        if (item.children) {
          item.showChildren = !item.showChildren
        } else {
          item.showChildren = false
        }
      },
      markRow (rowId) {
        this.marked = rowId
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
      items: {
        type: Array,
        required: true
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
        default: 55
      },
      allowChildren: {
        type: Boolean,
        default: false
      },
      selectedRowsCb: {
        type: Function,
        default: null
      },
    }
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
    z-index: 1 !important;
  }

  .grid-col--fixed-left {
    position: sticky;
    left: 0;
    z-index: 2;
  }

  .grid-col--fixed-right {
    position: sticky;
    right: 0;
    z-index: 2;
  }

  .grid-item {
    background-color: white;
    border-right: 1px solid gray;
    border-bottom: 1px solid gray;
    padding: 10px;
  }

  .child-control {
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

  .grid > .grid-col:first-child > .marked > .grid-item {
    border-left: 3px solid dodgerblue;
  }

  .grid > .grid-col:last-child > .marked > .grid-item {
    border-right: 3px solid dodgerblue;
  }

  .grid > .grid-col > .marked > .grid-item:first-child {
    border-top: 3px solid dodgerblue;
  }

  .grid > .grid-col > .marked > .grid-item:last-child {
    border-bottom: 3px solid dodgerblue;
  }

  .active {
    border: 2px solid crimson;
  }

  .number-of-children {
    width: 20px;
    text-align: center;
    position: relative;
    float: left;
  }
</style>
