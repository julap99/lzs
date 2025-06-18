<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-6 space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Laporan Gambar</h1>
            <p class="mt-1 text-sm text-gray-600">Laporan gambar siasatan lapangan untuk semakan kelulusan</p>
          </div>
          <div class="flex items-center space-x-4">
            <rs-badge variant="info" class="px-3 py-1">
              <span class="text-sm">{{ imageReport.images.length }} Gambar</span>
            </rs-badge>
            <rs-badge variant="success" class="px-3 py-1">
              <span class="text-sm">Siap Disediakan</span>
            </rs-badge>
          </div>
        </div>
      </div>

      <!-- Report Information -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:camera" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Maklumat Laporan</h2>
              <p class="text-sm text-gray-500">Butiran asas laporan gambar</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">No Rujukan Laporan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm font-mono text-gray-900">{{ imageReport.noRujukan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Siasatan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ imageReport.tarikhSiasatan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Juru Foto</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ imageReport.juruFoto }}</span>
              </div>
            </div>

            <div class="space-y-1 md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Lokasi Siasatan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ imageReport.lokasiSiasatan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Status Laporan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <rs-badge variant="success" class="text-sm">
                  {{ imageReport.statusLaporan }}
                </rs-badge>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Image Gallery by Category -->
      <div class="space-y-6">
        <!-- Keadaan Semasa -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:eye" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Keadaan Semasa Tapak</h2>
                  <p class="text-sm text-gray-500">Gambar situasi semasa di lokasi projek</p>
                </div>
              </div>
              <rs-badge variant="info" class="px-2 py-1">
                <span class="text-xs">{{ getImagesByCategory('semasa').length }} gambar</span>
              </rs-badge>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(image, index) in getImagesByCategory('semasa')"
                :key="index"
                class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                @click="openImageModal(image)"
              >
                <div class="aspect-w-16 aspect-h-12">
                  <img
                    :src="image.url"
                    :alt="image.keterangan"
                    class="w-full h-48 object-cover"
                  />
                </div>
                <div class="p-4">
                  <h4 class="font-medium text-gray-900 mb-2">{{ image.tajuk }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ image.keterangan }}</p>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>{{ image.tarikhAmbil }}</span>
                    <span>{{ image.masa }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Masalah/Keperluan -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:warning" class="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Masalah dan Keperluan</h2>
                  <p class="text-sm text-gray-500">Gambar yang menunjukkan isu dan keperluan</p>
                </div>
              </div>
              <rs-badge variant="warning" class="px-2 py-1">
                <span class="text-xs">{{ getImagesByCategory('masalah').length }} gambar</span>
              </rs-badge>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(image, index) in getImagesByCategory('masalah')"
                :key="index"
                class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                @click="openImageModal(image)"
              >
                <div class="aspect-w-16 aspect-h-12">
                  <img
                    :src="image.url"
                    :alt="image.keterangan"
                    class="w-full h-48 object-cover"
                  />
                </div>
                <div class="p-4">
                  <h4 class="font-medium text-gray-900 mb-2">{{ image.tajuk }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ image.keterangan }}</p>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>{{ image.tarikhAmbil }}</span>
                    <span>{{ image.masa }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Cadangan Penyelesaian -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:lightbulb" class="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Cadangan Penyelesaian</h2>
                  <p class="text-sm text-gray-500">Gambar ilustrasi cadangan kerja</p>
                </div>
              </div>
              <rs-badge variant="info" class="px-2 py-1">
                <span class="text-xs">{{ getImagesByCategory('cadangan').length }} gambar</span>
              </rs-badge>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="(image, index) in getImagesByCategory('cadangan')"
                :key="index"
                class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                @click="openImageModal(image)"
              >
                <div class="aspect-w-16 aspect-h-12">
                  <img
                    :src="image.url"
                    :alt="image.keterangan"
                    class="w-full h-48 object-cover"
                  />
                </div>
                <div class="p-4">
                  <h4 class="font-medium text-gray-900 mb-2">{{ image.tajuk }}</h4>
                  <p class="text-sm text-gray-600 mb-2">{{ image.keterangan }}</p>
                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>{{ image.tarikhAmbil }}</span>
                    <span>{{ image.masa }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Report Summary -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:note" class="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Ringkasan Laporan Gambar</h2>
              <p class="text-sm text-gray-500">Kesimpulan dari dokumentasi visual</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="prose prose-sm max-w-none">
            <div class="bg-gray-50 p-4 rounded-lg border">
              <p class="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{{ imageReport.ringkasan }}</p>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Report Verification -->
      <rs-card class="shadow-sm border-0 bg-white">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:stamp" class="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Pengesahan Laporan</h2>
              <p class="text-sm text-gray-500">Maklumat pengesahan dan tandatangan</p>
            </div>
          </div>
        </template>

        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Disediakan Oleh</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.disediakanOleh }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Disediakan</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.tarikhDisediakan }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Disemak Oleh</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.disemakOleh }}</span>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700">Tarikh Disemak</label>
              <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                <span class="text-sm text-gray-900">{{ verification.tarikhDisemak }}</span>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <rs-button variant="secondary-outline" @click="handleDownloadReport">
          <Icon name="ph:download" class="w-5 h-5 mr-2" />
          Muat Turun Laporan
        </rs-button>
        <rs-button variant="secondary-outline" @click="handleBack">
          <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
          Kembali
        </rs-button>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click.self="closeImageModal"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeImageModal"></div>
        
        <div class="relative inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div class="absolute top-4 right-4">
            <button
              type="button"
              class="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
              @click="closeImageModal"
            >
              <Icon name="ph:x" class="w-6 h-6" />
            </button>
          </div>
          
          <div v-if="selectedImage" class="space-y-4">
            <div class="text-center">
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ selectedImage.tajuk }}</h3>
              <img
                :src="selectedImage.url"
                :alt="selectedImage.keterangan"
                class="w-full max-h-96 object-contain mx-auto rounded-lg"
              />
            </div>
            <div class="border-t pt-4">
              <p class="text-sm text-gray-900 mb-2">{{ selectedImage.keterangan }}</p>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Tarikh: {{ selectedImage.tarikhAmbil }}</span>
                <span>Masa: {{ selectedImage.masa }}</span>
                <span>Kategori: {{ selectedImage.kategori }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Laporan Gambar - Semakan Kelulusan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Semakan Kelulusan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-semakan-kelulusan",
  },
  {
    name: "Keputusan Kelulusan",
    type: "link",
    path: `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}`,
  },
  {
    name: "Laporan Gambar",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}/laporan-gambar`,
  },
]);

// Image Report Data
const imageReport = ref({
  noRujukan: "",
  tarikhSiasatan: "",
  juruFoto: "",
  lokasiSiasatan: "",
  statusLaporan: "",
  ringkasan: "",
  images: [],
});

const verification = ref({
  disediakanOleh: "",
  tarikhDisediakan: "",
  disemakOleh: "",
  tarikhDisemak: "",
});

// Modal state
const showModal = ref(false);
const selectedImage = ref(null);

// Methods
const getImagesByCategory = (category) => {
  return imageReport.value.images.filter(image => image.kategori === category);
};

const openImageModal = (image) => {
  selectedImage.value = image;
  showModal.value = true;
};

const closeImageModal = () => {
  showModal.value = false;
  selectedImage.value = null;
};

const handleDownloadReport = () => {
  toast.info("Fungsi muat turun laporan sedang dalam pembangunan");
  // Implement download functionality
};

const handleBack = () => {
  router.push(`/BF-BTN/permohonan/senarai-semakan-kelulusan/${route.params.id}`);
};

// Load data on mount
onMounted(async () => {
  try {
    // Mock data - replace with actual API call
    imageReport.value = {
      noRujukan: "LG-2024-INF-001",
      tarikhSiasatan: "10 November 2024",
      juruFoto: "Encik Mohd Faris bin Ahmad (Pegawai Teknikal)",
      lokasiSiasatan: "Kampung Seri Damai, 43000 Kajang, Selangor",
      statusLaporan: "Selesai Disediakan",
      ringkasan: `Laporan gambar ini menyediakan dokumentasi visual yang komprehensif mengenai kondisi semasa tapak projek dan keperluan pembangunan yang dicadangkan.

