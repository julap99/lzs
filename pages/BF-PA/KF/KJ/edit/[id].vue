<!-- 
  RTMF SCREEN: PA-KF-KJ-03_01 (Position Edit)
  PURPOSE: Kemaskini maklumat jawatan untuk kategori penolong amil
  DESCRIPTION: Table-based edit interface for multiple positions within a category
  ROUTE: /BF-PA/KF/KJ/edit/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold flex items-center">
              <Icon name="ph:pencil-line" class="mr-2" size="24" />
              Kemaskini Maklumat Jawatan
            </h2>
            <p class="text-sm text-gray-600 mt-1">
              Kemaskini maklumat jawatan untuk kategori: {{ formData.kategoriPenolongAmil }}
            </p>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Category Context -->
        <rs-card class="mb-6 bg-gray-50 border-gray-300">
          <template #header>
            <div class="flex items-center">
              <Icon name="ph:tag" class="mr-2" size="20" />
              <h3 class="text-lg font-semibold">Maklumat Kategori</h3>
            </div>
          </template>
          
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Penolong Amil</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ formData.kategoriPenolongAmil }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kod Singkatan Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ categoryData.kodSingkatan }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Kategori</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  <rs-badge :variant="getStatusVariant(categoryData.status)">
                    {{ categoryData.status }}
                  </rs-badge>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Rujukan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-900">
                  {{ route.params.id }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Positions Table -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="ph:identification-card" class="mr-2" size="20" />
                <h3 class="text-lg font-semibold">Maklumat Jawatan dalam Kategori</h3>
              </div>
              
              <rs-button
                variant="success"
                size="sm"
                @click="tambahJawatan"
                class="flex items-center"
                title="Tambah Jawatan Baharu"
              >
                <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                Tambah Jawatan
              </rs-button>
            </div>
          </template>
          
          <template #body>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="text-left p-3 font-semibold text-gray-700 border-r border-gray-200">No.</th>
                    <th class="text-left p-3 font-semibold text-gray-700 border-r border-gray-200">Nama Jawatan</th>
                    <th class="text-left p-3 font-semibold text-gray-700 border-r border-gray-200">Kod Singkatan</th>
                    <th class="text-left p-3 font-semibold text-gray-700 border-r border-gray-200">Status</th>
                    <th class="text-left p-3 font-semibold text-gray-700 border-r border-gray-200">Tarikh Kuatkuasa</th>
                    <th class="text-left p-3 font-semibold text-gray-700">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr 
                    v-for="(jawatan, index) in formData.maklumatJawatan" 
                    :key="index"
                    class="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td class="p-3 border-r border-gray-200">
                      {{ index + 1 }}
                    </td>
                    
                    <!-- Nama Jawatan -->
                    <td class="p-3 border-r border-gray-200">
                      <input
                        v-model="jawatan.namaJawatan"
                        type="text"
                        placeholder="Masukkan nama jawatan"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @input="generateChangeLog"
                      />
                    </td>
                    
                    <!-- Kod Singkatan -->
                    <td class="p-3 border-r border-gray-200">
                      <input
                        v-model="jawatan.kodSingkatan"
                        type="text"
                        placeholder="Kod"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @input="generateChangeLog"
                      />
                    </td>
                    
                    <!-- Status -->
                    <td class="p-3 border-r border-gray-200">
                      <select
                        v-model="jawatan.status"
                        :disabled="isNewRow(jawatan)"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        @change="generateChangeLog"
                      >
                        <option value="AKTIF">AKTIF</option>
                        <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                      </select>
                      <p v-if="isNewRow(jawatan)" class="text-xs text-gray-500 mt-1">
                        Akan diaktifkan selepas kelulusan
                      </p>
                    </td>
                    
                    <!-- Tarikh Kuatkuasa -->
                    <td class="p-3 border-r border-gray-200">
                      <input
                        v-model="jawatan.tarikhKuatkuasa"
                        type="date"
                        :disabled="true"
                        class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-100 cursor-not-allowed"
                      />
                      <p v-if="!jawatan.tarikhKuatkuasa" class="text-xs text-gray-500 mt-1">
                        Akan ditetapkan selepas kelulusan
                      </p>
                    </td>
                    
                    <!-- Tindakan -->
                    <td class="p-3">
                      <rs-button
                        variant="danger"
                        size="sm"
                        @click="hapusJawatan(index)"
                        class="flex items-center"
                        title="Hapus Jawatan"
                      >
                        <Icon name="ph:trash" class="w-3 h-3" />
                      </rs-button>
                    </td>
                  </tr>
                  
                  <tr v-if="formData.maklumatJawatan.length === 0">
                    <td colspan="6" class="p-8 text-center text-gray-500">
                      <Icon name="ph:plus-circle" class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>Tiada jawatan dalam kategori ini</p>
                      <p class="text-sm">Klik "Tambah Jawatan" untuk menambah jawatan baharu</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-6 border-t border-gray-200">
          <rs-button
            variant="secondary"
            @click="navigateTo('/BF-PA/KF/KJ')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
          
          <rs-button
            variant="success"
            @click="showConfirmationModal = true"
            class="flex items-center"
          >
            <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
            Simpan Perubahan
          </rs-button>
        </div>

        <!-- Jejak Audit Section (Positioned at bottom) -->
        <rs-card class="mt-8 bg-gray-50 border-gray-300">
          <template #header>
            <div class="bg-gray-100 border-b border-gray-300 flex items-center justify-between">
              <div class="flex items-center">
                <Icon name="ph:clock-clockwise" class="mr-2 text-gray-600" size="18" />
                <h3 class="text-lg font-semibold text-gray-600">Jejak Audit</h3>
              </div>
              <p class="text-sm text-gray-500">Maklumat rujukan sahaja</p>
            </div>
          </template>
          
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Dicipta Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.diciptaOleh }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Cipta</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formatDate(formData.maklumatPegawai.tarikhCipta) }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Dikemaskini Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.dikemaskiniBoleh || 'Belum dikemaskini' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Kemaskini</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.tarikhKemaskini ? formatDate(formData.maklumatPegawai.tarikhKemaskini) : 'Belum dikemaskini' }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Disahkan Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.disahkanOleh || 'Belum disahkan' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Pengesahan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.tarikhPengesahan ? formatDate(formData.maklumatPegawai.tarikhPengesahan) : 'Belum disahkan' }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Diluluskan Oleh</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">Tarikh Kelulusan</label>
                <div class="bg-gray-100 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700">
                  {{ formData.maklumatPegawai.tarikhKelulusan ? formatDate(formData.maklumatPegawai.tarikhKelulusan) : 'Belum diluluskan' }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <Icon name="ph:check-circle" class="w-6 h-6 text-green-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900">Pengesahan Sokongan Eksekutif</h3>
          </div>
          
          <FormKit
            type="form"
            @submit="handleConfirmationSubmit"
            :actions="false"
          >
            <FormKit
              type="textarea"
              name="ulasanSokongan"
              label="Ulasan Sokongan"
              validation="required|length:10,300"
              rows="3"
              help="Berikan ulasan sokongan untuk perubahan jawatan ini"
            />

            <div class="grid grid-cols-2 gap-4 mt-4">
              <FormKit
                type="text"
                name="namaPenyokong"
                label="Nama Penyokong"
                :value="confirmationData.namaPenyokong"
                :disabled="true"
                help="Berdasarkan akaun semasa"
              />

              <FormKit
                type="date"
                name="tarikhSokongan"
                label="Tarikh Sokongan"
                :value="confirmationData.tarikhSokongan"
                :disabled="true"
                help="Tarikh semasa"
              />
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <rs-button
                variant="secondary"
                @click="showConfirmationModal = false"
              >
                Batal
              </rs-button>
              <rs-button
                variant="success"
                type="submit"
                :loading="isSubmitting"
              >
                Simpan dan Sokong
              </rs-button>
            </div>
          </FormKit>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { formatDate } from "~/utils/dateFormatter";
import { useToast } from "vue-toastification";

const toast = useToast();

definePageMeta({
  title: "Kemaskini Maklumat Jawatan",
});

const route = useRoute();
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

// Breadcrumb
const breadcrumb = [
  { label: 'Laman Utama', to: '/' },
  { label: 'Modul BF-PA', to: '/BF-PA' },
  { label: 'Konfigurasi', to: '/BF-PA/KF' },
  { label: 'Maklumat Jawatan', to: '/BF-PA/KF/KJ' },
  { label: 'Kemaskini', to: null }
];

// Form data with original values for change tracking
const originalData = ref({});
const formData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  maklumatJawatan: [
    {
      namaJawatan: "Ketua Penolong Amil",
      kodSingkatan: "KPA",
      status: "AKTIF",
      tarikhKuatkuasa: "01-01-2024"
    },
    {
      namaJawatan: "Penolong Ketua Amil",
      kodSingkatan: "PKA",
      status: "AKTIF",
      tarikhKuatkuasa: "01-01-2024"
    },
    {
      namaJawatan: "Penolong Amil Eksekutif",
      kodSingkatan: "PAE",
      status: "AKTIF",
      tarikhKuatkuasa: "01-01-2024"
    }
  ],
  maklumatPegawai: {
    diciptaOleh: "Ahmad bin Ali",
    tarikhCipta: "2024-01-15",
    dikemaskiniBoleh: "Siti binti Ahmad",
    tarikhKemaskini: "2024-02-01",
    disahkanOleh: "Hasan bin Omar",
    tarikhPengesahan: "2024-02-03",
    diluluskanOleh: "Fatimah binti Ibrahim",
    tarikhKelulusan: "2024-02-05"
  }
});

