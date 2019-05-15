<template>
  <div>{{header.text}}</div>
</template>

<script>
  export default {
    computed: {
      header () {
        return this.headers[this.headerIdx]
      }
    },

    props: {
      headers: {
        type: Array,
        required: true,
      },
      headerIdx: {
        type: Number,
        required: true,
      },
    },
  }
</script>
