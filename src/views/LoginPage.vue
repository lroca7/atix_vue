<template>
  <div class="login-page">
    <div class="form-login">
      <v-text-field label="Usuario" v-model="username"></v-text-field>
      <v-text-field label="Contrasena" v-model="password"></v-text-field>
      <v-btn class="mt-4" depressed color="primary" @click="login">
        Ingresar
      </v-btn>
    </div>
    <div class="login-image">
      <v-img
        :src="require('../assets/login_draw2.svg')"
        class="my-3"
        contain
        height="200"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {},

  data() {
    return {
      username: null,
      password: null
    }
  },

  created() {
    const user = localStorage.getItem('ax_user_token')

    if (user !== null) {
      this.$router.push('home')
    }
  },

  methods: {
    login() {
      const me = this
      if (me.username !== null && me.password !== null) {
        let data = {
          email: me.username,
          password: me.password
        }

        fetch(`${this.$apiUrl}login2`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then((data) => {
            console.log(data)
            if(data.username){
                localStorage.setItem('ax_user_token', 'allow')
                this.$router.push('home')
            }else{
                localStorage.removeItem('ax_user_token')
                this.$router.push('/')
            }
            
          })
          .catch( () => {
            console.error('Error: login')

            localStorage.removeItem('ax_user_token')
            this.$router.push('/')

            this.$emit("logout");
          })
      }
    }
  }
}
</script>

<style>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60%;
  margin: 5% auto;
}
.form-login {
  width: 40%;
}

.login-image {
  width: 60%;
}
</style>
