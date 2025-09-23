<template>
    <div>
       <LayoutsBreadcrumb :items="breadcrumb" />
       <RsCard class="mt-4">
        <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kemaskini Status Household / Individu
          </h2>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormKit
  type="text"
  name="kod"
  label="Kod"
  placeholder="Contoh: F, M, dll."
  validation="required|allowedKod"
  :validation-rules="{ allowedKod }"
  :validation-messages="{
    required: 'Kod tidak boleh kosong',
    allowedKod: 'Kod mesti salah satu daripada: F, M, NFM, G, MM',
  }"
  v-model="newStatus.kod"
/>

<FormKit
  type="text"
  name="nama"
  label="Nama"
  placeholder="Contoh: Fakir, Miskin, dll."
  validation="required|allowedNama"
  :validation-rules="{ allowedNama }"
  :validation-messages="{
    required: 'Nama tidak boleh kosong',
    allowedNama: 'Nama mesti salah satu daripada: Fakir, Miskin, NonFakir Miskin, Gharimin, Muallaf',
  }"
  v-model="newStatus.nama"
/>
            </div>
              <div class="grid grid-cols-10 gap-6">
                <div class="col-span-8">
                <FormKit
  type="textarea"
  name="keterangan"
  label="Keterangan"
  placeholder="Kategori Fakir"
  rows="4"
  v-model="newStatus.keterangan"/></div>
  <div class="col-span-2">
  <FormKit
                type="select"
                name="jenis"
                label="Jenis"
                placeholder="Pilih jenis"
                :options="jenisOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih jenis',
                }"
                v-model="newStatus.jenis"
              />
    </div></div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <!-- Julat Min (%) -->
  <FormKit
    type="number"
    name="julatMin"
    label="Julat Min (%)"
    v-model="newStatus.julatMin"
    validation="required|number|min:0|max:100.1"
    :validation-messages="{
      required: 'Julat Min diperlukan',
      number: 'Nilai mesti nombor',
      min: 'Tidak boleh kurang dari 0',
      max: 'Tidak boleh melebihi 100.1'
    }"
    :attrs="{ step: '0.1', placeholder: '0' }"
    :classes="{
      input: 'w-full',
      outer: 'w-full'
    }"
  />

  <!-- Julat Max (%) -->
  <FormKit
    type="number"
    name="julatMax"
    label="Julat Max (%)"
    v-model="newStatus.julatMax"
    validation="required|number|min:0|max:9999.99|greaterThanMin"
    :validation-rules="{ greaterThanMin }"
    :validation-messages="{
      required: 'Julat Max diperlukan',
      number: 'Nilai mesti nombor',
      min: 'Tidak boleh kurang dari 0',
      max: 'Tidak boleh melebihi 9999.99',
      greaterThanMin: 'Julat Max mesti lebih besar daripada Julat Min'
    }"
    :attrs="{ step: '0.1', placeholder: '100' }"
    :classes="{
      input: 'w-full',
      outer: 'w-full'
    }"
  />
</div>
<!-- Status & Status Data row -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <!-- Status -->
  <div>
    <label class="block font-semibold mb-2">Status</label>
    <FormKit
      type="radio"
      name="status"
      :options="[
        { label: 'Aktif', value: 'Aktif' },
        { label: 'Tidak Aktif', value: 'Tidak Aktif' }
      ]"
      v-model="newStatus.status"
      validation="required"
      :validation-messages="{ required: 'Sila pilih status' }"
      :classes="{
        fieldset: 'w-full',
        options: 'flex gap-6',   // horizontal layout
        option: 'flex items-center gap-2'
      }"
    />
  </div>

  <!-- Status Data -->
  <div>
    <label class="block font-semibold mb-2">Status Data</label>
    <FormKit
      type="radio"
      name="statusData"
      :options="[
        { label: 'Draf', value: 'Draf' },
        { label: 'Lulus', value: 'Lulus' },
        { label: 'Tolak', value: 'Tolak' }
      ]"
      v-model="newStatus.statusData"
      validation="required"
      :validation-messages="{ required: 'Sila pilih status data' }"
      :classes="{
        fieldset: 'w-full',
        options: 'flex gap-6',
        option: 'flex items-center gap-2'
      }"
    />
  </div>
