<!-- 
  RTMF SCREEN: PA-KF-KJ-01_06 (Approval Screen)
  PURPOSE: Kelulusan akhir kategori penolong amil oleh Ketua Divisyen
  DESCRIPTION: Final approval screen for verified Penolong Amil categories by Ketua Divisyen
  ROUTE: /BF-PA/KF/KJ/approve/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:shield-check" class="w-6 h-6 mr-3 text-success" />
            Kelulusan Akhir Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Kelulusan akhir kategori penolong amil oleh Ketua Divisyen</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="secondary-outline"
            @click="navigateTo('/BF-PA/KF/KJ')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Category Information Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:info-fill" class="w-5 h-5 mr-2" />
          Maklumat Kategori
        </h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Penolong Amil</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ categoryData.kategoriPenolongAmil }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kod Singkatan</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ categoryData.kodSingkatan }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status Semasa</label>
            <div class="mt-1">
              <rs-badge variant="info">
                Menunggu Kelulusan
              </rs-badge>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kuatkuasa</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ formatDate(categoryData.tarikhKuatkuasa) }}
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Penerangan Kategori</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ categoryData.penerangan || 'Tiada penerangan' }}
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Verification Details Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:user-check" class="w-5 h-5 mr-2" />
          Maklumat Pengesahan Ketua Jabatan
        </h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ketua Jabatan</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ verificationData.namaKetuaJabatan }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Pengesahan</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ formatDate(verificationData.tarikhPengesahan) }}
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ulasan Ketua Jabatan</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ verificationData.ulasanKetuaJabatan || 'Tiada ulasan' }}
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Approval Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:shield-check" class="w-5 h-5 mr-2" />
          Maklumat Kelulusan
        </h3>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Ketua Divisyen</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ approvalData.namaKetuaDivisyen }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kelulusan</label>
            <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
              {{ formatDate(approvalData.tarikhKelulusan) }}
            </div>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ulasan Kelulusan</label>
            <textarea
              v-model="approvalData.ulasanKelulusan"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="4"
              placeholder="Masukkan ulasan kelulusan..."
            ></textarea>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-3">
      <rs-button
        variant="secondary-outline"
        @click="navigateTo('/BF-PA/KF/KJ')"
      >
        Kembali
      </rs-button>
      <rs-button
        variant="success"
        @click="showApproveModal = true"
        :loading="isProcessing"
      >
        <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
        Luluskan
      </rs-button>
    </div>

    <!-- Approval Confirmation Modal -->
    <rs-modal
      v-model="showApproveModal"
      title="Luluskan Kategori"
      size="md"
    >
      <div class="p-4">
        <p class="text-gray-700 mb-4">
          Adakah anda pasti mahu <strong>meluluskan</strong> kategori ini?
        </p>
        <p class="text-sm text-gray-600">
          Kategori akan diaktifkan dan boleh digunakan dalam sistem.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="secondary-outline"
            @click="showApproveModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="success"
            @click="approveCategory"
            :loading="isProcessing"
          >
            Luluskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";

const route = useRoute();

definePageMeta({
  title: "Kelulusan Akhir Kategori Penolong Amil",
});

// Role-based access control
onMounted(() => {
  const currentUserRole = "ketua-divisyen"; // This would come from auth system
  if (currentUserRole !== "ketua-divisyen") {
    alert("Anda tidak mempunyai kebenaran untuk meluluskan kategori");
    navigateTo('/BF-PA/KF/KJ');
  }
});

const breadcrumb = ref([
  {
    name: "Utama",
    type: "link",
    path: "/"
  },
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA"
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF/KJ"
  },
  {
    name: "Kelulusan Akhir",
    type: "current",
    path: "/BF-PA/KF/KJ/approve"
  }
]);

// Component state
const isProcessing = ref(false);
const showApproveModal = ref(false);

// Mock category data (would be fetched from API in real app)
const categoryData = ref({
  id: route.params.id,
  kategoriPenolongAmil: "Penolong Amil Wakaf",
  kodSingkatan: "PAW",
  status: "Menunggu Kelulusan",
      tarikhKuatkuasa: "01-01-2024",
  penerangan: "Kategori untuk menguruskan zakat wakaf",
});

// Mock verification data from Ketua Jabatan
const verificationData = ref({
  namaKetuaJabatan: "Encik Ahmad bin Abdullah",
      tarikhPengesahan: "15-01-2024",
  ulasanKetuaJabatan: "Kategori ini sesuai dan boleh diluluskan untuk kegunaan sistem.",
});

// Mock approval data
const approvalData = ref({
  namaKetuaDivisyen: "Datuk Dr. Siti binti Mohamed",
  tarikhKelulusan: new Date().toISOString().split('T')[0],
  ulasanKelulusan: "",
});

const approveCategory = async () => {
  isProcessing.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Kategori penolong amil berjaya diluluskan dan diaktifkan dalam sistem.");
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    console.error('Error approving category:', error);
    alert("Ralat semasa meluluskan kategori");
  } finally {
    isProcessing.value = false;
    showApproveModal.value = false;
  }
};
</script> 