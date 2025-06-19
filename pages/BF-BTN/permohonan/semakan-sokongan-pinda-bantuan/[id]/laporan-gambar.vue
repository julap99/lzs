<template>
  <div class="min-h-screen">
    <LayoutsBreadcrumb :items="breadcrumb" />
    
    <div class="mt-6 mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Laporan Gambar</h1>
      <p class="mt-1 text-sm text-gray-600">Semua gambar lokasi dan catatan</p>
    </div>

    <div class="space-y-6">
      <!-- Summary Card -->
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Ringkasan Gambar</h2>
            <rs-badge variant="info" class="text-sm">
              {{ images.length }} gambar
            </rs-badge>
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ images.length }}</div>
              <div class="text-sm text-blue-700">Jumlah Gambar</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ categorizedImages.external.length }}</div>
              <div class="text-sm text-green-700">Gambar Luaran</div>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ categorizedImages.internal.length }}</div>
              <div class="text-sm text-orange-700">Gambar Dalaman</div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Image Gallery -->
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Galeri Gambar</h2>
            <div class="flex items-center gap-2">
              <FormKit
                v-model="selectedCategory"
                type="select"
                :options="categoryOptions"
                :classes="{ input: '!py-2' }"
              />
              <rs-button variant="secondary-outline" size="sm" @click="downloadAllImages">
                <Icon name="ph:download" class="w-4 h-4 mr-2" />
                Muat Turun Semua
              </rs-button>
            </div>
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(image, index) in filteredImages"
              :key="index"
              class="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <!-- Image -->
              <div class="aspect-w-16 aspect-h-12 bg-gray-100">
                <img
                  :src="image.url"
                  :alt="image.description"
                  class="w-full h-48 object-cover cursor-pointer"
                  @click="openImageModal(image)"
                  loading="lazy"
                />
              </div>
              
              <!-- Image Info -->
              <div class="p-4">
                <div class="flex items-center justify-between mb-2">
                  <rs-badge 
                    :variant="image.category === 'external' ? 'success' : 'warning'" 
                    size="sm"
                  >
                    {{ image.category === 'external' ? 'Luaran' : 'Dalaman' }}
                  </rs-badge>
                  <span class="text-xs text-gray-500">{{ image.date }}</span>
                </div>
                
                <h3 class="font-medium text-gray-900 mb-2">{{ image.title }}</h3>
                <p class="text-sm text-gray-600 mb-3">{{ image.description }}</p>
                
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">{{ image.size }}</span>
                  <div class="flex gap-2">
                    <rs-button variant="primary-outline" size="sm" @click="viewImage(image)">
                      <Icon name="ph:eye" class="w-4 h-4" />
                    </rs-button>
                    <rs-button variant="secondary-outline" size="sm" @click="downloadImage(image)">
                      <Icon name="ph:download" class="w-4 h-4" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredImages.length === 0" class="text-center py-12">
            <Icon name="ph:images" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Tiada Gambar</h3>
            <p class="text-gray-500">Tiada gambar dalam kategori yang dipilih</p>
          </div>
        </template>
      </rs-card>

      <!-- Back Button -->
      <div class="flex justify-center">
        <rs-button variant="primary-outline" @click="goBack" class="px-8">
          <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
          Kembali
        </rs-button>
      </div>
    </div>

    <!-- Image Modal -->
    <teleport to="body">
      <div
        v-if="selectedImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        @click="closeImageModal"
      >
        <div class="relative max-w-4xl max-h-full p-4" @click.stop>
          <img
            :src="selectedImage.url"
            :alt="selectedImage.description"
            class="max-w-full max-h-full object-contain rounded-lg"
          />
          
          <!-- Modal Controls -->
          <div class="absolute top-4 right-4 flex gap-2">
            <rs-button variant="secondary" size="sm" @click="downloadImage(selectedImage)">
              <Icon name="ph:download" class="w-4 h-4" />
            </rs-button>
            <rs-button variant="secondary" size="sm" @click="closeImageModal">
              <Icon name="ph:x" class="w-4 h-4" />
            </rs-button>
          </div>
          
          <!-- Image Info Overlay -->
          <div class="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <h3 class="font-medium mb-1">{{ selectedImage.title }}</h3>
            <p class="text-sm opacity-90">{{ selectedImage.description }}</p>
            <div class="flex items-center justify-between mt-2 text-xs opacity-75">
              <span>{{ selectedImage.date }}</span>
              <span>{{ selectedImage.size }}</span>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const breadcrumb = ref([
  { name: "Senarai Permohonan", type: "link", path: "/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan" },
  { name: "Semak Permohonan", type: "link", path: `/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}` },
  { name: "Laporan Gambar", type: "current", path: "" },
]);

