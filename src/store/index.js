import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const headers = [
  { text: 'Head 0', attr: 'a', width: 100, minWidth: 100, },
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

const numberOfTestRecords = 20

const random = () => Math.round(Math.random() * 100)

const items = Array
  .from(Array(numberOfTestRecords).keys())
  .map(i => {
    return {
      _id: 'idx-' + i,
      a: random(),
      b: random(),
      c: false,
      d: false,
      e: random(),
      f: random(),
      g: random(),
      h: random(),
      i: random(),
      j: random(),
      k: random(),
      l: random(),
      m: random(),
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

const setHeaderWidthMutation = (state, { headerIdx, width }) => {
  if (state.headers[headerIdx].minWidth < width) {
    state.headers[headerIdx].width = width
  } else {
    state.headers[headerIdx].width = state.headers[headerIdx].minWidth
  }
}

const toggleSelectedRowsMutation = (state, docId) => {
  const idx = state.selectedRowIds.indexOf(docId)
  if (idx === -1) {
    state.selectedRowIds.push(docId)
  } else {
    state.selectedRowIds.splice(idx, 1)
  }
}

const getRowValue = state => (docId, attrName) => {
  const row = state.items.find(item => item._id === docId)
  return row && [null, undefined].indexOf(row[attrName]) === -1 ? row[attrName] : null
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
    setHeaderWidthMutation,
  },
  getters: {
    getAll: state => state.items,
    get: state => docId => state.items.find(item => item._id === docId),
    getChildValue: state => (docId, childIdx, attrName) => state.items.find(item => item._id === docId).children[childIdx][attrName],
    getRowValue,
    getRowCount: state => state.items.length,
    getHeaders: state => state.headers,
    getSelectedRowIds: state => state.selectedRowIds,
    getMarkedRowId: state => state.markedRowId,
  }
})
