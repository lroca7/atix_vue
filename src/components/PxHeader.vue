<template>
    <div>
        <v-navigation-drawer v-model="drawer" temporary="temporary" app>
            <v-list dense class="submenu">
                <v-list-item link text v-for="s in submenus" :key="`${s.id}`">
                    <v-list-item-action>
                        <v-icon>{{ s.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                            <router-link :to="s.slug">
                                <span>
                                    {{ s.name }}
                                </span>
                            </router-link>
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app class="wine-ligth">
            <v-app-bar-nav-icon
                class="menu-icon"
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <div class="toolbar">
                <v-toolbar-title class="company_title">
                    <router-link to="/">
                        <b>
                            ATIX
                        </b>
                    </router-link>
                </v-toolbar-title>
                <v-toolbar-items class="hidden-sm-and-down">
                    <v-btn
                        text
                        v-for="m in menus"
                        :key="`${m.id}`"
                        v-on:click="openSubMenu(m.id)"
                    >
                        <router-link :to="m.slug">
                            <span>
                                {{ m.name }}
                            </span>
                        </router-link>
                    </v-btn>
                </v-toolbar-items>
            </div>
        </v-app-bar>
    </div>
</template>

<script>
export default {
    name: 'PxHeader',
    components: {},

    data() {
        return {
            drawer: null,
            menus: [],
            submenus: []
        }
    },

    props: {
        links: {
            type: Array,
            default: () => {}
        }
    },

    created() {
        let me = this

        fetch(`${this.$apiUrl}menu/list`)
            .then(response => response.json())
            .then(dataItems => {
                me.menus = dataItems.data
            })
    },

    methods: {
        openSubMenu(menuId) {
            let me = this

            fetch(`${this.$apiUrl}menu/submenus/${menuId}`)
                .then(response => response.json())
                .then(dataItems => {
                    if (dataItems.length > 0) {
                        me.submenus = dataItems
                        me.drawer = true
                    }
                })
        }
    }
}
</script>

<style>
/* @font-face {
    font-family: 'Blanka';
    
    src: url("assets/fonts/Roboto-Light.woff2") format("woff2");
} */

.submenu span {
    color: #c10000;
    font-size: 0.9rem;
}
.toolbar a {
    color: #ffffff !important;
    /* text-decoration: none; */
}
.company_title a {
    font-size: 2rem;
    /* font-family: 'Anton', Courier, monospace; */
    font-family: 'Blanka', Helvetica, Arial;
}
</style>
