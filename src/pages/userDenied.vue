<template>
  <q-page>
    <q-card class="q-pa-md q-ma-md">
      <q-card-section>
        <div class="text-h6 text-indigo-8">
          Users Denied
        </div>
        <div class="text-subtitle2">
          Data users yang tidak di verifikasi
        </div>
      </q-card-section>

      <q-separator></q-separator>
      <q-card-section class="q-pa-none q-ma-none">
        <q-table class="no-shadow no-border"
          :rows="usersDenied"
          :columns="columns"
          row-key="name"
          :pagination="initialPagination">
          <template v-slot:body="props">
            <q-tr :props="props" v-if="props.row.verifikasi === 2">
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
                  <q-badge color="red">Denied</q-badge>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import createToken from 'src/boot/create_token'

const columns = [
  { name: 'fullname', label: 'Nama Lengkap', field: 'fullname', sortable: true, align: 'left' },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'center' },
  { name: 'no_telpon', label: 'No. Telpon', field: 'no_telpon', sortable: true, align: 'center', class: 'text-bold' },
  { name: 'status', label: 'Status', field: 'status', sortable: true, align: 'center', class: 'text-bold' }
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
      const response = await this.$axios.get('users/get-all', createToken()).finally(() => this.$q.loading.hide())
      this.usersDenied = response.data.data
    }
  }
}
</script>
