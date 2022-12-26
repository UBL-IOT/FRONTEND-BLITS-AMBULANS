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
                Pemilihan Pengemudi
              </div>
              <p class="text-caption">
                Id Pemesanan: <span class="text-blue"> {{this.guid}} </span><br>
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
              <q-td class="text-uppercase" key="instansi" :props="props">
                {{ props.row.instansi }}
              </q-td>
              <q-td class="text-uppercase" key="nama_driver" :props="props">
                {{ props.row.nama_driver }}
              </q-td>
              <q-td class="text-uppercase" key="no_plat" :props="props">
                {{ props.row.no_plat }}
              </q-td>
              <!-- <q-td class="text-uppercase" key="status_driver" :props="props">{{ props.row.status_driver }}</q-td> -->
              <q-td key="status_driver" :props="props"><q-badge :color="(props.row.status_driver == '0') ? 'orange-7' :(props.row.status_driver == '1') ? 'blue-7' : 'green-7'">
                {{`${ (props.row.status_driver == '0') ? 'AKTIF' :(props.row.status_driver == '1') ? 'TIDAK AKTIF' : 'SELESAI' }`}}
              </q-badge></q-td>
              <q-td key="aksi" :props="props">
              <div class="justify-center q-gutter-x-xs">
                <q-btn color="blue-7" @click="Pilih(props.row.guid)" dense>
                  <q-icon left size="xs" name="supervised_user_circle" />
                  <div>Pilih</div>
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
  // { name: 'instansi', align: 'left', label: 'NAMA INSTANSI', field: 'instansi', sortable: true },
  { name: 'nama_driver', align: 'left', label: 'NAMA DRIVER', field: 'nama_driver', sortable: true },
  { name: 'no_plat', align: 'left', label: 'NO PLAT', field: 'no_plat', sortable: true },
  { name: 'status_driver', align: 'center', label: 'STATUS DRIVER', field: 'status_driver', sortable: true },
  { name: 'aksi', align: 'center', label: 'Pilih Driver', field: 'aksi', sortable: true }
]

const data = []

export default {
  data () {
    return {
      visibles: false,
      dataUser: this.$q.localStorage.getItem('dataUser'),
      columns,
      data,
      phonex: '',
      statusx: '',
      status_pesanan: 1,
      status_driver: 1,
      guid: '',
      guidd: '',
      pilih: '',
      phoneData: '',
      driver: '',
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
    this.getDriver()
  },
  methods: {
    getPesanan () {
      this.$q.loading.show()
      this.$axios.get(`http://localhost:5050/pesanan/${this.$route.params.guid}`, createToken())
      // this.$axios.get(`http://192.168.18.6:5050/pesanan/${this.$route.params.guid}`, createToken())
        .finally(() => this.$q.loading.hide())
        .then((res) => {
          // console.log(res)
          res.data.data.forEach((phonex) => {
            this.guid = phonex.guid
            // this.status_pesanan = phonex.status_pesanan
            // console.log(this.status_pesanan)
          })
        })
    },
    getDriver () {
      this.$axios.get('http://localhost:5050/drivers/get-driver', createToken())
      // this.$axios.get('http://192.168.18.6:5050/drivers/get-driver', createToken())
        .then((res) => {
          // console.log(res)
          res.data.data.forEach((statusx) => {
            if (statusx.status_driver === 0) {
              this.data.push(statusx)
              // this.data = res.data.data
            }
          })
        })
    },
    Pilih (guid) {
      this.$axios.put('http://localhost:5050/drivers/' + guid, {
      // this.$axios.put('http://192.168.18.6:5050/drivers/' + guid, {
        status_driver: this.status_driver,
        status_pesanan: this.status_pesanan,
        id_pesanan: this.guid,
        guid_driver: guid
        // guid:
      }, createToken())
        .then((res) => {
          // console.log(res)
          // this.getDriver()
          this.$router.push({ name: 'daftarPesanan' })
        })
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

      const status = exportFile('pilih-pengemudi.csv', content, 'text/csv')

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