KEADAAN SEMASA:
Tapak projek berada dalam keadaan yang memerlukan pembangunan infrastruktur asas. Lokasi strategik dengan akses yang baik.

MASALAH YANG DIKENAL PASTI:
• Keperluan kerja tanah dan perataan
• Sistem saliran yang perlu diperbaiki
• Akses jalan yang memerlukan naik taraf

CADANGAN YANG DICADANGKAN:
• Pembinaan mengikut spesifikasi BQ
• Penambahbaikan infrastruktur sokongan
• Kerja landscaping untuk keindahan

Kesemua gambar menunjukkan projek ini wajar untuk diluluskan dan dilaksanakan.`,
      
      images: [
        // Keadaan Semasa
        {
          kategori: "semasa",
          tajuk: "Pandangan Keseluruhan Tapak",
          keterangan: "Gambaran umum tapak projek dari pintu masuk utama menunjukkan keadaan semasa tanah dan persekitaran.",
          url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "09:00 AM"
        },
        {
          kategori: "semasa",
          tajuk: "Kondisi Tanah Semasa",
          keterangan: "Keadaan tanah di bahagian tengah tapak yang menunjukkan keperluan kerja perataan.",
          url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "09:15 AM"
        },
        {
          kategori: "semasa",
          tajuk: "Akses Jalan Sedia Ada",
          keterangan: "Jalan akses semasa ke tapak projek yang memerlukan penambahbaikan.",
          url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "09:30 AM"
        },
        
        // Masalah/Keperluan
        {
          kategori: "masalah",
          tajuk: "Masalah Saliran Air",
          keterangan: "Kawasan yang mengalami masalah saliran air yang perlu diatasi sebelum pembinaan dimulakan.",
          url: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "10:00 AM"
        },
        {
          kategori: "masalah",
          tajuk: "Kerosakan Permukaan Jalan",
          keterangan: "Bahagian jalan yang rosak dan memerlukan pembaikan untuk akses yang lebih baik.",
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "10:15 AM"
        },
        
        // Cadangan
        {
          kategori: "cadangan",
          tajuk: "Lokasi Cadangan Pembinaan",
          keterangan: "Kawasan yang dicadangkan untuk pembinaan struktur utama berdasarkan kajian tapak.",
          url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "10:45 AM"
        },
        {
          kategori: "cadangan",
          tajuk: "Cadangan Akses Jalan Baharu",
          keterangan: "Laluan yang dicadangkan untuk akses jalan yang lebih baik ke tapak projek.",
          url: "https://images.unsplash.com/photo-1413290733034-9169cbda7a0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "11:00 AM"
        },
        {
          kategori: "cadangan",
          tajuk: "Kawasan Landscaping",
          keterangan: "Kawasan yang dicadangkan untuk kerja landscaping dan penambahbaikan estetik.",
          url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          tarikhAmbil: "10 Nov 2024",
          masa: "11:15 AM"
        }
      ]
    };

    verification.value = {
      disediakanOleh: "Encik Mohd Faris bin Ahmad - Pegawai Teknikal Gred 41",
      tarikhDisediakan: "12 November 2024",
      disemakOleh: "Puan Siti Aminah binti Razak - Ketua Pegawai Teknikal",
      tarikhDisemak: "14 November 2024",
    };

  } catch (error) {
    toast.error("Ralat semasa memuatkan laporan gambar");
    console.error("Error loading image report:", error);
  }
});
</script>

<style lang="scss" scoped>
// Aspect ratio utilities
.aspect-w-16 {
  position: relative;
  padding-bottom: calc(12 / 16 * 100%);
}

.aspect-w-16 > img {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

// Image styling
img {
  border-radius: 0.5rem;
}

// Hover effects
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

// Transition
.transition-shadow {
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

// Modal backdrop
.bg-opacity-75 {
  background-opacity: 0.75;
}

// Content formatting
.prose {
  max-width: none;
}

.whitespace-pre-line {
  white-space: pre-line;
}

// Cursor pointer
.cursor-pointer {
  cursor: pointer;
}

// Fixed positioning for modal
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}

.z-50 {
  z-index: 50;
}
</style> 