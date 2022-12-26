<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Pemesanan" icon="perm_phone_msg" />
          <q-breadcrumbs-el class="text-grey-7" label="Daftar Pesanan" icon="playlist_add_check_circle" />
        </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
          title="Daftar pesanan"
          :rows="data"
          class="text-grey-7"
          :hide-header="mode === 'grid'"
          :columns="columns"
          row-key="name"
          :grid="mode=='grid'"
          :filter="filter"
          :pagination="pagination"
        >
          <template v-slot:top>
            <div class="col">
              <div class="col-2 q-table__title">
                Daftar Pemesanan
              </div>
              <p class="text-caption">
                Daftar pemesanan yang sedang berjalan
              </p>
            </div>

            <q-space />

            <q-btn
              flat
              icon-right="document_scanner"
              text-color="blue-7"
              @click="exportTable"
            >
              <q-tooltip>
                Export Data
              </q-tooltip>
            </q-btn>

            <q-btn
              flat
              color="primary"
              icon="search"
              @click="visibles = !visibles"
              size="md"
              class="q-mr-sm"
            />
            <q-slide-transition>
              <div v-show="visibles">
                <q-input
                  outlined
                  debounce="300"
                  placeholder="Pencarian"
                  style="width: 200px"
                  color="primary"
                  v-model="filter"
                  dense
                />
              </div>
            </q-slide-transition>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td class="text-uppercase" key="nama_driver" :props="props">{{ props.row.data_driver.nama_driver }}</q-td>
              <q-td class="text-uppercase" key="no_plat" :props="props">{{ props.row.data_driver.no_plat }}</q-td>
              <q-td class="text-uppercase" key="username" :props="props">{{ props.row.data_user.username }}</q-td>
              <q-td class="text-uppercase" key="kode_pesanan" :props="props">{{ props.row.kode_pesanan }}</q-td>
              <q-td class="text-weight-bold text-blue-7" key="no_telpon" :props="props"><a target="_blank" style="text-decoration: none;" :href="'https://api.whatsapp.com/send?phone=' + this.phoneData">{{ props.row.data_user.no_telpon }}<q-tooltip>CHAT WHATSAPP</q-tooltip></a></q-td>
              <q-td class="text-weight-bold text-blue-7" key="titik_jemput" :props="props"><a target="_blank" style="text-decoration: none;" :href="'https://www.google.com/maps/?q=' + props.row.titik_jemput_lat + ',' + props.row.titik_jemput_long">{{ props.row.titik_jemput.substring(0,10)+"..." }}</a></q-td>
              <q-td class="text-weight-bold text-blue-7" key="tujuan" :props="props"><a target="_blank" style="text-decoration: none;" :href="'https://www.google.com/maps/?q=' + props.row.tujuan_lat + ',' + props.row.tujuan_long">{{ props.row.tujuan.substring(0,10)+"..." }}</a></q-td>
              <q-td key="tanggal" :props="props">{{ new Date (props.row.tanggal).toLocaleDateString('id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}) }}</q-td>
              <!-- <q-td key="tanggal" :props="props">{{this.$parseDate(props.row.tanggal).fullDate}}</q-td> -->
              <q-td key="status_pesanan" :props="props"><q-badge :color="(props.row.status_pesanan == '0') ? 'orange-7' :(props.row.status_pesanan == '1') ? 'blue-7' : 'green-7'">{{`${ (props.row.status_pesanan == '0') ? 'MENUNGGU' :(props.row.status_pesanan == '1') ? 'PROSES' : 'SELESAI' }`}}</q-badge></q-td>
              <q-td key="aksi" :props="props">
              <div class="justify-center q-gutter-x-xs">
                <q-btn
                  color="blue-7"
                  @click="Cancel"
                  dense>
                  <div class="text-uppercase">batal</div>
                </q-btn>
              </div>
            </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import { exportFile } from 'quasar'
import createToken from 'src/boot/create_token'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val

  formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

const columns = [
  { name: 'nama_driver', align: 'left', label: 'NAMA DRIVER', field: 'nama_driver', sortable: true },
  { name: 'no_plat', align: 'left', label: 'NO PLAT', field: 'no_plat', sortable: true },
  { name: 'username', align: 'left', label: 'NAMA PEMESAN', field: 'username', sortable: true },
  { name: 'kode_pesanan', align: 'left', label: 'KODE', field: 'kode_pesanan', sortable: true },
  { name: 'no_telpon', align: 'left', label: 'NO. HANDPHONE', field: 'no_telpon', sortable: true },
  { name: 'titik_jemput', align: 'left', label: 'TITIK JEMPUT', field: 'titik_jemput', sortable: true },
  { name: 'tujuan', required: true, label: 'TUJUAN', align: 'left', field: row => row.tujuan, sortable: true },
  { name: 'tanggal', align: 'left', label: 'TGL. PEMESANAN', field: 'tanggal', sortable: true },
  { name: 'status_pesanan', align: 'left', label: 'STATUS', field: 'status_pesanan', sortable: true },
  { name: 'aksi', align: 'center', label: 'AKSI', field: 'aksi', sortable: true }
]

const data = []

export default {
  data () {
    return {
      visibles: false,
      dataUser: this.$q.localStorage.getItem('dataUser'),
      columns,
      data,
      status_pesanan: 0,
      status_driver: 0,
      nama_driver: '',
      phonex: '',
      phoneData: '',
      drivers: '',
      guid: '',
      optionPilih_driver: [],
      filter: '',
      customer: {},
      new_customer: false,
      mode: 'list',
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  mounted () {
    this.getPesanan()
  },
  methods: {
    getPesanan () {
      this.$q.loading.show()
      this.$axios.get('http://localhost:5050/pesanan/get-pesanan', createToken())
      // this.$axios.get('http://192.168.18.6:5050/pesanan/get-pesanan', createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          res.data.data.forEach(pesanan => {
            pesanan.driver = pesanan.data_driver.status_driver
            pesanan.status = pesanan.status_pesanan
            // console.log(pesanan.driver)
            if (pesanan.status === 1) {
              this.data.push(pesanan)
              // this.data = res.data.data
              // console.log(this.data)
            }
          })
        })
    },
    Cancel () {
      // Fungsi Untuk Membatalkan Driver
      // this.$axios.put(`http://192.168.18.6:5050/pesanan/update-pesanan/${this.$route.params.guid}`, {
      //   status_pesanan: this.status_pesanan,
      //   status_driver: this.status_driver
      // }, createToken())
      //   .then((res) => {
      //     // console.log(res)
      //     this.$router.push({ name: 'order' })
      //   })
      // End Cancel Driver
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === 'function'
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(',')
          )
        )
        .join('\r\n')

      const status = exportFile('daftar-pesanan.csv', content, 'text/csv')

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    }
  }
}
</script>
<style>
</style>
