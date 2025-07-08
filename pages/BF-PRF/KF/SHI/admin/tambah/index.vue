<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah Status Household / Individu Baharu
          </h2>
          <!-- <rs-button
            variant="secondary"
            @click="navigateTo('/BF-PRF/KF/SHI/admin')"
          >
            <Icon name="material-symbols:arrow-back" class="mr-1" /> Kembali
          </rs-button> -->
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          id="addStatusForm"
          @submit="saveNewStatus"
          :config="{ validationVisibility: 'submit' }"
          #default="{ state }"
          :actions="false"
        >
          <!-- Basic Information Section -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-medium mb-4">Maklumat Asas</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status Asnaf -->
              <FormKit
                type="select"
                name="statusAsnaf"
                label="Status Asnaf"
                placeholder="Contoh: Fakir, Miskin, dll."
                validation="required"
                :validation-messages="{
                  required: 'Status Asnaf tidak boleh kosong',
                }"
                v-model="newStatus.statusAsnaf"
                :options="asnafOptions"
              />

              <!-- Kategori Selection -->
              <FormKit
                type="select"
                name="kategori"
                label="Kategori"
                placeholder="Pilih kategori"
                :options="kategoriOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih kategori',
                }"
                v-model="newStatus.kategori"
              />
            </div>
          </div>

          <!-- Description Section -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-medium mb-4">Penerangan</h3>

            <FormKit
              type="textarea"
              name="keterangan"
              label="Keterangan"
              placeholder="Masukkan penerangan tentang status asnaf ini..."
              rows="4"
              v-model="newStatus.keterangan"
            />
          </div>

          <!-- Status & Settings Section -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="text-lg font-medium mb-4">Status & Tetapan</h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Status Aktif -->
              <FormKit
                type="select"
                name="statusAktif"
                label="Status Aktif"
                placeholder="Pilih status"
                :options="statusOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih status',
                }"
                v-model="newStatus.statusAktif"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="navigateTo('/BF-PRF/KF/SHI/admin')"
            >
              Batal
            </rs-button>

            <rs-button
              type="submit"
              :disabled="isSubmitting"
              :loading="isSubmitting"
              @click="saveNewStatus"
            >
              <span v-if="isSubmitting">
                <Icon name="eos-icons:loading" size="1rem" class="mr-1" />
                Menghantar...
              </span>
              <span v-else>Hantar Untuk Kelulusan</span>
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
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
    path: "/BF-PRF/KF/SHI/admin",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-PRF/KF/SHI/admin/tambah",
  },
]);

// Form data
const newStatus = reactive({
  statusAsnaf: "",
  kategori: "",
  keterangan: "",
  statusAktif: "Aktif",
  keutamaan: 5,
});

// Options for select inputs
const asnafOptions = [
  { label: "Fakir", value: "fakir" }, // Extremely poor with no means
  { label: "Miskin", value: "miskin" }, // Poor with some means but insufficient
  { label: "Amil", value: "amil" }, // Zakat administrators/collectors
  { label: "Mu'allaf", value: "muallaf" }, // Those whose hearts are to be reconciled
  { label: "Riqab", value: "riqab" }, // Slaves seeking freedom
  { label: "Gharimin", value: "gharimin" }, // Debtors in genuine difficulty
  { label: "Fisabilillah", value: "fisabilillah" }, // Those fighting in Allah's cause
  { label: "Ibn Sabil", value: "ibnsabil" }, // Stranded travelers in need
];

const kategoriOptions = [
  { label: "Household", value: "Household" },
  { label: "Individu", value: "Individu" },
];

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

// Form submission
const saveNewStatus = async () => {
  try {
    isSubmitting.value = true;

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success handling
    toast.success("Status berjaya dihantar untuk kelulusan");
    navigateTo("/BF-PRF/KF/SHI/admin");
  } catch (error) {
    // Error handling
    toast.error("Ralat semasa menambah status. Sila cuba lagi.");
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
