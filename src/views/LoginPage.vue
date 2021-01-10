<template>
  <div class="login-page">
    <div class="form-login">
      <v-form v-model="valid">
        <v-text-field
          label="Usuario"
          v-model="username"
          required
        ></v-text-field>
        <!-- <v-text-field label="Contrasena" v-model="password" required></v-text-field> -->
        <v-text-field
          :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show3 ? 'text' : 'password'"
          name="input-10-2"
          label="Contraseña"
          v-model="password"
          @click:append="show3 = !show3"
        ></v-text-field>
        <v-btn class="mt-4" depressed color="primary" @click="login">
          Ingresar
        </v-btn>
        <v-alert
          class="mt-8"
          v-if="loginError"
          text
          prominent
          type="error"
          icon="mdi-cloud-alert"
        >
          Usuario o contraseña no validos
        </v-alert>
      </v-form>
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
      valid: false,
      username: 'lizeth@atix.com',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      // password: null,

      show3: false,
      password: 'atix123',
      rules: {
        required: value => !!value || ' ',
        // min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => `The email and password you entered don't match`
      },
      loginError: false
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
          .then(data => {
            console.log('data', data)
            if (data.username) {
              localStorage.setItem('ax_user', JSON.stringify(data))
              localStorage.setItem('ax_user_token', 'allow')
              me.$router.push({ name: 'dashboard' })
              // window.location.href = '/dashboard'
            } else {
              localStorage.removeItem('ax_user_token')
              me.$router.push({ name: 'login' })
              me.loginError = true
            }
          })
          .catch(() => {
            console.error('Error: login')

            localStorage.removeItem('ax_user_token')
            me.$router.push({ name: 'login' })

            this.$emit('logout')

            me.loginError = true
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
