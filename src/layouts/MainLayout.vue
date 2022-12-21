<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header_normal bg-white" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          color="blue-7"
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space/>
        <div class="row q-gutter-sm">
          <q-btn dense flat text-color="blue-7" class="q-mt-md">
            {{dataUser.user.username}}
          </q-btn>
          <q-btn dense flat text-color="blue-7" icon="notifications" class="q-mt-md">
            <q-tooltip>
              Information Update
            </q-tooltip>
            <q-badge color="green" rounded text-color="white" floating />
            <q-menu>
              <q-card class="my-card">
                <q-card-section>
                  <div class="text-h6 text-grey-7">Informasi Terbaru</div>
                  <div class="text-subtitle text-grey-7">Daftar informasi terbaru system</div>
                </q-card-section>
                <q-card-section>
                  <messages></messages>
                </q-card-section>

                <q-separator />

                <q-card-actions vertical>
                  <q-btn flat text-color="blue-7">VIEW ALL</q-btn>
                </q-card-actions>
              </q-card>
            </q-menu>
          </q-btn>
          <q-btn @click="Logout" clickable v-ripple exact dense flat text-color="blue-7" icon="highlight_off" class="q-mr-md q-mt-md">
            <q-tooltip>
              Sign Out
            </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="left-navigation text-white"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="250"
      elevated
    >
      <div class="full-height">
        <div style="height: calc(100% - 117px); padding:20px; align-items: center;">
          <q-toolbar class="q-mb-md">
            <q-avatar style="width: 50px; height: 55px;">
              <img src="icons/main_icon/icon.png" />
            </q-avatar>
            <q-toolbar-title class="text-grey-7">
              BLITS
              <div class="text-caption text-blue-7">Administrator <q-badge color="green" rounded text-color="white" /></div>
            </q-toolbar-title>
          </q-toolbar>
          <q-scroll-area style="height:100%;">
            <q-list padding class="text-grey-7 text-weight-bold">
              <q-item
                active-class="tab-active"
                :to="{ name: 'dashboard' }"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="dashboard" />
                </q-item-section>
                <q-item-section>
                  Dashboard
                </q-item-section>
              </q-item>

              <q-expansion-item
                class="q-pl-sm"
                icon="perm_phone_msg"
                label="Pemesanan"
              >
                <q-item
                  active-class="tab-active"
                  class="q-ma-sm navigation-item"
                  :to="{ name: 'order' }"
                  exact
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="verified" />
                  </q-item-section>
                  <q-item-section>
                    Pesanan Masuk
                  </q-item-section>
                </q-item>

                <q-item
                  active-class="tab-active"
                  class="q-ma-sm navigation-item"
                  :to="('/daftarPesanan/:guid')"
                  exact
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-icon name="playlist_add_check_circle" />
                  </q-item-section>
                  <q-item-section>
                    Daftar Pesanan
                  </q-item-section>
                </q-item>
              </q-expansion-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'vehicle' }"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="local_shipping" />
                </q-item-section>
                <q-item-section>
                  Ambulans
                </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                :to="{name: 'driver'}"
                exact
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="supervised_user_circle" />
                </q-item-section>
                <q-item-section>
                  Pengemudi
                </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'map' }"
                class="q-ma-sm navigation-item"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="map" />
                </q-item-section>
                <q-item-section>
                  Peta
                </q-item-section>
              </q-item>

              <q-item
                active-class="tab-active"
                :to="{ name: 'profil' }"
                class="q-ma-sm navigation-item7"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon name="health_and_safety" />
                </q-item-section>
                <q-item-section>
                  Profil
                </q-item-section>
              </q-item>

            </q-list>
          </q-scroll-area>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Messages from './Messages'
// import createToken from 'src/boot/create_token'
export default ({
  name: 'MainLayout',
  components: {
    Messages
  },
  data () {
    return {
      leftDrawerOpen: false,
      username: null,
      dataUser: this.$q.localStorage.getItem('dataUser')
    }
  },
  methods: {
    Logout () {
      this.$q.localStorage.clear()
      this.$router.push({ name: 'login' })
    }
  }
})
</script>
<style>
.q-drawer {
  background-size: cover !important;
}
.drawer_normal {
  background-color: rgba(1, 1, 1, 0.75);
}
.navigation-item {
  border-radius: 5px;
}
.tab-active {
  background-color: #2777EF;
  color: white;
}
.header_normal {
  background: linear-gradient(
    145deg,
    rgb(32, 106, 80) 15%,
    rgb(21, 57, 102) 70%
  );
}
</style>
