<template>
        <v-navigation-drawer
        expand-on-hover
        mini
        rail
        class="overlay-drawer"
        >
            Hello there
        <v-divider></v-divider>
        <v-list density="compact" nav>
            <nav>
                  <router-link to="/">Home</router-link> |
                <router-link to="/about">About</router-link>
          </nav>
            <v-list-item prepend-icon="mdi-folder" title="Page 1" value="myfiles"></v-list-item>
          <v-list-item prepend-icon="mdi-star" title="Page 2" value="shared"></v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script>

export default {
  name: 'SideDrawer',

  data: () => ({
    //
  }),
}
</script>
