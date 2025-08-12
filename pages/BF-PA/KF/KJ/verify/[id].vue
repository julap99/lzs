<!-- 
  RTMF SCREEN: PA-KF-KJ-01_05 (Verification Screen)
  PURPOSE: Pengesahan kategori penolong amil baharu oleh Ketua Jabatan
  DESCRIPTION: Verification screen for new Penolong Amil categories by Ketua Jabatan
  ROUTE: /BF-PA/KF/KJ/verify/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:check-circle" class="w-6 h-6 mr-3 text-warning" />
            Pengesahan Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Pengesahan kategori penolong amil baharu oleh Ketua Jabatan</p>
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
              <rs-badge variant="warning">
                Menunggu Pengesahan
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

    <!-- Verification Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <Icon name="ph:user-check" class="w-5 h-5 mr-2" />
          Maklumat Pengesahan
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Ulasan</label>
            <textarea
              v-model="verificationData.ulasan"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="4"
              placeholder="Masukkan ulasan pengesahan..."
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
        variant="danger"
        @click="showRejectModal = true"
      >
        <Icon name="ph:x-circle" class="w-4 h-4 mr-2" />
        Tolak
      </rs-button>
      <rs-button
        variant="warning"
        @click="showVerifyModal = true"
        :loading="isProcessing"
      >
        <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
        Sahkan
      </rs-button>
    </div>

    <!-- Verification Confirmation Modal -->
    <rs-modal
      v-model="showVerifyModal"
      title="Sahkan Kategori"
      size="md"
    >
      <div class="p-4">
        <p class="text-gray-700 mb-4">
          Adakah anda pasti mahu <strong>mengesahkan</strong> kategori ini?
        </p>
        <p class="text-sm text-gray-600">
          Kategori akan dihantar kepada Ketua Divisyen untuk kelulusan akhir.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="secondary-outline"
            @click="showVerifyModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="warning"
            @click="verifyCategory"
            :loading="isProcessing"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Rejection Confirmation Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Tolak Kategori"
      size="md"
    >
      <div class="p-4">
        <p class="text-gray-700 mb-4">
          Adakah anda pasti mahu <strong>menolak</strong> kategori ini?
        </p>
        <p class="text-sm text-gray-600">
          Kategori akan dikembalikan kepada Eksekutif untuk pembetulan.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button
            variant="secondary-outline"
            @click="showRejectModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="rejectCategory"
            :loading="isProcessing"
          >
            Tolak
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Pengesahan Kategori Penolong Amil",
});

// Role-based access control
onMounted(() => {
  const currentUserRole = "ketua-jabatan"; // This would come from auth system
  if (currentUserRole !== "ketua-jabatan") {
    alert("Anda tidak mempunyai kebenaran untuk mengesahkan kategori");
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
    name: "Pengesahan Kategori",
    type: "current",
    path: "/BF-PA/KF/KJ/verify"
  }
]);

// Component state
const isProcessing = ref(false);
const showVerifyModal = ref(false);
const showRejectModal = ref(false);

// Mock category data (would be fetched from API in real app)
const categoryData = ref({
  id: route.params.id,
  kategoriPenolongAmil: "Penolong Amil Wakaf",
  kodSingkatan: "PAW",
  status: "Menunggu Pengesahan",
  tarikhKuatkuasa: "2024-01-01",
  penerangan: "Kategori untuk menguruskan zakat wakaf",
});

// Mock verification data
const verificationData = ref({
  namaKetuaJabatan: "Encik Ahmad bin Abdullah",
  tarikhPengesahan: new Date().toISOString().split('T')[0],
  ulasan: "",
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ms-MY');
};

const verifyCategory = async () => {
  isProcessing.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Kategori penolong amil berjaya disahkan. Akan dihantar kepada Ketua Divisyen untuk kelulusan akhir.");
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    console.error('Error verifying category:', error);
    alert("Ralat semasa mengesahkan kategori");
  } finally {
    isProcessing.value = false;
    showVerifyModal.value = false;
  }
};

const rejectCategory = async () => {
  isProcessing.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Kategori penolong amil berjaya ditolak. Akan dikembalikan kepada Eksekutif untuk pembetulan.");
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    console.error('Error rejecting category:', error);
    alert("Ralat semasa menolak kategori");
  } finally {
    isProcessing.value = false;
    showRejectModal.value = false;
  }
};
</script> 