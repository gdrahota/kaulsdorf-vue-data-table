<template>
  <div class="cell">
    <v-text-field
      v-if="value === 0"
      v-model="props.rowId"
      label="1st Value"
      hint="Whatever"
    ></v-text-field>

    <v-switch
      v-else-if="value === 1"
      v-model="color"
      label="red"
      :color="color"
      value="red"
      hint="Whatever"
    ></v-switch>

    <v-icon v-else-if="value === 2">cancel</v-icon>

    <v-checkbox
      v-else-if="value === 3"
      v-model="color"
      label="red"
      :color="color"
      value="red"
      hint="Whatever"
    ></v-checkbox>


    <v-btn
      v-else-if="value === 4"
      @click="clicked"
      fab
      small
    >
      <v-icon>add</v-icon>
    </v-btn>

    <v-text-field
      v-else-if="value === 5"
      label="Outline"
      placeholder="Placeholder"
      hint="Whatever"
    ></v-text-field>

    <span v-else>{{ value }}</span>
  </div>
</template>

<script>
  export default {
    created () {
      //console.log(this)
    },

    computed: {
      value () {
        return this.props.item[this.props.header.attr]
      }
    },

    data () {
      return {
        color: '#fff',
        switchValue: null
      }
    },

    methods: {
      clicked () {
        this.color = this.color === 'red' ? 'white' : 'red'
      }
    },

    props: {
      props: {
        type: [Number, String, Object, Array, Boolean],
        required: false
      },
    }
  }
</script>

<style scoped>
  .cell {
    background-color: white;
    position: relative;
    overflow-y: hidden;
  }
</style>
