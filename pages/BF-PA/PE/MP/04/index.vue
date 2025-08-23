<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Ketua Jabatan - Kiraan Jumlah Elaun
          </h2>
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

          <!-- Maklumat Semakan PT Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Semakan PT</h3>
            <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Disemak Oleh</p>
                  <p class="font-medium">{{ formData.ptReview.reviewedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Semakan</p>
                  <p class="font-medium">{{ formData.ptReview.reviewedAt }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Ulasan PT</p>
                  <p class="font-medium mt-1">{{ formData.ptReview.remarks }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Sokongan Eksekutif Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Sokongan Eksekutif</h3>
            <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Disokong Oleh</p>
                  <p class="font-medium">{{ formData.eksekutifReview.reviewedBy }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tarikh Sokongan</p>
                  <p class="font-medium">{{ formData.eksekutifReview.reviewedAt }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-500">Ulasan Eksekutif</p>
                  <p class="font-medium mt-1">{{ formData.eksekutifReview.remarks }}</p>
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

          <!-- Ketua Jabatan Review Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Kelulusan Ketua Jabatan</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="ketuaJabatanRemarks"
                label="Ulasan Ketua Jabatan"
                validation="required"
                validation-label="Ulasan"
                placeholder="Sila masukkan ulasan kelulusan anda..."
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
              Lulus
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
            name="ic:outline-cancel"
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
      title="Sahkan Kelulusan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
            <Icon
            name="ic:baseline-check-circle"
            class="text-green-500 text-5xl mb-4"
            />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk meluluskan kiraan elaun ini?
          </p>
          <p class="text-gray-600">
            Kiraan elaun ini akan diluluskan dan Payment Advice akan dijana secara automatik.
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
            Ya, Lulus
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
  title: "Kelulusan Ketua Jabatan - Kiraan Jumlah Elaun",
  description: "Kelulusan Ketua Jabatan untuk kiraan jumlah elaun penolong amil",
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
    name: "Kelulusan Ketua Jabatan",
    type: "current",
    path: "/BF-PA/PE/MP/04",
  },
]);

// Form data
const formData = ref({
  idAktiviti: 'MP2024-001',
  namaAktiviti: 'Mesyuarat Perancangan Bulanan',
  jenisAktiviti: 'Mesyuarat',
      tarikhAktiviti: '15-04-2024',
  lokasi: 'Dewan Mesyuarat Eksekutif',
  status: 'Menunggu Kelulusan Ketua Jabatan',
  kadarElaun: '50.00',
  jumlahElaun: '250.00',
  ketuaJabatanRemarks: '',
  ptReview: {
    reviewedBy: 'Ahmad bin Ismail',
    reviewedAt: '16-04-2024, 10:30',
    remarks: 'Kiraan elaun telah disemak dan didapati tepat. Semua dokumen sokongan lengkap dan memenuhi kriteria yang ditetapkan. Aktiviti ini disokong untuk diteruskan kepada Eksekutif untuk sokongan seterusnya.'
  },
  eksekutifReview: {
    reviewedBy: 'Sarah binti Hamid',
    reviewedAt: '17-04-2024, 14:15',
    remarks: 'Berdasarkan semakan dokumen dan maklumat yang dikemukakan, aktiviti ini disokong untuk diluluskan. Aktiviti memenuhi semua kriteria yang ditetapkan dan kiraan elaun adalah munasabah.'
  },
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
  if (!formData.value.ketuaJabatanRemarks.trim()) {
    toast.warning('Sila masukkan ulasan sebelum menolak');
    return;
  }
  showRejectModal.value = true;
};

const handleApprove = () => {
  if (!formData.value.ketuaJabatanRemarks.trim()) {
    toast.warning('Sila masukkan ulasan sebelum meluluskan');
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
    // Update status to approved
    formData.value.status = 'Diluluskan';
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Kiraan elaun telah diluluskan dan Payment Advice akan dijana');
    showApproveModal.value = false;
    
    // Navigate back to dashboard
    navigateTo('/BF-PA/PE/MP');
  } catch (error) {
    toast.error('Ralat semasa meluluskan kiraan elaun');
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
