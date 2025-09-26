<template>
  <div class="p-4">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <RsCard class="mt-4 p-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kemaskini Level Kelulusan</h2>
        </div>
      </template>

      <template #body>
        <div v-if="loading" class="py-8 text-gray-500">Memuatkan...</div>
        <div v-else-if="!form" class="py-8 text-red-600">Rekod tidak ditemui.</div>

        <form v-else @submit.prevent="onSubmit" class="space-y-4">
          <!-- Top: basic fields in 5-col grid -->
          <div class="form-grid gap-x-4 gap-y-3">
            <label class="lbl">Table Name :</label>
            <input v-model.trim="form.tableName" type="text" class="inpt" required />
            <div></div>
            <label class="lbl">ID Row Table :</label>
            <input v-model.number="form.idRowTable" type="number" min="1" class="inpt inpt-sm" required />

            <div></div><div></div><div></div>
            <label class="lbl">Level Type :</label>
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="levelTypeChecked" />
              <span>row</span>
            </label>
          </div>

          <!-- ROW A: Level (left) | Status + Status Data (right) -->
          <div class="pair-row">
            <!-- Left: LEVEL -->
            <div class="pair-col">
              <div class="flex items-center justify-between mb-2">
                <label class="font-medium">Level :</label>
                <rs-button type="button" variant="success" size="sm" @click="addLevel">+ Tambah Baris</rs-button>
              </div>
              <div class="space-y-2">
                <div v-for="(row, i) in levelRowsText" :key="'lv-'+i" class="flex items-center gap-2">
                  <input v-model.trim="levelRowsText[i]" placeholder='{"Flow":"1","Tahap":"1","Value":"Semak"}' class="inpt flex-1" required />
                  <rs-button type="button" variant="danger" size="sm" class="shrink-0" @click="removeLevelAt(i)" :disabled="levelRowsText.length <= 1">Buang</rs-button>
                </div>
              </div>
            </div>

            <!-- Right: STATUS + STATUS DATA -->
            <div class="pair-col">
              <div class="font-medium mb-2">Status</div>
              <div class="flex items-center gap-8 mb-3">
                <label class="inline-flex items-center gap-2">
                  <input type="checkbox" v-model="form.isActive" />
                  <span>Aktif</span>
                </label>
                <label class="inline-flex items-center gap-2">
                  <input type="checkbox" :checked="!form.isActive" @change="form.isActive=false" />
                  <span>Tidak Aktif</span>
                </label>
              </div>

              <div class="font-medium mb-1">Status Data :</div>
              <div class="flex items-center gap-6">
                <label class="inline-flex items-center gap-2" v-for="opt in ['Draf','Menunggu Kelulusan','Lulus','Tolak']" :key="opt">
                  <input type="radio" :value="opt" v-model="form.statusData" required />
                  <span>{{ opt }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- ROW B: Indicator (left) | Tarikh + PIC (right) -->
          <div class="pair-row">
            <!-- Left: INDICATOR -->
            <div class="pair-col">
              <div class="flex items-center justify-between mb-2">
                <label class="font-medium">Indicator :</label>
                <rs-button type="button" variant="success" size="sm" @click="addIndicator">+ Tambah Baris</rs-button>
              </div>
              <div class="space-y-2">
                <div v-for="(row, i) in indicatorRowsText" :key="'ind-'+i" class="flex items-center gap-2">
                  <input v-model.trim="indicatorRowsText[i]" placeholder='{"Flow":"1","Tahap":"1","UserGroup":"Pegawai Penyemak LZS"}' class="inpt flex-1" required />
                  <rs-button type="button" variant="danger" size="sm" class="shrink-0" @click="removeIndicatorAt(i)" :disabled="indicatorRowsText.length <= 1">Buang</rs-button>
                </div>
              </div>
            </div>

            <!-- Right: TARIKH + PIC -->
            <div class="pair-col">
              <div class="font-medium mb-2">Tarikh</div>
              <div class="mb-3">
                <label class="block text-sm mb-1">Tarikh Mula :</label>
                <input v-model="form.tarikhMula" type="date" class="inpt date-inpt" required />
              </div>
              <div class="mb-4">
                <label class="block text-sm mb-1">Tarikh Tamat :</label>
                <input v-model="form.tarikhTamat" type="date" class="inpt date-inpt" />
              </div>
              <div>
                <label class="block text-sm mb-1">PIC :</label>
                <input v-model.trim="form.pic" type="text" class="inpt date-inpt" required />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-between pt-4">
            <rs-button btnType="button" variant="secondary" @click="goBack">Kembali</rs-button>
            <rs-button btnType="submit" variant="primary">Simpan</rs-button>
          </div>
        </form>
      </template>
    </RsCard>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({ title: 'EX-PRF-KF-LK-01_03 | Kemaskini Level Kelulusan' })

const router = useRouter()
const route = useRoute()

const STORAGE_KEY = 'levelKelulusanList'
const loading = ref(true)
const form = ref(null)

// helpers storage
function readList(){ try{ const raw = localStorage.getItem(STORAGE_KEY); const arr = raw? JSON.parse(raw): []; return Array.isArray(arr)? arr: [] }catch{ return [] } }
function writeList(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) }

