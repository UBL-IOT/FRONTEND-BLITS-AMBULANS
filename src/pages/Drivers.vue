<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Pengemudi" icon="supervised_user_circle" />
      </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
      <q-table
        title="Detail Pengemudi"
        :rows="data"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination="pagination"
      >
        <template v-slot:top-right="props">
          <q-btn @click="new_customer=true" flat icon="library_add" text-color="blue-7">
            <q-tooltip>
              Tambah Data
            </q-tooltip>
          </q-btn>
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
          <q-input outlined dense debounce="300" v-model="props.filter" placeholder="Pencarian">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-status_driver="props">
          <q-td :props="props">
            <q-badge
              :color="(props.row.status_driver == '0')?'green'
              :(props.row.status_driver == '1'?'red':'red')
              "
              text-color="white"
              dense
              class="text-weight-bolder"
              square
            >{{`${ (props.row.status_driver == '0') ? 'AKTIF' :(props.row.status_driver == '1') ? 'TIDAK AKTIF' : 'SELESAI' }`}}
            </q-badge>
          </q-td>
        </template>
      </q-table>
    </q-card>
    </div>

    <q-dialog v-model="new_customer">
      <q-card class="my-card" flat bordered style="width: 600px; max-width: 60vw;">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="supervised_user_circle" size="40px" color="blue-7" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Data Pengemudi</q-item-label>
            <q-item-label caption>
              Tambah data pengemudi ambulans
            </q-item-label>
          </q-item-section>

          <q-item-section class="col-1">
            <q-btn flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-form @submit="onsubmit">

          <q-card-section horizontal>
            <q-card-section class="q-gutter-md fit">
              <q-input dense outlined v-model="instansi" label="Nama Instansi"/>
              <q-input dense outlined v-model="nama_driver" label="Nama Driver"/>
              <q-select
                  dense outlined
                  key="status"
                  v-model="status"
                  option-label="status"
                  :options="optionStatus"
                  label="Status"
              />
            </q-card-section>

            <q-separator vertical />

            <q-card-section class="q-gutter-md fit">
              <q-input dense outlined v-model="no_plat" label="No Plat"/>
              <q-input dense outlined v-model="alamat" label="Alamat"/>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-actions>
            <q-btn flat color="primary">
              Simpan
            </q-btn>
          </q-card-actions>

        </q-form>

      </q-card>
    </q-dialog>
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
  {
    name: 'instansi',
    align: 'left',
    label: 'NAMA INSTANSI',
    field: 'instansi',
    sortable: true
  },
  {
    name: 'no_plat',
    required: true,
    label: 'NO PLAT',
    align: 'left',
    field: row => row.no_plat,
    sortable: true
  },
  {
    name: 'nama_driver',
    align: 'left',
    label: 'NAMA PENGEMUDI',
    field: 'nama_driver',
    sortable: true
  },
  {
    name: 'alamat',
    align: 'left',
    label: 'ALAMAT',
    field: 'alamat',
    sortable: true
  },
  {
    name: 'status_driver',
    align: 'center',
    label: 'STATUS',
    field: 'status_driver',
    sortable: true
  }
]
const data = []

export default {
  data () {
    return {
      instansi: null,
      no_plat: null,
      nama_driver: null,
      alamat: null,
      columns,
      status: null,
      optionStatus: [
        'Aktif',
        'Tidak Aktif'
      ],
      data,
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
    this.getDriver()
  },
  methods: {
    getDriver () {
      this.$axios.get('http://192.168.43.172:5050/drivers/get-driver', createToken())
        .then((res) => {
          console.log(res)
          this.data = res.data.data
        })
    },
    onsubmit () {
      this.$axios.post('http://192.168.43.172:5050/drivers/input', {
        instansi: this.instansi,
        no_plat: this.no_plat,
        nama_driver: this.nama_driver,
        alamat: this.alamat,
        status: this.status
      }, createToken()).then((res) => {
        // console.log(res)
        if (res.data.status === true) {
          this.$router.push('/Drivers')
          this.$q.notify({
            message: 'berhasil input driver',
            color: 'green'
          })
        }
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

      const status = exportFile('change-request.csv', content, 'text/csv')

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
  .q-chip__content {
    display: block;
    text-align: center;
  }
</style>
