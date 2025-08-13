<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan PT - Kiraan Jumlah Elaun</h2>
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
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Maklumat Aktiviti</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">ID Aktiviti</p>
                  <p class="font-medium">{{ formData.idAktiviti }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Nama Aktiviti</p>
                  <p class="font-medium">{{ formData.namaAktiviti }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Jenis Aktiviti</p>
                  <p class="font-medium">{{ formData.jenisAktiviti }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Aktiviti</p>
                  <p class="font-medium">{{ formData.tarikhAktiviti }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Lokasi</p>
                  <p class="font-medium">{{ formData.lokasi }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Status</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getStatusClass(formData.status)"
                  >
                    {{ formData.status }}
                  </span>
                </div>
              </div>
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
                { key: 'statusKehadiran', label: 'Status Kehadiran' },
                { key: 'elaun', label: 'Elaun (RM)' }
              ]"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
              <template v-slot:nama="data">
                {{ data.text }}
              </template>
              <template v-slot:statusKehadiran="data">
                <rs-badge :variant="getAttendanceVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>
              <template v-slot:elaun="data">
                RM {{ data.text }}
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
                label="Kadar Elaun (RM)" 
                disabled 
              />
              <FormKit
                type="text"
                name="jumlahElaun"
                label="Jumlah Elaun (RM)"
                disabled
              />
            </div>
          </div>

          <!-- PT Review Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Semakan PT</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="ptRemarks"
                label="Ulasan PT"
                validation="required"
                validation-label="Ulasan"
                placeholder="Sila masukkan ulasan semakan anda..."
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="goBack"
            >
              Kembali
            </rs-button>
            <rs-button 
              variant="danger-outline"
              @click="handleReject"
            >
              Tolak
            </rs-button>
              <rs-button
              variant="success"
              @click="handleApprove"
            >
              Semak & Hantar
              </rs-button>
            </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Reject Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Sahkan Penolakan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:cancel-outline"
            class="text-red-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menolak kiraan elaun ini?
          </p>
          <p class="text-gray-600">
            Kiraan elaun ini akan dikembalikan kepada pemohon untuk pembetulan.
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
            Ya, Tolak
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Approve Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Sahkan Semakan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:check-circle-outline"
            class="text-green-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk meluluskan semakan dan menghantar kepada Eksekutif?
          </p>
          <p class="text-gray-600">
            Kiraan elaun ini akan dihantar kepada Eksekutif untuk sokongan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showApproveModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="success" @click="confirmApprove">
            Ya, Hantar
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Semakan PT - Kiraan Jumlah Elaun",
  description: "Semakan PT untuk kiraan jumlah elaun penolong amil",
});

const toast = useToast();

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
    name: "Semakan PT",
    type: "current",
    path: "/BF-PA/PE/MP/01",
  },
]);

// Form data
const formData = ref({
  idAktiviti: 'MP2024-001',
  namaAktiviti: 'Mesyuarat Perancangan Bulanan',
  jenisAktiviti: 'Mesyuarat',
  tarikhAktiviti: '15/04/2024',
  lokasi: 'Dewan Mesyuarat Eksekutif',
  status: 'Menunggu Semakan PT',
  kadarElaun: '50.00',
  jumlahElaun: '250.00',
  ptRemarks: '',
  senaraiPenolong: [
    {
      nama: 'Ahmad bin Ismail',
      statusKehadiran: 'Hadir',
      elaun: '50.00'
    },
    {
      nama: 'Sarah binti Hamid',
      statusKehadiran: 'Hadir',
      elaun: '50.00'
    },
    {
      nama: 'Mohd Zulkifli bin Abdullah',
      statusKehadiran: 'Hadir',
      elaun: '50.00'
    },
    {
      nama: 'Nurul Ain binti Omar',
      statusKehadiran: 'Hadir',
      elaun: '50.00'
    },
    {
      nama: 'Khairul Anuar bin Hassan',
      statusKehadiran: 'Hadir',
      elaun: '50.00'
    }
  ]
});

// Modal states
const showRejectModal = ref(false);
const showApproveModal = ref(false);
const tableKey = ref(0);

// Helper functions
const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Semakan PT': 'warning',
    'Menunggu Sokongan Eksekutif': 'warning',
    'Menunggu Kelulusan Ketua Jabatan': 'primary',
    'Diluluskan': 'success',
    'Ditolak': 'danger',
  };
  return variants[status] || 'disabled'; // Use disabled for proper grey color
};

const getStatusClass = (status) => {
  const classes = {
    'Menunggu Semakan PT': 'bg-yellow-100 text-yellow-800',
    'Menunggu Sokongan Eksekutif': 'bg-yellow-100 text-yellow-800',
    'Menunggu Kelulusan Ketua Jabatan': 'bg-blue-100 text-blue-800',
    'Diluluskan': 'bg-green-100 text-green-800',
    'Ditolak': 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getAttendanceVariant = (status) => {
  const variants = {
    'Hadir': 'success',
    'Tidak Hadir': 'danger',
    'Cuti': 'warning',
  };
  return variants[status] || 'disabled'; // Use disabled for proper grey color
};

// Event handlers
const handleSubmit = () => {
  // Form submission logic
};

const handleReject = () => {
  if (!formData.value.ptRemarks.trim()) {
    toast.warning('Sila masukkan ulasan sebelum menolak');
    return;
  }
  showRejectModal.value = true;
};

const handleApprove = () => {
  if (!formData.value.ptRemarks.trim()) {
    toast.warning('Sila masukkan ulasan sebelum menghantar');
    return;
  }
  showApproveModal.value = true;
};

const confirmReject = async () => {
  try {
    // Update status to rejected
    formData.value.status = 'Ditolak';
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Kiraan elaun telah ditolak dan dikembalikan kepada pemohon');
    showRejectModal.value = false;
    
    // Navigate back to dashboard
    navigateTo('/BF-PA/PE/MP');
  } catch (error) {
    toast.error('Ralat semasa menolak kiraan elaun');
    console.error('Error rejecting allowance:', error);
  }
};

const confirmApprove = async () => {
  try {
    // Update status to awaiting executive support
    formData.value.status = 'Menunggu Sokongan Eksekutif';
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Kiraan elaun telah disemak dan dihantar kepada Eksekutif');
    showApproveModal.value = false;
    
    // Navigate back to dashboard
    navigateTo('/BF-PA/PE/MP');
  } catch (error) {
    toast.error('Ralat semasa menghantar kiraan elaun');
    console.error('Error approving allowance:', error);
  }
};

const goBack = () => {
  navigateTo('/BF-PA/PE/MP');
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
