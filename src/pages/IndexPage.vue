<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Dashboard" icon="widgets" />
      </q-breadcrumbs>
    </q-card>
    <div class="row q-col-gutter-md q-ma-xs">
      <div class="col-12 col-md-9 q-pr-md">
        <q-card>
          <div style="height: fit-content; width: 100%;">
            <l-map
              :zoom="map.zoom"
              :center="map.center"
              :max-zoom="map.maxZoom"
              :min-zoom="map.minZoom"
              style="height: 500px; width: 100%"
              v-if="map.loaded"
            >
              <l-tile-layer
                :url="map.tileLayer"
                :attribution="map.attribution"
              />
              <l-marker
                v-for="(d, i) in maps"
                :key="i"
                :lat-lng="[Number(d.location_latitude), Number(d.location_longitude)]"
              >
              <l-popup>
                <q-card flat>
                    <q-item>
                      <q-item-section avatar>
                        <q-avatar>
                          <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                        </q-avatar>
                      </q-item-section>

                      <q-item-section>
                        <q-item-label>{{ d.names }}</q-item-label>
                        <q-item-label caption class="text-weight-bold">
                          {{ d.plats }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-card-section horizontal>
                      <q-card-section class="fit">
                        <q-icon name="phone" size="20px" color="blue-7" /> . {{ d.phones }}
                        <q-icon name="alt_route" size="20px" color="blue-7" /> . {{ d.trayeks }}
                      </q-card-section>

                      <q-separator vertical />

                      <q-card-section class="fit">
                        <q-icon name="local_shipping" size="20px" color="blue-7" /> . {{ d.types }}
                        <q-icon name="turn_sharp_right" size="20px" color="blue-7" /> . {{ d.kilometerss }} Km
                      </q-card-section>
                    </q-card-section>
                  </q-card>
              </l-popup>
              <l-icon
                :icon-size="[32, 32]"
                :icon-anchor="[16, 32]"
                :popup-anchor="[0, -32]"
                :icon-url="d.icons"
                />
              </l-marker>
            </l-map>
          </div>
        </q-card>
      </div>
      <div class="col-12 col-md-3 q-gutter-md">
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section class="text-white bg-white">
              <div class="row">
                <div class="col-8">
                  <div class="text-h4 text-red-7 text-weight-bold">{{this.jumlah}}</div>
                  <div class="text-subtitle2 text-blue-7">Ambulans</div>
                  <div class="text-caption text-grey">
                    Jumlah ambulans yang terdaftar.
                  </div>
                </div>
                <div class="col-2">
                  <q-img src="ambulance.png" width="60px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section class="text-white bg-white">
              <div class="row">
                <div class="col-8">
                  <div class="text-h4 text-red-7 text-weight-bold">{{this.pesanan}}</div>
                  <div class="text-subtitle2 text-blue-7">Pemesan</div>
                  <div class="text-caption text-grey">
                    Jumlah pemesan ambulans terdaftar.
                  </div>
                </div>
                <div class="col-2">
                  <q-img src="heart-beat.png" width="60px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-3">
          <q-card>
            <q-card-section class="text-white bg-white">
              <div class="row">
                <div class="col-8">
                  <div class="text-h4 text-red-7 text-weight-bold">{{this.pengemudi}}</div>
                  <div class="text-subtitle2 text-blue-7">Pengemudi</div>
                  <div class="text-caption text-grey">
                    Jumlah pengemudi terdaftar.
                  </div>
                </div>
                <div class="col-2">
                  <q-img src="drivers.jpg" width="60px" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import createToken from 'src/boot/create_token'
import { LMap, LIcon, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
export default {
  components: {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LPopup
  },
  data () {
    return {
      map: {
        loaded: false,
        // tileLayer: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: 'contributors <a href="">BLITS ambulans</a>',
        center: L.latLng([-5.398909, 105.070861]),
        zoom: 10,
        minZoom: 7,
        maxZoom: 18,
        markerLatLng: [47.313220, -1.319482],
        icons: ''
      },
      maps: [],
      zoom: 2,
      km: 0,
      pengemudi: null,
      pesanan: null,
      jumlah: null,
      guid_po: '2bfab8ff-304e-42e9-b200-9fb9140f0432'
    }
  },
  async created () {
    await this.getKendaraan()
    await this.getDriver()
    await this.getPesanan()
    this.map.loaded = true
  },
  methods: {
    async getKendaraan () {
      this.$axios.post('https://api-kopamas-carter.pptik.id:5121/api.v1/vehicles/po-get', {
        guid_po: this.guid_po
      }, {
        headers: {
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiNzNhZjk3YjQtNTllZC00MGFmLWJlZTQtOTM4MzhmMzlhNGYzIiwiaWF0IjoxNjY5MTA3MDIyLCJleHAiOjE4MjY3ODcwMjJ9.4x6F8nQyDiMaiARRMOpIV2YkbPrS4iKEEf3Qtm0SjDY'
        }
      })
        .then((res) => {
          // console.log(res)
          if (res.status === 200) {
            this.jumlah = res.data.data.length
            // console.log(this.jumlah)
            res.data.data.forEach((marker) => {
              marker.location_latitude = marker.location.coordinates[1]
              marker.location_longitude = marker.location.coordinates[0]
              marker.names = marker.name
              marker.plats = marker.plat_id
              marker.phones = marker.device_phone_number
              marker.trayeks = marker.trayek
              marker.types = marker.type
              this.km = marker.kilometers / 10000
              marker.kilometerss = Math.round(this.km)
              marker.icons = 'marker_blue.png'
              this.maps.push(marker)
            })
          }
        })
    },
    getDriver () {
      this.$axios.get('http://localhost:5050/drivers/get-driver', createToken())
      // this.$axios.get('http://192.168.43.172:5050/drivers/get-driver', createToken())
        .then((res) => {
          this.pengemudi = res.data.data.length
          // console.log(this.pengemudi)
        })
    },
    getPesanan () {
      this.$axios.get('http://localhost:5050/pesanan/get-pesanan', createToken())
      // this.$axios.get('http://192.168.18.6:5050/pesanan/get-pesanan', createToken())
        .then((res) => {
          this.pesanan = res.data.data.length
          // console.log(this.pesanan)
        })
    },
    log (a) {
    }
  }
}
</script>
<style scoped>
#mapContainer {
  width: 100vw;
  height: 100vh;
}
</style>