// local editable arrays as TEXT (1 input per row)
const levelRowsText = ref([''])
const indicatorRowsText = ref([''])

const levelTypeChecked = ref(true)
watch(levelTypeChecked, v => { if(form.value) form.value.levelType = v ? 'row' : '' })

// init
onMounted(() => {
  const id = route.params.id
  const list = readList()
  const rec = list.find(x => String(x.idLevelKelulusan) === String(id))
  if (!rec) {
    loading.value = false
    form.value = null
    return
  }
  // normalize & bind
  form.value = {
    idLevelKelulusan: rec.idLevelKelulusan,
    tableName: rec.tableName ?? '',
    idRowTable: Number(rec.idRowTable ?? 0),
    levelType: rec.levelType ?? 'row',
    pic: rec.pic ?? '',
    isActive: rec.status === 'Aktif' ? true : rec.isActive ?? true,
    statusData: rec.statusData ?? 'Draf',
    tarikhMula: rec.tarikhMula ?? '',
    tarikhTamat: rec.tarikhTamat ?? '',
  }
  levelTypeChecked.value = form.value.levelType === 'row'

  // arrays -> text inputs
  const lv = Array.isArray(rec.level) ? rec.level : []
  const ind = Array.isArray(rec.indicator) ? rec.indicator : []
  levelRowsText.value = (lv.length ? lv : [{}]).map(x => toJsonLine(x))
  indicatorRowsText.value = (ind.length ? ind : [{}]).map(x => toJsonLine(x))

  loading.value = false
})

function toJsonLine(obj){
  try{ return JSON.stringify(obj) }catch{ return String(obj) }
}
function parseRowsText(rows){
  return rows.map(r => {
    const s = (r ?? '').trim()
    if(!s) return {}
    try{ return JSON.parse(s) }catch{ return s }
  })
}

// actions
function addLevel(){ levelRowsText.value.push('') }
function removeLevelAt(i){ if(levelRowsText.value.length>1) levelRowsText.value.splice(i,1) }
function addIndicator(){ indicatorRowsText.value.push('') }
function removeIndicatorAt(i){ if(indicatorRowsText.value.length>1) indicatorRowsText.value.splice(i,1) }

function goBack(){ router.back() }

function onSubmit(){
  const list = readList()
  const idx = list.findIndex(x => String(x.idLevelKelulusan) === String(form.value.idLevelKelulusan))
  if(idx < 0) return

  const payload = {
    ...list[idx],
    idLevelKelulusan: form.value.idLevelKelulusan,
    tableName: form.value.tableName,
    idRowTable: Number(form.value.idRowTable),
    levelType: levelTypeChecked.value ? 'row' : '',
    level: parseRowsText(levelRowsText.value),
    indicator: parseRowsText(indicatorRowsText.value),
    pic: form.value.pic,
    status: form.value.isActive ? 'Aktif' : 'Tidak Aktif',
    statusData: form.value.statusData,
    tarikhMula: form.value.tarikhMula || new Date().toISOString().slice(0,10),
    tarikhTamat: form.value.tarikhTamat || null,
  }

  list[idx] = payload
  writeList(list)
  router.push('/BF-PRF/KF/LK/01_01')
}
</script>

<style scoped>
.form-grid { display: grid; grid-template-columns: 180px minmax(0,1fr) 16px 180px minmax(0,1fr); }
.lbl { @apply col-span-1 flex items-center; }
.inpt { @apply col-span-1 w-full border rounded px-3 py-2; }
.inpt-sm { width: 140px; }
.pair-row { display: grid; grid-template-columns: 1fr 1fr; column-gap: 56px; row-gap: 24px; align-items: start; }
.pair-col { width: 100%; padding-right: 4px; }
.date-inpt { width: 14rem; } /* ~224px */
</style>