// Category context data
const categoryData = ref({
  kodSingkatan: "PAF",
  status: "Aktif"
});

// Store original data for change tracking
originalData.value = JSON.parse(JSON.stringify(formData.value));

// Confirmation modal data
const confirmationData = ref({
  namaPenyokong: "Eksekutif User (Mock)",
  tarikhSokongan: new Date().toISOString().split('T')[0],
});

// Methods for managing table data
const tambahJawatan = () => {
  formData.value.maklumatJawatan.push({
    namaJawatan: '',
    kodSingkatan: '',
    status: 'TIDAK AKTIF', // Default for new rows
    tarikhKuatkuasa: '' // Will be set by Ketua Divisyen upon approval
  });
  
  generateChangeLog();
};

const hapusJawatan = (index) => {
  formData.value.maklumatJawatan.splice(index, 1);
  generateChangeLog();
};

// Check if a row is newly added
const isNewRow = (jawatan) => {
  return !jawatan.tarikhKuatkuasa || jawatan.tarikhKuatkuasa === '';
};

// Generate change log
const changeLog = ref([]);

const generateChangeLog = () => {
  const changes = [];
  const originalJawatan = originalData.value.maklumatJawatan || [];
  const currentJawatan = formData.value.maklumatJawatan || [];

  // Check for additions
  currentJawatan.forEach((current, index) => {
    if (!originalJawatan[index]) {
      changes.push({
        type: 'added',
        section: 'Jawatan dalam Kategori',
        description: `Ditambah: ${current.namaJawatan}`,
        oldValue: null,
        newValue: `${current.namaJawatan} (${current.kodSingkatan})`
      });
    }
  });

  // Check for modifications
  originalJawatan.forEach((original, index) => {
    const current = currentJawatan[index];
    if (current) {
      if (original.namaJawatan !== current.namaJawatan) {
        changes.push({
          type: 'modified',
          section: 'Jawatan dalam Kategori',
          description: `Diubah: Nama Jawatan baris ${index + 1}`,
          oldValue: original.namaJawatan,
          newValue: current.namaJawatan
        });
      }
      
      if (original.kodSingkatan !== current.kodSingkatan) {
        changes.push({
          type: 'modified',
          section: 'Jawatan dalam Kategori',
          description: `Diubah: Kod Singkatan baris ${index + 1}`,
          oldValue: original.kodSingkatan,
          newValue: current.kodSingkatan
        });
      }
      
      if (original.status !== current.status) {
        changes.push({
          type: 'modified',
          section: 'Jawatan dalam Kategori',
          description: `Diubah: Status baris ${index + 1}`,
          oldValue: original.status,
          newValue: current.status
        });
      }
    }
  });

  // Check for removals
  originalJawatan.forEach((original, index) => {
    if (!currentJawatan[index]) {
      changes.push({
        type: 'removed',
        section: 'Jawatan dalam Kategori',
        description: `Dipadamkan: ${original.namaJawatan}`,
        oldValue: `${original.namaJawatan} (${original.kodSingkatan})`,
        newValue: null
      });
    }
  });

  changeLog.value = changes;
  return changes;
};

