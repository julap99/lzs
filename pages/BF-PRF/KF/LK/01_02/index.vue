<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-3">
      <h1 class="text-2xl font-semibold flex items-center gap-2">
        <Icon name="ic:outline-info" />
        Level Kelulusan
      </h1>

      <!-- BUTANG KEMBALI (baru) -->
<rs-button btnType="button" variant="secondary" @click="goBack">Kembali</rs-button> 
    </div>


    <RsCard class="p-4">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- Top: basic fields in 5-col grid -->
        <div class="form-grid gap-x-4 gap-y-3">
          <label class="lbl">Table Name :</label>
          <input v-model.trim="form.tableName" type="text"  class="col-span-1 w-full border border-slate-300 rounded px-3 py-2 bg-white" required />
          <div></div>
          <label class="lbl">ID Row Table :</label>
          <input v-model.number="form.idRowTable" type="number" min="1" class="inpt inpt-sm" required />

          <div></div>
          <div></div>
          <div></div>
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
              <div v-for="(row, i) in form.levelRows" :key="'lv-' + i" class="flex items-center gap-2">
                <input v-model.trim="form.levelRows[i]" placeholder='cth: {"Flow":"1","Tahap":"1","Value":"Semak"}'
                   class="col-span-1 w-full border border-slate-300 rounded px-3 py-2 bg-white" required />
                <rs-button type="button" variant="danger" size="sm" class="shrink-0" @click="removeLevelAt(i)"
                  :disabled="form.levelRows.length <= 1">Buang</rs-button>
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
                <input type="checkbox" :checked="!form.isActive" @change="form.isActive = false" />
                <span>Tidak Aktif</span>
              </label>
            </div>

            <div class="font-medium mb-1">Status Data :</div>
            <div class="flex items-center gap-6">
              <label class="inline-flex items-center gap-2">
                <input type="radio" value="Draf" v-model="form.statusData" required />
                <span>Draf</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="radio" value="Lulus" v-model="form.statusData" />
                <span>Lulus</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="radio" value="Tolak" v-model="form.statusData" />
                <span>Tolak</span>
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
              <div v-for="(row, i) in form.indicatorRows" :key="'ind-' + i" class="flex items-center gap-2">
                <input  class="col-span-1 w-full border border-slate-300 rounded px-3 py-2 bg-white" v-model.trim="form.indicatorRows[i]"
                  placeholder='cth: {"Flow":"1","Tahap":"1","UserGroup":"Pegawai Penyemak LZS"}'
                  required />
                <rs-button type="button" variant="danger" size="sm" class="shrink-0" @click="removeIndicatorAt(i)"
                  :disabled="form.indicatorRows.length <= 1">Buang</rs-button>
              </div>
            </div>
          </div>

          <!-- Right: TARIKH (shrunk) + PIC UNDER IT -->
          <div class="pair-col">
            <div class="font-medium mb-2">Tarikh</div>

            <div class="mb-3">
              <label class="block text-sm mb-1">Tarikh Mula :</label>
              <input v-model="form.tarikhMula" type="date"  class="col-span-1 w-full border border-slate-300 rounded px-3 py-2 bg-white" required />
            </div>

            <div class="mb-4">
              <label class="block text-sm mb-1">Tarikh Tamat :</label>
              <input v-model="form.tarikhTamat" type="date"  class="col-span-1 w-full border border-slate-300 rounded px-3 py-2 bg-white" />
            </div>

            <div>
              <label class="block text-sm mb-1">PIC :</label>
              <input v-model.trim="form.pic" type="text"  class="col-span-1 w-full border border-slate-300 rounded px-3 py-2 bg-white" required />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between pt-4">
          <rs-button btnType="submit" variant="primary">Tambah</rs-button>
        </div>
      </form>
    </RsCard>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({
  idLevelKelulusan: "",
  tableName: 'rekod_asnaf',
  idRowTable: 1,
  levelType: 'row',
  levelRows: [''],
  indicatorRows: [''],
  pic: '',
  isActive: true,
  statusData: 'Draf',
  tarikhMula: '',
  tarikhTamat: '',
})

const levelTypeChecked = ref(true)
watch(levelTypeChecked, v => { form.value.levelType = v ? 'row' : '' })

function addLevel() { form.value.levelRows.push('') }
function removeLevelAt(i) { if (form.value.levelRows.length > 1) form.value.levelRows.splice(i, 1) }
function addIndicator() { form.value.indicatorRows.push('') }
function removeIndicatorAt(i) { if (form.value.indicatorRows.length > 1) form.value.indicatorRows.splice(i, 1) }

function goBack() { router.back() }

/** Storage helpers */
const STORAGE_KEY = 'levelKelulusanList'
function readList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}
function writeList(arr) { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) }
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }
function parseRows(rows) { return rows.map(r => { try { return JSON.parse(r) } catch { return r } }) }

function onSubmit() {
  const payload = {
    idLevelKelulusan: form.value.idLevelKelulusan || genId(),
    tableName: form.value.tableName,
    idRowTable: Number(form.value.idRowTable),
    levelType: form.value.levelType,
    level: parseRows(form.value.levelRows),
    indicator: parseRows(form.value.indicatorRows),
    pic: form.value.pic,
    status: form.value.isActive ? 'Aktif' : 'Tidak Aktif',
    statusData: form.value.statusData,
    tarikhMula: form.value.tarikhMula || new Date().toISOString().slice(0, 10),
    tarikhTamat: form.value.tarikhTamat || null,
  }

  const list = readList()

  const idx = list.findIndex(x => String(x.idLevelKelulusan) === String(form.value.idLevelKelulusan))
  if (idx >= 0) {
    // EDIT mode (idLevelKelulusan sedia ada)
    list[idx] = payload
  } else {
    // CREATE mode (idLevelKelulusan kosong → telah dijana dengan genId())
    list.push(payload)
  }

  writeList(list)
  sessionStorage.removeItem('lvlKelulusanDraft')
  router.push({ path: '/BF-PRF/KF/LK/01_01' })
}
</script>

<style scoped>
/* Base 5-col grid for simple label/field rows */
.form-grid {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) 16px 180px minmax(0, 1fr);
}



.inpt-sm {
  width: 140px;
}

/* Two-column pair rows (left + right) with a bigger gap */
.pair-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 56px;
  /* ⬅️ bigger space between columns */
  row-gap: 24px;
  align-items: start;
}

/* small padding so content doesn't feel cramped near the gap */
.pair-col {
  width: 100%;
  padding-right: 4px;
}

/* Shrink date fields (and PIC in that column) to a consistent width */
.date-inpt {
  width: 14rem;
}

/* ~224px */
</style>
