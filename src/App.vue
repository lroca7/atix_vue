<template>
    <v-app id="inspire" class="jajajaja">
        <!-- <v-navigation-drawer v-model="drawer" temporary="temporary" app>
            <v-list dense>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-email</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Contact</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer> -->

        <!-- <v-app-bar app class="wine-ligth">
            <v-app-bar-nav-icon
                class="menu-icon"
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <div class="toolbar">
                <v-toolbar-title>ATIX</v-toolbar-title> -->
        <px-header :links="links"></px-header>
        <!-- </div>
        </v-app-bar> -->

        <v-main>
            <v-container class="main__container pa-8" fluid>
                <router-view></router-view>
            </v-container>
            <!-- <v-container class="fill-height" fluid>

                <v-row align="center" justify="center">
                    <v-col class="text-center">
                        
                         <v-tooltip left>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    :href="source"
                                    icon
                                    large
                                    target="_blank"
                                    v-on="on"
                                >
                                    <v-icon large>mdi-code-tags</v-icon>
                                </v-btn>
                            </template>
                            <span>Source</span>
                        </v-tooltip> 
                    </v-col>
                </v-row> 
            </v-container> -->
        </v-main>

        <v-footer app class="wine-dark">
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
import PxHeader from '@/components/PxHeader'

export default {
    components: {
        PxHeader
    },
    props: {
        source: String
    },
    data() {
        return {
            drawer: null,
            links: [
                {
                    title: 'BTC',
                    to: 'hola'
                },
                {
                    title: 'ETH',
                    to: { name: 'coin-detail', params: { id: 'ethereum' } }
                },
                {
                    title: 'XRP',
                    to: { name: 'coin-detail', params: { id: 'ripple' } }
                }
            ]
        }
    }
}
</script>

<style>
html {
    font-size: 18px;
}
.toolbar-color {
    background-color: #ffffff;
}
a {
    text-decoration: none;
}
.subtitles {
    font-weight: 600;
    font-size: 1.3rem;
    margin-bottom: 1%;
}
/** Estilo del datatable */
.data__table--actions button {
    margin: 2%;
}
.data__table--actions button > span {
    font-size: 0.9rem;
}
.v-data-table-header span {
    font-size: 1rem;
}

#products-datatable td {
    padding-top: 1% !important;
    padding-bottom: 1% !important;
}

@media screen and (max-width: 767px) {
    .data__table--actions {
        display: flex;
    }
}
/** Fin Estilo del datatable */

/* .container {
    padding: 40px !important;
} */
.toolbar {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.toolbar .v-btn__content {
    color: #ffffff !important;
}
.menu-icon > span > i {
    color: #ffffff !important;
}
.wine-ligth {
    background-color: #c10000 !important;
}
.wine-dark {
    background-color: #4b0400 !important;
}
.v-footer {
    padding: 15px 16px !important;
}
.v-toolbar__title {
    color: #ffffff;
}
</style>
