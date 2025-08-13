<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Semula - Elaun Penolong Amil</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
        
          <!-- Maklumat Aktiviti Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Aktiviti</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit 
                type="text" 
                name="idAktiviti" 
                label="ID Aktiviti" 
                disabled 
              />
              <FormKit
                type="text"
                name="namaAktiviti"
                label="Nama Aktiviti"
                disabled
              />
              <FormKit
                type="text"
                name="jenisAktiviti"
                label="Jenis Aktiviti"
                disabled
              />
              <FormKit
                type="text"
                name="tarikhAktiviti"
                label="Tarikh Aktiviti"
                disabled
              />
            </div>
          </div>

          <!-- Senarai Penolong Amil Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Senarai Kehadiran Penolong Amil</h3>
            <rs-table
              class="mt-4"
              :key="tableKey"
              :data="formData.senaraiPenolong"
              :pageSize="10"
              :showNoColumn="true"
              :columns="[
                { key: 'nama', label: 'Nama Penolong Amil' },
                { key: 'tarikh', label: 'Tarikh Aktiviti' },
                { key: 'statusKehadiran', label: 'Status Kehadiran' }
              ]"
              :options="{
                variant: 'default',
                hover: true,
              }"
            >
              <template v-slot:nama="data">
                {{ data.text }}
              </template>
              <template v-slot:tarikh="data">
                {{ data.text }}
              </template>
              <template v-slot:statusKehadiran="data">
                <rs-badge :variant="data.text === 'Hadir' ? 'success' : 'danger'">
                  {{ data.text }}
                </rs-badge>
              </template>
            </rs-table>
          </div>

          <!-- Maklumat Pengiraan Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Pengiraan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit 
                type="text" 
                name="kadarElaun" 
                label="Kadar Elaun" 
                disabled 
              />
              <FormKit
                type="text"
                name="jumlahElaun"
                label="Jumlah Elaun"
                disabled
              />
            </div>
          </div>

          <!-- Sebab Penolakan Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Sebab Penolakan</h3>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start">
                <Icon name="heroicons:exclamation-triangle" class="text-red-500 mt-1 mr-3" size="20" />
                <div>
                  <h4 class="text-red-800 font-medium mb-2">Sebab Penolakan:</h4>
                  <p class="text-red-700">{{ formData.sebabPenolakan }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Ulasan Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Ulasan</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="ulasanKetua"
                                       label="Ulasan Ketua Jabatan"
                validation="required"
                validation-label="Ulasan"
                disabled
              />

              <FormKit
                type="textarea"
                name="ulasanSemula"
                                       label="Ulasan Semula Eksekutif"
                validation="required"
                validation-label="Ulasan Semula"
                placeholder="Sila masukkan ulasan semula anda..."
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/MP')"
            >
              Kembali
            </rs-button>
            <rs-button variant="danger" @click="handleTolak">
              Tolak Semula
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Hantar Semula
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal for Resubmit -->
    <rs-modal
      v-model="showResubmitModal"
      title="Hantar Semula ke Pelulus"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:help-outline"
            class="text-blue-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menghantar semula Kiraan Jumlah Elaun ini kepada Ketua Jabatan?
          </p>
          <p class="text-gray-600">
            Semakan semula ini akan dihantar kepada pelulus untuk kelulusan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showResubmitModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmResubmit">
            Ya, Hantar Semula
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal for Reject -->
    <rs-modal
      v-model="showRejectModal"
      title="Tolak Semula"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="heroicons:exclamation-triangle"
            class="text-red-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menolak semula Kiraan Jumlah Elaun ini?
          </p>
          <p class="text-gray-600">
            Tindakan ini akan menolak permohonan dan memerlukan pembetulan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showRejectModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="danger" @click="confirmReject">
            Ya, Tolak Semula
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Semakan Semula - Elaun Penolong Amil",
  description: "Semakan semula elaun penolong amil yang ditolak",
});

const route = useRoute();
const toast = useToast();
const showResubmitModal = ref(false);
const showRejectModal = ref(false);
const tableKey = ref(0);

const breadcrumb = ref([
  {
    name: "Pengurusan Penolong Amil",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Mesyuarat/Program",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Semakan Semula",
    type: "current",
    path: "/BF-PA/PE/MP/07",
  },
]);

const formData = ref({
  idAktiviti: "MP2024-011",
  namaAktiviti: "Program Latihan Amil",
  jenisAktiviti: "Program",
      tarikhAktiviti: "10-04-2024",
  kadarElaun: "75.00",
  jumlahElaun: "225.00",
  status: "Ditolak",
  sebabPenolakan: "Maklumat kehadiran tidak lengkap. Sila pastikan semua Penolong Amil telah mendaftar kehadiran dengan betul.",
  ulasanKetua: "Permohonan ditolak kerana maklumat kehadiran tidak lengkap. Sila semak semula dan hantar semula.",
  ulasanSemula: "",
  senaraiPenolong: [
    {
      id: 1,
      nama: "Hana binti Ridzuan",
      tarikh: "10-04-2024",
      statusKehadiran: "Hadir",
    },
    {
      id: 2,
      nama: "Ridzuan bin Ali",
      tarikh: "10-04-2024",
      statusKehadiran: "Tidak Hadir",
    },
    {
      id: 3,
      nama: "Ahmad bin Omar",
      tarikh: "10-04-2024",
      statusKehadiran: "Hadir",
    },
    {
      id: 4,
      nama: "Fatimah binti Hassan",
      tarikh: "10-04-2024",
      statusKehadiran: "Hadir",
    },
    {
      id: 5,
      nama: "Mohd Zulkifli bin Abdullah",
      tarikh: "10-04-2024",
      statusKehadiran: "Tidak Hadir",
    },
  ],
});

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Semakan": "warning",
    "Lulus": "success",
    "Ditolak": "danger",
    "Kembali untuk Pembetulan": "warning",
    "Dalam Pemerhatian": "warning",
  };
  return variants[status] || "disabled"; // Use disabled for proper grey color
};

const handleSubmit = () => {
  if (!formData.value.ulasanSemula.trim()) {
    toast.error("Sila masukkan ulasan semula");
    return;
  }
  showResubmitModal.value = true;
};

const handleTolak = () => {
  showRejectModal.value = true;
};

const confirmResubmit = () => {
  showResubmitModal.value = false;
          toast.success("Permohonan berjaya dihantar semula kepada Ketua Jabatan");
  navigateTo('/BF-PA/PE/MP');
};

const confirmReject = () => {
  showRejectModal.value = false;
  toast.success("Permohonan berjaya ditolak semula");
  navigateTo('/BF-PA/PE/MP');
};

onMounted(async () => {
  // TODO: Fetch data based on ID from route.params.id
  // For now using mock data
});
</script>

<style scoped>
/* Add any additional styles here */
</style> 