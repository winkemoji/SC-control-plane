<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              link
              @click="routePath(item.path)"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :key="item.text"
            link
            @click="routePath(item.path)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="blue darken-3" dark app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; winkemoji 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      title: "SNMP collector",
      dialog: false,
      drawer: null,
      items: [
        {
          icon: "mdi-view-dashboard",
          text: "蓝图 blueprints",
          path: "blueprints",
        },
        {
          icon: "mdi-archive",
          text: "采集 collections",
          path: "collections",
        },
        // {
        //   icon: "mdi-cog",
        //   text: "监视器 monitor",
        //   path: "collection-monitor",
        // },
        { icon: "mdi-cog", text: "设置 Settings", path: "settings" },
      ],
    };
  },
  created() {
    this.$vuetify.theme.dark = false;
  },
  methods: {
    routePath(path) {
      if (path == undefined) {
        console.error("route path undefined.");
        return;
      }
      this.$router.push(path);
    },
  },
  computed: {
    routes() {
      return this.$router.options.routes;
    },
  },
};
</script>
<style lang="scss">
.v-main__wrap {
  background-color: #edeff0;
}
</style>
