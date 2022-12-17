<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Ambulans" icon="local_shipping" />
      </q-breadcrumbs>
    </q-card>
    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
      <q-table
        title="Data ambulans"
        :rows="data"
        class="text-grey-7"
        :hide-header="mode === 'grid'"
        :columns="columns"
        row-key="name"
        :grid="mode=='grid'"
        :filter="filter"
        :pagination="pagination"
      >
        <template v-slot:top-right="props">
          <!-- <q-btn @click="new_customer=true" outline color="primary bg-green text-white" label="Tambah Kendaraan" class="q-mr-xs"/> -->
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
        <!-- <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="(props.row.status == 'Selesai')?'green'
              :(props.row.status == 'Tidak Aktif'?'red':'grey')
              "
              text-color="white"
              dense
              class="text-weight-bolder"
              square
              style="width: 85px"
            >{{props.row.status}}
            </q-chip>
          </q-td>
        </template> -->
      </q-table>
    </q-card>
    </div>
    <q-dialog v-model="new_customer">
      <q-card style="width: 600px; max-width: 60vw;">
        <q-card-section>
          <div class="text-h6">
            Tambah Baru Data Kendaraan
            <q-btn round flat dense icon="close" class="float-right" color="grey-8" v-close-popup></q-btn>
          </div>
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-section class="q-pt-none">
          <q-form class="q-gutter-md">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">No Plat</q-item-label>
                  <q-input dense outlined v-model="plat_id" label="No Plat" :rules="[val => !!val || 'Field is required']"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Nama Instansi</q-item-label>
                  <q-input dense outlined v-model="nama_po" label="Nama Instansi"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">Imei GPS</q-item-label>
                  <q-input dense outlined v-model="imei_gps" label="Imei GPS"/>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="q-pb-xs">No GPS</q-item-label>
                  <q-input dense outlined v-model="no_gps" label="No GPS"/>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn label="Simpan" type="submit" color="green" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { exportFile } from 'quasar'

function wrapCsvValue (val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val

  formatted =
      formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')

  return `"${formatted}"`
}
const columns = [
  {
    name: 'plat_id',
    align: 'left',
    label: 'NO PLAT',
    field: 'plat_id',
    sortable: true
  },
  {
    name: 'name',
    required: true,
    label: 'NAMA INSTANSI',
    align: 'left',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'device_id',
    align: 'left',
    label: 'IMEI GPS',
    field: 'device_id',
    sortable: true
  },
  {
    name: 'device_phone_number',
    align: 'left',
    label: 'NO GPS',
    field: 'device_phone_number',
    sortable: true
  }
]

const data = []

export default {
  data () {
    return {
      plat_id: '',
      name: '',
      device_id: '',
      device_phone_number: '',
      columns,
      data,
      filter: '',
      guid_po: '2bfab8ff-304e-42e9-b200-9fb9140f0432',
      customer: {},
      new_customer: false,
      mode: 'list',
      pagination: {
        rowsPerPage: 10
      }
    }
  },
  created () {
    this.getKendaraan()
  },
  methods: {
    getKendaraan () {
      this.$axios.post('https://api-kopamas-carter.pptik.id:5121/api.v1/vehicles/po-get', {
        guid_po: this.guid_po
      }, {
        headers: {
          'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJndWlkIjoiNzNhZjk3YjQtNTllZC00MGFmLWJlZTQtOTM4MzhmMzlhNGYzIiwiaWF0IjoxNjY5MTA3MDIyLCJleHAiOjE4MjY3ODcwMjJ9.4x6F8nQyDiMaiARRMOpIV2YkbPrS4iKEEf3Qtm0SjDY'
        }
      })
        .then((res) => {
          console.log(res)
          if (res.data.status === true) {
            this.data = res.data.data
          } else {
            this.$.notify({
              color: 'negative',
              message: 'data tidak dapat dimuat'
            })
          }
        })
    },
    createKendaraan () {
      this.$axios.post('', {
        plat_id: this.plat_id,
        name: this.name,
        device_id: this.device_id,
        device_phone_number: this.device_phone_number
      }
        .then((res) => {
          console.log(res)
        })
      )
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
