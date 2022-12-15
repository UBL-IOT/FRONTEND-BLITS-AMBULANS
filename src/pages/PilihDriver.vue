<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" icon="home" />
          <q-breadcrumbs-el label="Pemesanan" icon="perm_phone_msg" />
          <q-breadcrumbs-el class="text-grey-7" label="Pilih Pengemudi" icon="verified" />
        </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
          title="Data pemesanan"
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
                Pemesanan Kendaraan <br>
                Id Pemesanan: {{this.guid}}
              </div>
              <p class="text-caption">
                Pilihkan driver yang sedang bertugas dengan status aktif.
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
                  style="width: 300px"
                  color="primary"
                  v-model="filter"
                  dense
                />
              </div>
            </q-slide-transition>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td class="text-uppercase" key="instansi" :props="props">{{ props.row.data_driver.instansi }}</q-td>
              <q-td class="text-uppercase" key="nama_driver" :props="props">{{ props.row.data_driver.nama_driver }}</q-td>
              <q-td class="text-uppercase" key="no_plat" :props="props">{{ props.row.data_driver.no_plat }}</q-td>
              <!-- <q-td key="tanggal" :props="props">{{this.$parseDate(props.row.tanggal).fullDate}}</q-td> -->
              <q-td key="status" :props="props"><q-badge :color="(props.row.status == '0') ? 'orange-7' :(props.row.status == '1') ? 'blue-7' : 'green-7'">{{`${ (props.row.status == '0') ? 'MENUNGGU' :(props.row.status == '1') ? 'PROSES' : 'SELESAI' }`}}</q-badge></q-td>
              <q-td key="aksi" :props="props">
              <div class="justify-center q-gutter-x-xs">
                <q-btn color="blue-7" @click="Onclick" dense>
                  <q-icon left size="xs" name="supervised_user_circle" />
                  <div>Pilih</div>
                </q-btn>
              </div>
            </q-td>
            </q-tr>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="(props.row.status == 'Harga Diterima')?'green'
                :(props.row.status == 'Batal'?'red':'grey')
                "
                text-color="white"
                dense
                align="center"
                class="text-weight-bolder"
                square
                style="width: 100px"
              >{{props.row.status}}
              </q-chip>
            </q-td>
          </template>
        </q-table>

        <!-- <q-dialog v-model="drivers">
          <q-card class="my-card" flat bordered style="width: 90%; max-width: 80vw;">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <q-icon name="supervised_user_circle" size="40px" color="blue-7" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>Data Driver</q-item-label>
                <q-item-label caption>
                  Pilih driver yang akan menjemput
                </q-item-label>
              </q-item-section>

              <q-item-section class="col-1">
                <q-btn flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section>
              <q-table
                grid
                :rows="rowx"
                :columns="columnx"
                row-key="name"
                :filter="filter"
                hide-header
              >
                <template v-slot:top>
                  <div class="col">
                    <div class="col-2 q-table__title text-subtitle2">
                      KODE PESANAN : BLITS-001
                    </div>
                  </div>
                </template>

                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>
              </q-table>
            </q-card-section>

          </q-card>
        </q-dialog> -->
      </q-card>
    </div>

  </q-page>
</template>

<script>
import { exportFile } from 'quasar'
import createToken from 'src/boot/create_token'

// const columnx = [
//   { name: 'nama_driver', required: true, label: 'NAMA DRIVER', align: 'left', field: 'nama_driver', sortable: true },
//   { name: 'no_plat', label: 'NO. PLAT', field: 'no_plat', sortable: true },
//   { name: 'no_handphone', align: 'center', label: 'NO. HANDPHONE', field: 'no_handphone', sortable: true },
//   { name: 'action', label: '', field: 'action' }
// ]

// const rowx = [
//   { nama_driver: 'Frozen Yogurt', no_plat: 159, no_handphone: 6.0, action: 24 },
//   { nama_driver: 'Ice cream sandwich', no_plat: 237, no_handphone: 9.0, action: 37 },
//   { nama_driver: 'Eclair', no_plat: 262, no_handphone: 16.0, action: 23 }
// ]

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val

  formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}

const columns = [
  { name: 'instansi', align: 'left', label: 'NAMA INSTANSI', field: 'instansi', sortable: true },
  { name: 'nama_driver', align: 'left', label: 'NAMA DRIVER', field: 'nama_driver', sortable: true },
  { name: 'no_plat', align: 'left', label: 'NO PLAT', field: 'no_plat', sortable: true },
  // { name: 'kode_pesanan', align: 'left', label: 'KODE', field: 'kode_pesanan', sortable: true },
  // { name: 'username', align: 'left', label: 'NAMA PEMESAN', field: 'username', sortable: true },
  // { name: 'no_telpon', align: 'left', label: 'NO. HANDPHONE', field: 'no_telpon', sortable: true },
  // { name: 'titik_jemput', align: 'left', label: 'TITIK JEMPUT', field: 'titik_jemput', sortable: true },
  // { name: 'tujuan', required: true, label: 'TUJUAN', align: 'left', field: row => row.tujuan, sortable: true },
  // { name: 'tanggal', align: 'left', label: 'TGL. PEMESANAN', field: 'tanggal', sortable: true },
  // { name: 'status', align: 'left', label: 'STATUS', field: 'status', sortable: true },
  { name: 'aksi', align: 'center', label: 'Pilih Driver', field: 'aksi', sortable: true }
  // { name: 'pilih_driver', align: 'center', label: 'Pilih Driver', field: 'pilih_driver', sortable: true }
]

const data = []

export default {
  data () {
    return {
      // columnx,
      // rowx,
      visibles: false,
      dataUser: this.$q.localStorage.getItem('dataUser'),
      columns,
      data,
      phonex: '',
      phoneData: '',
      driver: '',
      // drivers: false,
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
  created () {
    this.getPesanan()
    // this.onPilihDriver()
  },
  methods: {
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

      const status = exportFile('change-request.csv', content, 'text/csv')

      if (status !== true) {
        this.$q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    getPesanan () {
      // this.$axios.get('http://localhost:5050/pesanan/get-pesanan', createToken())
      this.$axios.get(`http://192.168.43.172:5050/pesanan/${this.$route.params.guid}`, createToken())
        .then((res) => {
          console.log(res)
          this.data = res.data.data
          res.data.data.forEach((phonex) => {
            phonex.phones = phonex.data_user.no_telpon
            this.phoneData = phonex.phones.replace('0', '62')
            this.guid = phonex.guid
            console.log(this.phoneData)
          })
        })
    },
    Onclick () {
    }
  }
}
</script>
<style>
</style>