</div>
<!-- Tarikh Mula & Tarikh Tamat -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <FormKit
    type="date"
    name="tarikhMula"
    label="Tarikh Mula"
    v-model="newStatus.tarikhMula"
    validation="required|date"
    validation-visibility="dirty"
    :validation-messages="{
      required: 'Tarikh Mula diperlukan',
      date: 'Tarikh tidak sah'
    }"
    :classes="{ outer:'w-full', wrapper:'w-full', inner:'w-full', input:'w-full' }"
  />

  <FormKit
    type="date"
    name="tarikhTamat"
    label="Tarikh Tamat"
    v-model="newStatus.tarikhTamat"
    validation="date|tamatSelepasMula"
    :validation-rules="{ tamatSelepasMula }"
    validation-visibility="dirty"
    :validation-messages="{
      required: 'Tarikh Tamat diperlukan',
      date: 'Tarikh tidak sah',
      tamatSelepasMula: 'Tarikh tamat mesti pada atau selepas tarikh mula'
    }"
    :attrs="{ min: newStatus.tarikhMula || undefined }" 
    :classes="{ outer:'w-full', wrapper:'w-full', inner:'w-full', input:'w-full' }"
  />
</div>
<div class="flex justify-end gap-3 mt-6">
  <RsButton type="button" variant="primary-outline" @click="navigateTo('/BF-PRF/KF/SHI/01_01')"><Icon name="iconamoon:arrow-left-1" class="mr-1"/> Kembali </RsButton>
  <RsButton type="button" variant="primary" @click="navigateTo('/BF-PRF/KF/SHI/01_01')"><Icon name="ic:baseline-add" class="mr-1" /> Tambah </RsButton>
  <RsButton type="button" variant="info-outline"><Icon name="ic:outline-edit" class="mr-1" /> Kemaskini </RsButton>
</div>



      </template>
       </RsCard>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Tambah Status Household / Individu Baharu",
});

const toast = useToast();
const isSubmitting = ref(false);

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/SHI/admin",
  },
  {
    name: "Konfigurasi Status Household / Individu",
    type: "link",
    path: "/BF-PRF/KF/SHI/01_01/",
  },
  {
    name: "Kemaskini",
    type: "link",
    path: "/BF-PRF/KF/SHI/01_03",
  },
  {name:"Kemaskini Status Household / Individu",
    type: "current",
    path:"BF-PRF/KF/SHI/01_03/kemaskini",
  }
]);

const newStatus = reactive({
  kod: '',
  nama:'',
  keterangan:'',
  jenis:'',
  julatMin: null,
  julatMax: null,
  tarikhMula: '',
  tarikhTamat: '',
  status: '',
  statusData: '',
});

const allowedKodValues = ["F", "M", "NFM", "G", "MM"];
const allowedNamaValues = [
  "fakir",
  "miskin",
  "nonfakir miskin",
  "gharimin",
  "muallaf",
];

const allowedKod = (node) => {
  const v = String(node.value ?? "").trim().toUpperCase();
  return allowedKodValues.includes(v);
};

const allowedNama = (node) => {
  const v = String(node.value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return allowedNamaValues.includes(v);
};

const jenisOptions = [
  { label: "Household", value: "Household" },
  { label: "Individu", value: "Individu" },
];

const greaterThanMin = (node) => {
  const max = parseFloat(node.value ?? 0);
  const min = parseFloat(newStatus.julatMin ?? 0);
  if (isNaN(max) || isNaN(min)) return true; // let number rule handle errors
  return max > min;
};

const tamatSelepasMula = (node) => {
  const tmt = new Date(node.value || '').setHours(0,0,0,0);
  const mula = new Date(newStatus.tarikhMula || '').setHours(0,0,0,0);
  if (isNaN(tmt) || isNaN(mula)) return true; // let "required/date" handle empties
  return tmt >= mula;
};

const toISO = (v) => {
  if (!v) return "";
  if (typeof v === "string" && v.includes("-")) return v;    
  const m = String(v).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); // D/M/YYYY
  return m ? `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}` : v;
};
const numOrNull = (v) => (v === "" || v === "-" || v == null ? null : Number(v));

onMounted(() => {
  // If you WANT to require mode=edit, keep this; otherwise remove it.
  const params = new URLSearchParams(window.location.search);
  const isEdit = params.get("mode") === "edit";
  if (!isEdit) return;  // remove this line if you want to always attempt loading

  const raw = sessionStorage.getItem("shiEditRow");

  if (!raw) {
    console.warn("No shiEditRow in sessionStorage");
    return; // don't parse or proceed
  }

  let src;
  try {
    src = JSON.parse(raw);
  } catch (e) {
    console.error("Bad shiEditRow JSON", e);
    return;
  }

  const mapped = {
    kod:        src.kod ?? '',
    nama:       src.nama ?? '',
    keterangan: src.keterangan ?? '',
    jenis:      src.jenis ?? '',
    julatMin:   numOrNull(src.julatMin),
    julatMax:   numOrNull(src.julatMax),
    tarikhMula: toISO(src.tarikhMula),
    tarikhTamat:toISO(src.tarikhTamat),
    status:     src.status ?? '',
    statusData: src.statusData ?? src.status ?? ''
  };

  console.log("loaded for edit:", mapped);
  Object.assign(newStatus, mapped);
});
</script>