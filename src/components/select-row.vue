<template>
  <div class="grid-item grid-col--fixed-left" :style="{ width: '55px', height: cellHeight }">
    <component
      :is="toggleSelectRow"
      :docId="docId"
    />
  </div>

</template>

<script>
  export default {
    props: {
      docId: {
        type: [Number, String],
        required: true,
      },
      cellHeight: {
        type: String,
        required: true,
      },
      toggleSelectRow: {
        type: Object,
        required: true,
      }
    }
  }
</script>
