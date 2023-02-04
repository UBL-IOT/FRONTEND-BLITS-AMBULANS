<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Home" icon="home" />
        <q-breadcrumbs-el class="text-grey-7" label="Pengguna Tertolak" icon="do_disturb" />
      </q-breadcrumbs>
    </q-card>

    <div class="col q-col-gutter-md q-ma-md q-mt-lg">
      <q-card>
        <q-table
          :rows="usersDenied"
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
                Data Pengguna Tertolak
              </div>
              <p class="text-caption">
                Daftar pengguna yang tertolak verifikasi admin
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
            <q-tr class="text-uppercase" :props="props" v-if="props.row.verifikasi == 2 && props.row.role == 2">
              <q-td key="fullname" :props="props">
                {{ props.row.fullname }}
              </q-td>
              <q-td key="email" :props="props">
                {{ props.row.email == null ? 'Belum ada email' : props.row.email }}
              </q-td>
              <q-td class="text-bold" key="no_telpon" :props="props">
                {{ props.row.no_telpon }}
              </q-td>
              <q-td class="text-bold" key="status" :props="props">
                <q-badge color="red"><q-icon name="do_disturb" size="14px" class="q-mr-xs"/> Denied</q-badge>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card>
    </div>

  </q-page>
</template>
<script>
import createToken from 'src/boot/create_token'

const columns = [
  { name: 'fullname', label: 'NAMA LENGKAP', field: 'fullname', sortable: true, align: 'left' },
  { name: 'email', label: 'EMAIL', field: 'email', sortable: true, align: 'center' },
  { name: 'no_telpon', label: 'NOMOR TELEPON', field: 'no_telpon', sortable: true, align: 'center', class: 'text-bold' },
  { name: 'status', label: 'STATUS', field: 'status', sortable: true, align: 'center', class: 'text-bold' }
]

export default {
  data () {
    return {
      initialPagination: {
        sortBy: 'desc',
        descending: false,
        rowsPerPage: 50
      },
      data: [],
      usersDenied: [],
      columns
    }
  },
  async created () {
    await this.getCustomers()
  },
  methods: {
    async getCustomers () {
      this.$q.loading.show()
      const response = await this.$axios.get('users/get/all', createToken()).finally(() => this.$q.loading.hide())
      this.usersDenied = response.data.data
    }
  }
}
</script>