// Helper functions
const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Tidak Aktif': 'danger',
    'Menunggu Pengesahan': 'warning',
    'Menunggu Kelulusan': 'info',
  };
  return variants[status] || 'disabled';
};

const handleConfirmationSubmit = async (confirmationFormData) => {
  isSubmitting.value = true;
  
  try {
    const changeLogData = generateChangeLog();
    
    // Log complete data for backend
    const updateData = {
      categoryId: route.params.id,
      kategoriPenolongAmil: formData.value.kategoriPenolongAmil,
      maklumatJawatan: formData.value.maklumatJawatan,
      changeLog: changeLogData,
      sokonganEksekutif: {
        ulasan: confirmationFormData.ulasanSokongan,
        namaPenyokong: confirmationData.value.namaPenyokong,
        tarikhSokongan: confirmationData.value.tarikhSokongan,
      },
      updatedBy: "Eksekutif User",
      updatedAt: new Date().toISOString(),
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    toast.success("Maklumat jawatan berjaya dikemaskini dan disokong");
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    // Error updating positions
    toast.error("Ralat semasa menyimpan perubahan");
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};

// Load data on mount
onMounted(async () => {
  const categoryId = route.params.id;
  
  try {
    // Simulate API call to get category data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock original data - what was in system before changes
    const loadedData = {
      kategoriPenolongAmil: "Penolong Amil Fitrah",
      maklumatJawatan: [
        {
          namaJawatan: "Ketua Penolong Amil",
          kodSingkatan: "KPA",
          status: "AKTIF",
          tarikhKuatkuasa: "01-01-2024"
        },
        {
          namaJawatan: "Penolong Ketua Amil",
          kodSingkatan: "PKA", 
          status: "AKTIF",
          tarikhKuatkuasa: "01-01-2024"
        }
        // Note: Penolong Amil Eksekutif will be added as new item
      ],
      maklumatPegawai: {
        diciptaOleh: "Ahmad bin Ali",
        tarikhCipta: "2024-01-15",
        dikemaskiniBoleh: "Siti binti Ahmad",
        tarikhKemaskini: "2024-02-01",
        disahkanOleh: "Hasan bin Omar",
        tarikhPengesahan: "2024-02-03",
        diluluskanOleh: "Fatimah binti Ibrahim",
        tarikhKelulusan: "2024-02-05"
      }
    };
    
    // Store original data for comparison
    originalData.value = JSON.parse(JSON.stringify(loadedData));
    
    // Current data with changes applied - simulating user adding new position
    formData.value = {
      kategoriPenolongAmil: "Penolong Amil Fitrah",
      maklumatJawatan: [
        {
          namaJawatan: "Ketua Penolong Amil",
          kodSingkatan: "KPA",
          status: "AKTIF",
          tarikhKuatkuasa: "01-01-2024"
        },
        {
          namaJawatan: "Penolong Ketua Amil",
          kodSingkatan: "PKA",
          status: "AKTIF", 
          tarikhKuatkuasa: "01-01-2024"
        },
        {
          namaJawatan: "Penolong Amil Eksekutif", // New addition
          kodSingkatan: "PAE",
          status: "TIDAK AKTIF", // New rows default to TIDAK AKTIF
          tarikhKuatkuasa: "" // Will be set upon approval
        }
      ],
      maklumatPegawai: {
        diciptaOleh: "Ahmad bin Ali",
        tarikhCipta: "2024-01-15",
        dikemaskiniBoleh: "Siti binti Ahmad",
        tarikhKemaskini: "2024-02-01",
        disahkanOleh: "Hasan bin Omar",
        tarikhPengesahan: "2024-02-03",
        diluluskanOleh: "Fatimah binti Ibrahim",
        tarikhKelulusan: "2024-02-05"
      }
    };
    
    // Generate initial change log
    generateChangeLog();
  } catch (error) {
    // Error loading position data
    toast.error('Ralat semasa memuatkan data jawatan');
  }
});
</script> 