import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const headers = [
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
]

const items = Array
  .from(Array(200).keys())
  .map(i => {
    return {
      _id: 'idx-' + i,
      a: 0, b: 1, c: 2 * i, d: 3 * i, e: 4 * i, f: 5 * i, g: 6 * i, h: 7 * i, i: 8, j: 9, k: 10, l: 11, m: 12,
      showChildren: false,
      children: [
        { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12, },
        { a: 10, b: 11, c: 12, d: 13, e: 14, f: 15, g: 16, h: 17, i: 18, j: 19, k: 110, l: 111, m: 112, },
      ],
    }
  })

const setRowValueMutation = (state, { id, attrName, value }) => {
  state.items.forEach(item => {
    if (item._id === id) {
      item[attrName] = value
    }
  })
}

const markRowIdMutation = (state, id) => {
  state.markedRowId = id
}

const toggleShowChildrenMutation = (state, id) => {
  state.items.forEach(item => {
    if (item._id === id) {
      item.showChildren = !item.showChildren
    }
  })
}

const toggleSelectedRowsMutation = (state, docId) => {
  const idx = state.selectedRowIds.indexOf(docId)
  if (idx === -1) {
    state.selectedRowIds.push(docId)
  } else {
    state.selectedRowIds.splice(idx, 1)
  }
}

export default new Vuex.Store({
  state: {
    headers,
    items,
    selectedRowIds: [],
    markedRowId: null,
  },
  mutations: {
    markRowIdMutation,
    setRowValueMutation,
    toggleSelectedRowsMutation,
    toggleShowChildrenMutation,
  },
  getters: {
    getAll: state => state.items,
    get: state => docId => state.items.find(item => item._id === docId),
    getChildValue: state => (docId, childIdx, attrName) => state.items.find(item => item._id === docId).children[childIdx][attrName],
    getRowValue: state => (rowId, attrName) => state.items[rowId][attrName],
    getRowCount: state => state.items.length,
    headers: state => state.headers,
    getSelectedRowIds: state => state.selectedRowIds,
    getMarkedRowId: state => state.markedRowId,
  }
})
