<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="my-card" flat bordered v-bind:style="$q.platform.is.mobile ? { width: '80%' } : { width: '55%' }">
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
                    <q-input dense v-model="email" label="Email" lazy-rules>
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
                        class="q-mt-md"
                        label="Sign In"
                        type="button"
                        style="width: 150px; align-content: right;"
                        color='blue-7'
                        @click="loginNotify"
                      />
                    </div>
                  </q-form>
                </div>
                <div class="col-9">
                </div>
            </div>
          </div>
        </q-card>
        <!-- <q-card
          class="login-form"
          v-bind:style="
            $q.platform.is.mobile ? { width: '80%' } : { width: '35%' }
          "
        >
        <q-img src="~assets/ambulance.jpg" height="260px"></q-img>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                Selamat Datang di
                <div>Blits Ambulance</div>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="email" label="Email" lazy-rules />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Password"
                lazy-rules
              />

              <div>
                <q-btn
                  label="Login"
                  type="button"
                  color='green-10'
                  @click="loginNotify"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card> -->
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
        slide: 1,
        autoplay: true,
        isPwd: true,
        visible: false,
      }
    },
    methods: {
      async loginNotify() {
        await this.$axios.post('http://192.168.43.172:5050/users/login', {
          email: this.email,
          password: this.password
        })
        .then((res)=>{
          // console.log(res);
          if (res.data.status === true){
            this.$q.localStorage.set('dataUser', res.data.data)
            this.$router.push({name : 'dashboard'})
            this.$q.notify({
              color: 'green',
              message: 'selamat anda berhasil login'
            })
          } else {
            if (res.data.code === 401) {
              this.$q.notify({
                color: 'red',
                message: 'Email yang anda masukkan salah'
              })
            }
          } if (res.data.code === 501) {
            this.$q.notify({
              color: 'red',
              message: 'Password yang anda masukkan salah'
            })
          }
          // else {
          //     this.$q.notify({
          //       color: 'red',
          //       message: 'Email atau password salah'
          // }
        })
      }
    },
    // mounted() {
    //   particlesJS("particles-js", {
    //     "particles": {
    //       "number": {
    //         "value": 80,
    //         "density": {
    //           "enable": true,
    //           "value_area": 800
    //         }
    //       },
    //       "color": {
    //         "value": "#ffffff"
    //       },
    //       "shape": {
    //         "type": "circle",
    //         "stroke": {
    //           "width": 0,
    //           "color": "#000000"
    //         },
    //         "polygon": {
    //           "nb_sides": 5
    //         },
    //         "image": {
    //           "src": "img/github.svg",
    //           "width": 100,
    //           "height": 100
    //         }
    //       },
    //       "opacity": {
    //         "value": 0.5,
    //         "random": false,
    //         "anim": {
    //             "enable": false,
    //             "speed": 1,
    //             "opacity_min": 0.1,
    //             "sync": false
    //         }
    //       },
    //       "size": {
    //         "value": 3,
    //         "random": true,
    //         "anim": {
    //           "enable": false,
    //           "speed": 40,
    //           "size_min": 0.1,
    //           "sync": false
    //         }
    //       },
    //       "line_linked": {
    //         "enable": true,
    //         "distance": 150,
    //         "color": "#ffffff",
    //         "opacity": 0.4,
    //         "width": 1
    //       },
    //       "move": {
    //         "enable": true,
    //         "speed": 6,
    //         "direction": "none",
    //         "random": false,
    //         "straight": false,
    //         "out_mode": "out",
    //         "bounce": false,
    //         "attract": {
    //           "enable": false,
    //           "rotateX": 600,
    //           "rotateY": 1200
    //         }
    //       }
    //     },
    //     "interactivity": {
    //       "detect_on": "canvas",
    //       "events": {
    //         "onhover": {
    //           "enable": true,
    //           "mode": "grab"
    //         },
    //         "onclick": {
    //           "enable": true,
    //           "mode": "push"
    //         },
    //         "resize": true
    //       },
    //       "modes": {
    //         "grab": {
    //           "distance": 140,
    //           "line_linked": {
    //             "opacity": 1
    //           }
    //         },
    //         "bubble": {
    //           "distance": 400,
    //           "size": 40,
    //           "duration": 2,
    //           "opacity": 8,
    //           "speed": 3
    //         },
    //         "repulse": {
    //           "distance": 200,
    //           "duration": 0.4
    //         },
    //         "push": {
    //           "particles_nb": 4
    //         },
    //         "remove": {
    //           "particles_nb": 2
    //         }
    //       }
    //     },
    //     "retina_detect": true
    //   });
    // }
  }
</script>

<style>
#particles-js {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
}
.normal_gradient {
  background: linear-gradient(145deg, rgb(74, 94, 137) 15%, #b61924 70%);
}
.login-form {
  position: absolute;
}
</style>
