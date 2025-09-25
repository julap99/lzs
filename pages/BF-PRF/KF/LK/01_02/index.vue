<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-3">Level Kelulusan</h2>

    <RsCard class="p-4">
      <form @submit.prevent="onSubmit" class="space-y-4">
        <!-- 5-column grid: 180 | auto | 16 | 180 | auto -->
        <div class="form-grid gap-x-4 gap-y-3">
          <!-- Row: Table Name (L) | ID Row Table (R) -->
          <label class="lbl">Table Name :</label>
          <input v-model.trim="form.tableName" type="text" class="inpt" required />
          <div></div>
          <label class="lbl">ID Row Table :</label>
          <input v-model.number="form.idRowTable" type="number" min="1" class="inpt inpt-sm" required />

          <!-- Row: Level Type (R side only) -->
          <div></div><div></div><div></div>
          <label class="lbl">Level Type :</label>
          <label class="inline-flex items-center gap-2">
            <input type="checkbox" v-model="levelTypeChecked" />
            <span>row</span>
          </label>

          <!-- Row: Level (label left; fields col 2-3; buttons col 4-5) -->
          <label class="lbl self-start">Level :</label>
          <div class="col-span-2 space-y-2">
            <div v-for="(lv, i) in form.levels" :key="'lv-'+i" class="flex gap-2">
              <input v-model.trim="lv.Flow"  placeholder="Flow"  class="inpt w-20"  required />
              <input v-model.trim="lv.Tahap" placeholder="Tahap" class="inpt w-20"  required />
              <input v-model.trim="lv.Value" placeholder="Value" class="inpt w-20" required />
            </div>
          </div>
          <div class="col-span-2 flex gap-3">
            <rs-button type="button" variant="primary" @click="addLevel">Tambah +</rs-button>
            <rs-button type="button" variant="secondary" @click="removeLevel" :disabled="form.levels.length<=1">Buang -</rs-button>
          </div>

          <!-- Row: Indicator -->
          <label class="lbl self-start">Indicator :</label>
          <div class="col-span-2 space-y-2">
            <div v-for="(ind, i) in form.indicators" :key="'ind-'+i" class="flex gap-2">
              <input v-model.trim="ind.Flow"  placeholder="Flow"  class="inpt w-20" required />
              <input v-model.trim="ind.Tahap" placeholder="Tahap" class="inpt w-20" required />
              <input v-model.trim="ind.Level" placeholder="Level" class="inpt w-20" required />
            </div>
          </div>
          <div class="col-span-2 flex gap-3">
            <rs-button type="button" variant="primary" @click="addIndicator">Tambah +</rs-button>
            <rs-button type="button" variant="secondary" @click="removeIndicator" :disabled="form.indicators.length<=1">Buang -</rs-button>
          </div>

          <!-- Row: PIC (L) | Status (R) -->
          <label class="lbl">PIC :</label>
          <input v-model.trim="form.pic" type="text" class="inpt" required />
          <div></div>
          <label class="lbl">Status :</label>
          <div class="flex items-center gap-8">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.isActive" />
              <span>Aktif</span>
            </label>
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" :checked="!form.isActive" @change="form.isActive=false" />
              <span>Tidak Aktif</span>
            </label>
          </div>

          <!-- Row: Status Data (L) | Tarikh Mula (R) -->
          <label class="lbl">Status Data :</label>
          <div class="flex items-center gap-6">
            <label class="inline-flex items-center gap-2"><input type="radio" value="Draf"  v-model="form.statusData" required /><span>Draf</span></label>
            <label class="inline-flex items-center gap-2"><input type="radio" value="Lulus" v-model="form.statusData" /><span>Lulus</span></label>
            <label class="inline-flex items-center gap-2"><input type="radio" value="Tolak" v-model="form.statusData" /><span>Tolak</span></label>
          </div>
          <div></div>
          <label class="lbl">Tarikh Mula :</label>
          <input v-model="form.tarikhMula" type="date" class="inpt w-56" required />

          <!-- Row: Tarikh Tamat (R only) -->
          <div></div><div></div><div></div>
          <label class="lbl">Tarikh Tamat :</label>
          <input v-model="form.tarikhTamat" type="date" class="inpt w-56" />
        </div>

        <!-- Footer -->
        <div class="flex justify-between pt-4">
        <rs-button btnType="button" variant="secondary" @click="goBack">Kembali</rs-button>
        <rs-button btnType="submit" variant="primary" @click="onSubmit">Tambah</rs-button>
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
  idLevelKelulusan: 1,
  tableName: 'rekod_asnaf',
  idRowTable: 1,
  levelType: 'row',
  levels: [
    { Flow: '1', Tahap: '1', Value: 'Semak' },
    { Flow: '1', Tahap: '2', Value: 'Siasat' },
    { Flow: '1', Tahap: '3', Value: 'Sokong' },
    { Flow: '1', Tahap: '4', Value: 'Lulus' },
  ],
  indicators: [
    { Flow: '1', Tahap: '1', Level: 'Semak' },
    { Flow: '1', Tahap: '2', Level: 'Siasat' },
    { Flow: '1', Tahap: '3', Level: 'Sokong' },
    { Flow: '1', Tahap: '4', Level: 'Lulus' },
  ],
  pic: '',
  isActive: true,
  statusData: 'Draf',
  tarikhMula: '',
  tarikhTamat: '',
})

