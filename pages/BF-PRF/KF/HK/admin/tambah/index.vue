<!-- pages/BF-PRF/KF/HK/add.vue -->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah Konfigurasi Had Kifayah Baharu
          </h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PRF/KF/HK/admin')"
          >
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="submitForm"
          :actions="false"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="select"
              name="category"
              label="Kategori Kadar Had Kifayah"
              validation="required"
              :options="kategoriOptions"
              placeholder="Pilih kategori"
              :validation-messages="{
                required: 'Kategori adalah wajib',
              }"
            />

            <FormKit
              type="select"
              name="householdType"
              label="Kategori Isi Rumah"
              validation="required"
              :options="householdOptions"
              placeholder="Pilih kategori isi rumah"
              :validation-messages="{
                required: 'Kategori isi rumah adalah wajib',
              }"
            />

            <FormKit
              type="number"
              name="paidHouseRate"
              label="Kadar Kifayah Rumah Berbayar (RM)"
              validation="required|min:0"
              step="0.01"
              :validation-messages="{
                required: 'Kadar rumah berbayar adalah wajib',
                min: 'Nilai tidak boleh negatif',
              }"
            />

            <FormKit
              type="number"
              name="freeHouseRate"
              label="Kadar Kifayah Rumah Percuma (RM)"
              validation="required|min:0"
              step="0.01"
              :validation-messages="{
                required: 'Kadar rumah percuma adalah wajib',
                min: 'Nilai tidak boleh negatif',
              }"
            />

            <FormKit
              type="date"
              name="effectiveDate"
              label="Tarikh Mula Kuat Kuasa"
              validation="required"
              :validation-messages="{
                required: 'Tarikh mula adalah wajib',
              }"
            />

            <div
              class="bg-yellow-50 p-3 rounded border border-yellow-200 col-span-2"
            >
              <p class="text-yellow-800 text-sm">
                <Icon name="material-symbols:info-outline" class="mr-1" />
                Perhatian: Semua penambahan akan melalui proses kelulusan
                terlebih dahulu sebelum dikuat kuasa.
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-4">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PRF/KF/HK/admin')"
              type="button"
              :disabled="isSubmitting"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              type="submit"
              :loading="isSubmitting"
              @click="submitForm"
            >
              {{ isSubmitting ? "Menghantar..." : "Hantar Untuk Kelulusan" }}
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Tambah Konfigurasi Had Kifayah",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-PRF/KF/HK/admin/tambah",
  },
]);

// Form state
const isSubmitting = ref(false);
const formData = ref({
  category: "",
  householdType: "",
  paidHouseRate: 0,
  freeHouseRate: 0,
  effectiveDate: "",
});

// Options
const kategoriOptions = [
  { label: "Utama", value: "Utama" },
  { label: "Tambahan", value: "Tambahan" },
];

const householdOptions = [
  { label: "Ketua Keluarga", value: "Ketua Keluarga" },
  {
    label: "Dewasa Bekerja (18 tahun ke atas)",
    value: "Dewasa Bekerja (18 tahun ke atas)",
  },
  {
    label: "Dewasa Tidak Bekerja (18 tahun ke atas)",
    value: "Dewasa Tidak Bekerja (18 tahun ke atas)",
  },
  { label: "Anak (Bawah 18 tahun)", value: "Anak (Bawah 18 tahun)" },
  { label: "Bayi (Bawah 2 tahun)", value: "Bayi (Bawah 2 tahun)" },
];

// Methods
const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // Validate form data
    if (!formData.value.category || !formData.value.householdType) {
      throw new Error("Sila isi semua medan yang diperlukan");
    }

    // Prepare submission data
    const submissionData = {
      ...formData.value,
      // Convert to numbers in case they're strings
      paidHouseRate: parseFloat(formData.value.paidHouseRate),
      freeHouseRate: parseFloat(formData.value.freeHouseRate),
      status: "Menunggu Kelulusan", // Default status for new entries
    };

    // In a real app, you would call an API here
    // const response = await createKifayahConfig(submissionData);

    alert("Permohonan penambahan telah dihantar untuk kelulusan");

    // Redirect back to list after successful submission
    router.push("/BF-PRF/KF/HK/01");
  } catch (error) {
    alert('Ralat semasa menambah konfigurasi"');
  } finally {
    isSubmitting.value = false;
  }
};

// Helper functions
const formatDateForPicker = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};
</script>
