<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Data Permohonan</h2>
        </div>
      </template>

      <template #body>
        <!--  SEMAKAN RADIO BUTTONS (Screenshot Style) -->
        <div class="mb-8">
          <rs-table
            class="w-full text-sm mb-6"
            :data="semakanRows"
            :field="semakanFields"
            :pageSize="semakanRows.length"
            :columns="[
              { key: 'label', label: 'Maklumat Lengkap?' },
              { key: 'ya', label: 'Ya' },
              { key: 'tidak', label: 'Tidak' },
              { key: 'tidakBerkenaan', label: 'Tidak Berkenaan' },
            ]"
            :options="{
              variant: 'default',
              hover: true,
              striped: true,
            }"
            :options-advanced="{
              sortable: true,
              filterable: true,
            }"
          >
            <template #ya="data">
              <div class="">
                <input
                  type="radio"
                  :name="data.value.name"
                  value="Ya"
                  v-model="data.value.selected"
                />
              </div>
            </template>
            <template #tidak="data">
              <div class="">
                <input
                  type="radio"
                  :name="data.value.name"
                  value="Tidak"
                  v-model="data.value.selected"
                />
              </div>
            </template>
            <template #tidakBerkenaan="data">
              <div class="">
                <input
                  type="radio"
                  :name="data.value.name"
                  value="Tidak Berkenaan"
                  v-model="data.value.selected"
                />
              </div>
            </template>
          </rs-table>
          <!-- Komen Penyemak and Dokumen Lengkap outside table -->
          <div class="mb-4 flex flex-col gap-4">
            <div>
              <label class="font-bold block mb-1">Komen Penyemak</label>
              <FormKit
                type="textarea"
                name="komen_penyemak"
                v-model="komenPenyemak"
                :rows="3"
                placeholder="Masukkan komen penyemak"
              />
            </div>

            <div>
              <label class="font-bold block mb-2">Dokumen Lengkap?</label>
                             <FormKit
                 type="radio"
                 name="dokumen_lengkap"
                 v-model="dokumenLengkap"
                 :options="[
                   { label: 'Ya', value: 'Ya' },
                   { label: 'Tidak', value: 'Tidak' },
                 ]"
               />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormKit
                  type="text"
                  name="disemak_oleh"
                  label="Disemak Oleh"
                  v-model="disemakOleh"
                  :readonly="true"
                />
              </div>
              <div>
                <FormKit
                  type="text"
                  name="tarikh_semakan"
                  label="Tarikh Semakan"
                  v-model="tarikhSemakan"
                  :readonly="true"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <rs-button type="button" variant="primary" @click="lihatdata">
            Semakan Maklumat
          </rs-button>
          <rs-button type="button" variant="outline" @click="handleKembali">
            Kembali
          </rs-button>
          <rs-button
            type="button"
            variant="secondary"
            @click="handleSimpanDraf"
          >
            Simpan Draf
          </rs-button>
          <rs-button type="button" variant="primary" @click="handleHantar">
            Hantar
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Semakan Data Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan",
    type: "current",
    path: "/BF-PRF/AS/permohonan",
  },
  {
    name: "Semakan Data",
    type: "current",
    path: "/BF-PRF/AS/permohonan/semakan-data",
  },
]);

const komenPenyemak = ref("");
const disemakOleh = ref("penyemak");
const tarikhSemakan = ref(
  new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
);

// Table fields and rows for Semakan (use RsTable)
const semakanFields = ["label", "ya", "tidak", "tidakBerkenaan"];
const semakanRows = ref([
  {
    label: "Peribadi",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "peribadi",
    selected: "Ya",
  },
  {
    label: "Pendidikan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pendidikan",
    selected: "Ya",
  },
  {
    label: "Pengislaman",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pengislaman",
    selected: "Ya",
  },
  {
    label: "Perbankan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "perbankan",
    selected: "Ya",
  },
  {
    label: "Kesihatan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "kesihatan",
    selected: "Ya",
  },
  {
    label: "Kemahiran",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "kemahiran",
    selected: "Ya",
  },
  {
    label: "Alamat dan Tempat Tinggal",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "alamat",
    selected: "Ya",
  },
  {
    label: "Pinjaman",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pinjaman",
    selected: "Ya",
  },
  {
    label: "Pemilikan Aset",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "aset",
    selected: "Ya",
  },
  {
    label: "Pemilikan Barangan Rumah",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "barang",
    selected: "Ya",
  },
  {
    label: "Pekerjaan Ketua Keluarga",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pekerjaan",
    selected: "Ya",
  },
  {
    label: "Pendapatan dan Perbelanjaan Seisi Rumah",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pendapatan",
    selected: "Ya",
  },
  {
    label: "Waris",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "waris",
    selected: "Ya",
  },
  {
    label: "Peribadi Tanggungan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "peribadi_tanggungan",
    selected: "Ya",
  },
  {
    label: "Pengislaman Tanggungan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pengislaman_tanggungan",
    selected: "Ya",
  },
  {
    label: "Pendidikan Tanggungan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pendidikan_tanggungan",
    selected: "Ya",
  },
  {
    label: "Kesihatan Tanggungan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "kesihatan_tanggungan",
    selected: "Ya",
  },
  {
    label: "Kemahiran Tanggungan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "kemahiran_tanggungan",
    selected: "Ya",
  },
  {
    label: "Pekerjaan Tanggungan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pekerjaan_tanggungan",
    selected: "Ya",
  },
  {
    label: "Perakuan Ketua Keluarga",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "perakuan_ketua_keluarga",
    selected: "Ya",
  },
  {
    label: "Pengesahan Permastautin",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pengesahan_permastautin",
    selected: "Ya",
  },
  {
    label: "Pengesahan Pendapatan",
    ya: "",
    tidak: "",
    tidakBerkenaan: "",
    name: "pengesahan_pendapatan",
    selected: "Ya",
  },
]);

// Auto-generate Komen Penyemak when any row is marked 'Tidak'
const generateAutoComments = () => {
  const messages = semakanRows.value
    .filter((row) => row.selected === "Tidak")
    .map((row) => `${row.label.toLowerCase()} tidak lengkap`);
  komenPenyemak.value = messages.join("\n");
};

watch(semakanRows, generateAutoComments, { deep: true });


const handleHantar = () => {
  if (dokumenLengkap.value === 'Tidak') {
    toast.success('Notifikasi sudah dihantar ke pemohon.');
    navigateTo('/BF-PRF/AS/permohonan/list-semakan');
    return; 
  }
  
  toast.success('Notifikasi sudah dihantar ke pemohon.');
  navigateTo('/BF-PRF/AS/FR/04');
};

const handleSimpanDraf = () => {
  toast.success("Permohonan disimpan sebagai draf.");
};

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/permohonan/list-semakan");
};

// State for document completeness
const dokumenLengkap = ref("");

const lihatdata = () => {
  navigateTo("/BF-PRF/AS/FR/02_readonly");
};


</script>