const levelTypeChecked = ref(true)
watch(levelTypeChecked, v => { form.value.levelType = v ? 'row' : '' })

function addLevel(){ form.value.levels.push({ Flow:'', Tahap:'', Value:'' }) }
function removeLevel(){ if(form.value.levels.length>1) form.value.levels.pop() }
function addIndicator(){ form.value.indicators.push({ Flow:'', Tahap:'', Level:'' }) }
function removeIndicator(){ if(form.value.indicators.length>1) form.value.indicators.pop() }

function goBack(){ router.back() }

/** Helpers to read/write localStorage list */
const STORAGE_KEY = 'levelKelulusanList'
function readList(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  }catch{ return [] }
}
function writeList(arr){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
}
function genId(){
  // keep existing id if unique; otherwise generate one
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

function onSubmit(){
  const payload = {
    idLevelKelulusan: form.value.idLevelKelulusan || genId(),
    tableName: form.value.tableName,
    idRowTable: Number(form.value.idRowTable),
    levelType: form.value.levelType,
    level: form.value.levels.map(x => ({ Flow:x.Flow, Tahap:x.Tahap, Value:x.Value })),
    indicator: form.value.indicators.map(x => ({ Flow:x.Flow, Tahap:x.Tahap, Level:x.Level })),
    pic: form.value.pic,
    status: form.value.isActive ? 'Aktif' : 'Tidak Aktif',
    statusData: form.value.statusData,
    tarikhMula: form.value.tarikhMula || new Date().toISOString().slice(0,10),
    tarikhTamat: form.value.tarikhTamat || null,
  }

  // persist to localStorage (create or update by idLevelKelulusan)
  const list = readList()
  const idx = list.findIndex(x => String(x.idLevelKelulusan) === String(payload.idLevelKelulusan))
  if (idx >= 0) list[idx] = payload
  else list.push(payload)
  writeList(list)

  // clear draft (optional)
  sessionStorage.removeItem('lvlKelulusanDraft')

  // go to listing
  router.push({ path: '/BF-PRF/KF/LK/01_01' })
}
</script>

<style scoped>
/* 5 columns: 180px | 1fr | 16px | 180px | 1fr */
.form-grid {
  display: grid;
  grid-template-columns: 180px minmax(0,1fr) 16px 180px minmax(0,1fr);
}
.lbl {
  grid-column: span 1;
  display: flex;
  align-items: center;
}
.inpt {
  grid-column: span 1;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
}
.inpt-sm { width: 140px; }
</style>
