<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="my-card" flat bordered v-bind:style="$q.platform.is.mobile ? { width: '80%' } : { width: '50%' }">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-5">
              <q-carousel
                animated
                v-model="slide"
                infinite
                height="100%"
                :autoplay="autoplay"
                transition-prev="slide-right"
                transition-next="slide-left"
                @mouseenter="autoplay = false"
                @mouseleave="autoplay = true"
              >
                <q-carousel-slide :name="1" img-src="banner_1.png" />
                <q-carousel-slide :name="2" img-src="banner_2.png" />
                <q-carousel-slide :name="3" img-src="banner_3.png" />
                <q-carousel-slide :name="4" img-src="banner_4.png" />
              </q-carousel>
            </div>
            <div class="row col-12 col-md-7 flex-center flex">
              <div class="col-9 text-center q-mt-lg q-mb-lg">
                <q-img src="icons/main_icon/icon.png" width="60px" />
                <div class="text-h6 q-mt-sm text-blue-7 text-weight-bold">BLITS AMBULANS</div>
                <div class="text-caption text-grey-7">Bandar Lampung Intellegent Transportation System</div>
                <div class="text-subtitle2 q-mt-lg text-left" style="font-size: 20px;">Sign In</div>
                <q-form class="q-gutter-md q-mt-md">
                  <q-input type="email" dense v-model="email" label="Email" lazy-rules>
                    <template v-slot:prepend>
                      <q-icon size="20px" name="alternate_email" />
                    </template>
                  </q-input>

                  <q-input dense label="Password" v-model="password" :type="isPwd ? 'password' : 'text'">
                    <template v-slot:prepend>
                      <q-icon size="20px" name="gpp_good" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>

                  <div class="text-subtitle2 q-mt-lg text-right">
                    <q-btn
                      class="q-mt-md full-width"
                      label="Sign In"
                      type="button"
                      style="width: 150px; align-content: right;"
                      color='blue-7'
                      @click="loginNotify"
                    />
                  </div>
                </q-form>
              </div>
            </div>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script type="text/javascript"></script>
<script>
  export default {
    data() {
      return {
        email: null,
        password: null,
        role: null,
        slide: 1,
        autoplay: true,
        isPwd: true,
        visible: false,
      }
    },
    methods: {
      async loginNotify() {
        await this.$axios.post('users/login', {
          // email: 'admin@gmail.com',
          // password: 123
          email: this.email,
          password: this.password
        })
        .then((res) => {
          console.log(res);
          if (res.data.status === true) {
            this.$q.localStorage.set('dataUser', res.data.data)
            if (res.data.data.user.role === '1') {
              this.$router.push({name: 'dashboard'})
              this.$q.notify({
                color: 'positive',
                message: 'Selamat anda berhasil login'
              })
            } else {
              this.$q.notify({
                color: 'negative',
                message: 'Maaf anda tidak dapat login'
              })
            }
          } else {
            this.$q.notify({
              color: 'negative',
              message: 'Email atau password salah'
            })
          }
        })
      }
    },
  }
</script>

<style>
</style>
