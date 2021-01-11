<template>
  <v-app id="inspire">
    <px-header
      v-on:logout="doSomething"
      v-if="isLogueado"
      class="hidden-sm-and-down"
    ></px-header>

    <!-- <PxHeaderMobile
                class="hidden-lg-and-up"
            ></PxHeaderMobile> -->
    <v-main>
      <v-container class="main__container pa-8" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app class="wine-dark">
      <span class="white--text">&copy; 2021</span>
    </v-footer>
  </v-app>
</template>

<script>
import PxHeader from '@/components/PxHeader'
// import PxHeaderMobile from '@/components/PxHeaderMobile'

export default {
  components: {
    PxHeader
    // PxHeaderMobile
  },
  props: {
    source: String
  },
  data() {
    return {
      drawer: null,
      isLogueado: false
    }
  },

  beforeCreated() {},

  created() {
    const user = localStorage.getItem('ax_user_token')

    console.log('isLogueado', this.isLogueado)
    if (user !== null) {
      this.isLogueado = true
    } else {
      //  window.location.href = "/";
    }
  },
  methods: {
    doSomething() {
      this.isLogueado = !this.isLogueado
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

.main__container {
  background: #fafbfd;
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

.v-main__wrap {
  background: #fafbfd;
}

.mini-toastr {
  top: 70px !important;
}
.toast {
  top: 70px !important;
}

.toast {
  /* color: yellow !important; */
  font-family: "Roboto", sans-serif;
  font-weight: normal;
}
</style>
