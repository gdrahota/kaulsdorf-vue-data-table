<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span class="font-weight-light">Kaulsdorf vue data table</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <test/>
    </v-content>
    <v-footer app>Footer</v-footer>
  </v-app>
</template>

<script>
  import Test from './components/test'

  export default {
    name: 'App',
    components: {
      Test
    },
  }
</script>

<style>
  .v-card__text {
    background-color: #ddd;
  }

  .v-footer {
    padding-left: 10px;
  }
</style>