const selectedCategory = ref("all");
const selectedImage = ref(null);

const categoryOptions = [
  { label: "Semua Gambar", value: "all" },
  { label: "Gambar Luaran", value: "external" },
  { label: "Gambar Dalaman", value: "internal" },
];

// Mock images data
const images = ref([
  {
    id: 1,
    title: "Bahagian Hadapan Bangunan",
    description: "Pandangan hadapan masjid menunjukkan keadaan semasa struktur utama dan halaman",
    category: "external",
    url: "/img/masjid-front.jpg",
    date: "20 Nov 2024",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Bahagian Belakang Masjid",
    description: "Keadaan belakang masjid dengan ruang parkir dan kemudahan tambahan",
    category: "external",
    url: "/img/masjid-back.jpg",
    date: "20 Nov 2024",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Ruang Solat Utama",
    description: "Ruang solat utama yang memerlukan pembaikan pada siling dan dinding",
    category: "internal",
    url: "/img/prayer-hall.jpg",
    date: "20 Nov 2024",
    size: "3.1 MB",
  },
  {
    id: 4,
    title: "Ruang Wudhu",
    description: "Kemudahan wudhu yang memerlukan naik taraf sistem paip dan keramik",
    category: "internal",
    url: "/img/wudhu-area.jpg",
    date: "20 Nov 2024",
    size: "1.9 MB",
  },
  {
    id: 5,
    title: "Menara Masjid",
    description: "Menara masjid dengan kerosakan pada bahagian atas yang perlu dibaiki",
    category: "external",
    url: "/img/minaret.jpg",
    date: "20 Nov 2024",
    size: "2.2 MB",
  },
  {
    id: 6,
    title: "Ruang Pentadbiran",
    description: "Pejabat pentadbiran masjid yang memerlukan renovasi",
    category: "internal",
    url: "/img/admin-office.jpg",
    date: "20 Nov 2024",
    size: "1.5 MB",
  },
  {
    id: 7,
    title: "Sistem Elektrik",
    description: "Keadaan panel elektrik dan wayaring yang memerlukan penggantian",
    category: "internal",
    url: "/img/electrical.jpg",
    date: "20 Nov 2024",
    size: "1.3 MB",
  },
  {
    id: 8,
    title: "Ruang Kelas Mengaji",
    description: "Ruang kelas untuk aktiviti mengaji yang memerlukan kemudahan baru",
    category: "internal",
    url: "/img/classroom.jpg",
    date: "20 Nov 2024",
    size: "2.0 MB",
  },
]);

// Computed properties
const categorizedImages = computed(() => {
  return {
    external: images.value.filter(img => img.category === 'external'),
    internal: images.value.filter(img => img.category === 'internal'),
  };
});

const filteredImages = computed(() => {
  if (selectedCategory.value === 'all') {
    return images.value;
  }
  return images.value.filter(img => img.category === selectedCategory.value);
});

// Methods
const openImageModal = (image) => {
  selectedImage.value = image;
};

const closeImageModal = () => {
  selectedImage.value = null;
};

const viewImage = (image) => {
  openImageModal(image);
};

const downloadImage = (image) => {
  toast.info(`Memuat turun ${image.title}...`);
  // Implementation for downloading single image
  console.log("Downloading image:", image.title);
};

const downloadAllImages = () => {
  toast.info("Memuat turun semua gambar...");
  // Implementation for downloading all images
  console.log("Downloading all images");
};

const goBack = () => {
  router.push(`/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}`);
};

// Handle keyboard events for modal
const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedImage.value) {
    closeImageModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style lang="scss" scoped>
// Custom styling for image gallery
.aspect-w-16 {
  position: relative;
  padding-bottom: 75%; // 16:12 aspect ratio
}

.aspect-h-12 img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// Modal backdrop
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}

// Hover effects
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

// Status colors
.bg-blue-50 {
  background-color: #eff6ff;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.bg-orange-50 {
  background-color: #fff7ed;
}

.text-blue-600 {
  color: #2563eb;
}

.text-blue-700 {
  color: #1d4ed8;
}

.text-green-600 {
  color: #16a34a;
}

.text-green-700 {
  color: #15803d;
}

.text-orange-600 {
  color: #ea580c;
}

.text-orange-700 {
  color: #c2410c;
}
</style> 