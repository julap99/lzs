<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-semibold">Laporan</h1>
      <p class="text-sm text-gray-500">Sub Modul: Mengurus Pelaporan (Bantuan)</p>
    </div>

    <rs-tab type="card" variant="primary" justify="left">
      <TabBlock title="Bantuan">
        <div class="rounded-2xl border border-gray-200 bg-[#F3F8FF] mt-2">
          <div class="px-5 pt-4">
            <FormKit type="search" v-model="search.bantuan" placeholder="Search..." outer-class="mb-3 max-w-xs" />
          </div>
          <div class="p-4 bg-white mx-4 mb-4 rounded-xl border border-gray-200">
            <rs-table
              :field="['namaLaporan','pilih']"
              :columns="[
                { key: 'namaLaporan', label: 'Nama Laporan' },
                { key: 'pilih', label: 'Tindakan' }
              ]"
              :data="filtered('bantuan')"
              :advanced="true"
              :show-search="false"
              :show-filter="false"
              :show-no-column="true"
              :options="{ variant: 'default', striped: true, bordered: false, borderless: true, hover: true }"
              :options-advanced="{ sortable: false, filterable: false, responsive: false, outsideBorder: false }"
              :page-size="pageSize.bantuan"
            >
              <template #pilih="{ value }">
                <div class="text-right">
                  <rs-button
                    variant="ghost"
                    size="sm"
                    class="!px-2 !py-1 text-blue-600 hover:text-blue-800"
                    @click="onPick(value)"
                    title="Pilih"
                    aria-label="Pilih"
                  >
                    <Icon name="material-symbols:fact-check-outline" class="w-5 h-5" />
                  </rs-button>
                </div>
              </template>
            </rs-table>
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-2 text-sm">
                <span>Baris per halaman:</span>
                <FormKit type="select" :options="pageOptions" v-model="pageSize.bantuan" outer-class="mb-0 w-24" />
              </div>
            </div>
          </div>
        </div>
      </TabBlock>

      <TabBlock title="Tuntutan">
        <div class="rounded-2xl border border-gray-200 bg-[#F3F8FF] mt-2">
          <div class="px-5 pt-4">
            <FormKit type="search" v-model="search.tuntutan" placeholder="Search..." outer-class="mb-3 max-w-xs" />
          </div>
          <div class="p-4 bg-white mx-4 mb-4 rounded-xl border border-gray-200">
            <rs-table
              :field="['namaLaporan','pilih']"
              :columns="[{key:'namaLaporan',label:'Nama Laporan'},{key:'pilih',label:'Pilih'}]"
              :data="filtered('tuntutan')"
              :advanced="true"
              :show-search="false"
              :show-filter="false"
              :show-no-column="true"
              :options="{ variant: 'default', striped: true, bordered: false, borderless: true, hover: true }"
              :options-advanced="{ sortable: false, filterable: false, responsive: false, outsideBorder: false }"
              :page-size="pageSize.tuntutan"
            >
              <template #pilih="{ value }">
                <div class="text-right">
                  <rs-button size="sm" @click="onPick(value)">Pilih</rs-button>
                </div>
              </template>
            </rs-table>
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-2 text-sm">
                <span>Baris per halaman:</span>
                <FormKit type="select" :options="pageOptions" v-model="pageSize.tuntutan" outer-class="mb-0 w-24" />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </TabBlock>

      <TabBlock title="Program">
        <div class="rounded-2xl border border-gray-200 bg-[#F3F8FF] mt-2">
          <div class="px-5 pt-4">
            <FormKit type="search" v-model="search.program" placeholder="Search..." outer-class="mb-3 max-w-xs" />
          </div>
          <div class="p-4 bg-white mx-4 mb-4 rounded-xl border border-gray-200">
            <rs-table
              :field="['namaLaporan','pilih']"
              :columns="[{key:'namaLaporan',label:'Nama Laporan'},{key:'pilih',label:'Pilih'}]"
              :data="filtered('program')"
              :advanced="true"
              :show-search="false"
              :show-filter="false"
              :show-no-column="true"
              :options="{ variant: 'default', striped: true, bordered: false, borderless: true, hover: true }"
              :options-advanced="{ sortable: false, filterable: false, responsive: false, outsideBorder: false }"
              :page-size="pageSize.program"
            >
              <template #pilih="{ value }">
                <div class="text-right">
                  <rs-button size="sm" @click="onPick(value)">Pilih</rs-button>
                </div>
              </template>
            </rs-table>
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-2 text-sm">
                <span>Baris per halaman:</span>
                <FormKit type="select" :options="pageOptions" v-model="pageSize.program" outer-class="mb-0 w-24" />
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </TabBlock>
    </rs-tab>
  </div>
</template>

<script setup>
import { reactive, inject, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'

// access selectedTitle provided by RsTab
const selectedTitle = inject('selectedTitle')

const pageOptions = [
  { label: '10', value: 10 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
]

const pageSize = reactive({ bantuan: 10, tuntutan: 10, program: 10 })
const search = reactive({ bantuan: '', tuntutan: '', program: '' })

const rows = reactive({
  // ✅ Exactly three items, in the requested order
  bantuan: [
    { namaLaporan: 'Laporan Permohonan Bantuan' },
    { namaLaporan: 'Laporan Status Siasatan Lapangan' },
    { namaLaporan: 'Surat Kelulusan Bantuan' },
  ],
  tuntutan: [
    { namaLaporan: 'Senarai Tuntutan Tergendala' },
    { namaLaporan: 'Tuntutan Selesai Mengikut Tempoh' },
  ],
  program: [
    { namaLaporan: 'Program Bantuan Berkala' },
    { namaLaporan: 'Analitik Program Mengikut Bajet' },
  ],
})

function filtered(key) {
  const q = (search[key] || '').toLowerCase()
  if (!q) return rows[key]
  return rows[key].filter(r => r.namaLaporan.toLowerCase().includes(q))
}

const router = useRouter()

function onPick(row) {
  const reportName = row?.namaLaporan
  let route = ''

  switch (reportName) {
    case 'Laporan Permohonan Bantuan':
      route = '/BF-BTN/pelaporan/laporan-permohonan-bantuan'
      break
    case 'Laporan Status Siasatan Lapangan':
      route = '/BF-BTN/pelaporan/laporan-status-siasatan-lapangan'
      break
    case 'Surat Kelulusan Bantuan':
      route = '/BF-BTN/pelaporan/surat-kelulusan-bantuan'
      break
    default:
      console.warn('Unknown report selected:', reportName)
      return
  }

  try {
    router.push(route)
  } catch (e) {
    console.warn('Router unavailable', e)
  }
}

// Wrapper untuk guna provide/inject dari RsTab
const TabBlock = defineComponent({
  name: 'TabBlock',
  props: { title: { type: String, required: true } },
  setup(props, { slots }) {
    const selectedTitle = inject('selectedTitle')
    return () =>
      h(
        'div',
        { style: { display: (selectedTitle && selectedTitle.value === props.title) ? '' : 'none' } },
        slots.default ? slots.default() : []
      )
  }
})
</script>

<style scoped>
/* Optional: focus states for buttons */
button:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,0.5); }
</style>
