<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Dashboard" icon="widgets" />
      </q-breadcrumbs>
    </q-card>

    <q-card class="q-pa-md q-ma-md">
      <q-card-section class="text-h6 q-pb-none">
        <q-item >
          <q-item-section avatar class="">
            <q-icon color="blue" name="key" size="44px"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <div class="text-h6">Users Validation</div>
            </q-item-label>
            <q-item-label caption class="text-black">
              Monitoring new users. Tracking users, and shipping status here.
            </q-item-label>
          </q-item-section>

        </q-item>
        <div class="row q-mt-sm q-gutter-md"></div>
      </q-card-section>

      <q-card-section class="q-pa-none q-ma-none">
        <q-table class="no-shadow no-border"
          :rows="data"
          :columns="columns"
          row-key="name"
          :pagination="pagination">
          <template v-slot:body="props">
            <q-tr :props="props" v-if="props.row.verifikasi === 0 && props.row.role === '2'">
              <q-td key="fullname" :props="props">
                <q-item>

                  <q-item-section>
                    <q-avatar square>
                      <!-- <img :src="props.row.prod_img"/> -->
                      <img src="../../public/avatar.png"/>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ props.row.fullname }}</q-item-label>
                    <q-badge v-if="props.row.role === '2'" :color="props.row.verifikasi === 0 ? 'orange' :props.row.role === '3' ? 'red' : 'primari'">
                      {{ props.row.verifikasi === 0 ? 'unverified' : 'verified' }}
                      <!-- {{ props.row.verifikasi === 0 ? 'unverified' :props.row.role === '3' ? 'driver' :props.row.role === '1' ? 'admin' : 'teal' }} -->
                    </q-badge>
                  </q-item-section>
                </q-item>
              </q-td>
              <q-td key="email" :props="props">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ props.row.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
              <q-td key="no_telpon" :props="props">
                <q-item>
                  <q-item-section>
                    <q-item-label>{{ props.row.no_telpon }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-td>
              <q-td key="status" :props="props">
                <div class="text-grey-8 q-gutter-xs">
                  <q-badge :color="props.row.role === '1' ? 'orange' :props.row.role === '2' ? 'red' : 'primary'">
                    {{ props.row.role === '3' ? 'Driver' :props.row.role === '2' ? 'Users' : 'Admins' }}
                  </q-badge>
                </div>
              </q-td>
              <q-td key="aksi" :props="props">
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn @click="denied (props.row.guid)" v-if="props.row.role === '2'" :disable="props.row.verifikasi === 1" class="gt-xs" size="md" flat color="red" dense round icon="close"/>
                  <q-btn @click="verified (props.row.guid)" v-if="props.row.role === '2'" :disable="props.row.verifikasi === 1" size="md" flat dense round color="blue" icon="add_task"/>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
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
              style="height: 435px; width: 100%"
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
                  <div v-if="jumlah === null || jumlah === undefined" class="text-h4 text-red-7 text-weight-bold">-</div>
                  <div v-else class="text-h4 text-red-7 text-weight-bold">{{ jumlah }}</div>
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
                  <div v-if="pesanan === null || pesanan === undefined" class="text-h4 text-red-7 text-weight-bold">-</div>
                  <div v-else class="text-h4 text-red-7 text-weight-bold">{{pesanan}}</div>
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
                  <div v-if="pengemudi === null || pengemudi === undefined" class="text-h4 text-red-7 text-weight-bold">-</div>
                  <div v-else class="text-h4 text-red-7 text-weight-bold">{{ pengemudi }}</div>
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

const columns = [
  { name: 'fullname', label: 'Nama Lengkap', field: 'fullname', sortable: true, align: 'left' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'center' },
  { name: 'no_telpon', label: 'No. Telpon', field: 'no_telpon', sortable: true, align: 'center', class: 'text-bold' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'center', class: 'text-bold' },
  { name: 'aksi', label: 'Aksi', field: 'aksi', sortable: true, align: 'center', class: 'text-bold' }
]

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
      columns,
      data: [],
      pagination: {
        rowsPerPage: 50
      },
      map: {
        loaded: false,
        tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: 'contributors <a href="">BLITS Ambulans</a>',
        center: L.latLng([-5.422083333333333, 105.25802]),
        zoom: 12,
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
      verifikasi: '',
      guid: '',
      guid_po: '2bfab8ff-304e-42e9-b200-9fb9140f0432'
    }
  },
  async created () {
    await this.getKendaraan()
    await this.getDriver()
    await this.getPesanan()
    await this.getCustomers()
    this.map.loaded = true
  },
  methods: {
    async getKendaraan () {
      this.$q.loading.show()
      this.$axios.post('https://api-kopamas-carter.pptik.id:5121/api.v1/vehicles/po-get', {
        guid_po: this.guid_po
      }, {
        headers: {
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiNzNhZjk3YjQtNTllZC00MGFmLWJlZTQtOTM4MzhmMzlhNGYzIiwiaWF0IjoxNjY5MTA3MDIyLCJleHAiOjE4MjY3ODcwMjJ9.4x6F8nQyDiMaiARRMOpIV2YkbPrS4iKEEf3Qtm0SjDY'
        }
      }).finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.status === 200) {
            this.jumlah = res.data.data.length
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
        }).catch(() => this.$commonErrorNotif())
    },
    getDriver () {
      this.$q.loading.show()
      this.$axios.get('drivers/get-driver', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          this.pengemudi = res.data.data.length
        })
    },
    getPesanan () {
      this.$q.loading.show()
      this.$axios.get('pesanan/get-pesanan', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          this.pesanan = res.data.data.length
        })
    },
    getCustomers () {
      this.$q.loading.show()
      this.$axios.get('users/get-all/', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          if (res.data.status) {
            this.data = res.data.data
          }
        })
    },
    verified (guid) {
      this.$axios.put(`users/user-update/${guid}`, {
        verifikasi: 1
      }, createToken())
        .then((res) => {
          if (res.data.status === true) {
            this.$router.push({ name: 'userVerified' })
          }
        })
    },
    denied (guid) {
      this.$axios.put(`users/user-update/${guid}`, {
        verifikasi: 2
      }, createToken())
        .then((res) => {
          if (res.data.status === true) {
            this.$router.push({ name: 'userDenied' })
          }
        })
    }
  }
}
</script>
