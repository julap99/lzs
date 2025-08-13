<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kiraan Jumlah Elaun Mengikut Penolong Amil</h2>
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaAktiviti"
                label="Nama Aktiviti"
                readonly
              />
              <FormKit
                type="text"
                name="jenisAktiviti"
                label="Jenis Aktiviti"
                readonly
              />
              <FormKit
                type="text"
                name="tarikhAktiviti"
                label="Tarikh Aktiviti"
                readonly
              />
              <FormKit
                type="text"
                name="lokasiAktiviti"
                label="Lokasi Aktiviti"
                readonly
              />
              <FormKit
                type="text"
                name="kehadiran"
                label="Kehadiran"
                readonly
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
                { key: 'idPenolong', label: 'ID PA' },
                { key: 'nama', label: 'Nama Penolong Amil' },
                { key: 'jawatan', label: 'Jawatan' },
                { key: 'kategori', label: 'Kategori' },
                { key: 'statusKehadiran', label: 'Status Kehadiran' },
                { key: 'elaun', label: 'Elaun (RM)' }
              ]"
              :options="{
                variant: 'default',
                hover: true,
              }"
            >
              <template v-slot:idPenolong="data">
                {{ data.text }}
              </template>
              <template v-slot:nama="data">
                {{ data.text }}
              </template>
              <template v-slot:jawatan="data">
                {{ data.text }}
              </template>
              <template v-slot:kategori="data">
                {{ data.text }}
              </template>
              <template v-slot:statusKehadiran="data">
                <rs-badge
                  :variant="data.text === 'Hadir' ? 'success' : 'danger'"
                  size="sm"
                >
                  {{ data.text }}
                </rs-badge>
              </template>
              <template v-slot:elaun="data">
                <span class="font-medium">{{ data.text }}</span>
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
                readonly
              />
              <FormKit
                type="text"
                name="jumlahElaun"
                label="Jumlah Elaun (RM)"
                readonly
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="navigateTo(`/BF-PA/PE/MP/${activityId}`)"
            >
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Hantar
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Hantar ke Pelulus"
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
            Adakah anda pasti untuk menghantar pembayaran elaun bagi {{ formData.namaAktiviti }} ini untuk sokongan JPPA?
          </p>
          <p class="text-gray-600">
            Semakan ini akan dihantar kepada Eksekutif JPPA untuk sokongan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showSuccessModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmSubmit">
            Ya, Hantar
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
  title: "Kiraan Jumlah Elaun Mengikut Penolong Amil",
  description: "Semak dan kira elaun penolong amil berdasarkan kehadiran aktiviti",
});

const route = useRoute();
const activityId = route.params.id;
const toast = useToast();
const showSuccessModal = ref(false);
const tableKey = ref(0);

const breadcrumb = ref([
  {
    name: "Pengurusan Elaun",
    type: "link",
    path: "/BF-PA/PE/MP",
  },
  {
    name: "Maklumat Aktiviti",
    type: "link",
    path: `/BF-PA/PE/MP/${activityId}`,
  },
  {
    name: "Kira Jumlah Elaun",
    type: "current",
    path: `/BF-PA/PE/MP/02/${activityId}`,
  },
]);

// Mock activity data from PE/MP/01
const aktivitiData = {
  "MP2024-002": {
    namaAktiviti: "Latihan Pengurusan Zakat dan Fitrah",
    jenisAktiviti: "Latihan",
    tarikhAktiviti: "20/03/2024",
    lokasiAktiviti: "Dewan Latihan LZS, Kompleks Zakat Selangor",
    kehadiran: "4/5",
    status: "Belum Dihantar",
    kadarElaun: "50.00",
    jumlahElaun: "200.00",
    senaraiPenolong: [
      {
        idPenolong: "PA001",
        nama: "Ahmad bin Abdullah",
        jawatan: "Penolong Amil",
        kategori: "Fitrah",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      },
      {
        idPenolong: "PA002",
        nama: "Siti binti Mohamed",
        jawatan: "Penolong Amil",
        kategori: "Fitrah",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      },
      {
        idPenolong: "PA003",
        nama: "Mohamed bin Ali",
        jawatan: "Penolong Amil",
        kategori: "Fitrah",
        statusKehadiran: "Tidak Hadir",
        elaun: "0.00"
      },
      {
        idPenolong: "PA004",
        nama: "Fatimah binti Hassan",
        jawatan: "Penolong Amil",
        kategori: "Fitrah",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      },
      {
        idPenolong: "PA005",
        nama: "Abdullah bin Omar",
        jawatan: "Penolong Amil",
        kategori: "Fitrah",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      }
    ]
  },
  "MP2024-003": {
    namaAktiviti: "Program Khidmat Masyarakat Ramadan",
    jenisAktiviti: "Program",
    tarikhAktiviti: "25/03/2024",
    lokasiAktiviti: "Masjid Al-Hidayah, Shah Alam",
    kehadiran: "3/3",
    status: "Lulus",
    kadarElaun: "75.00",
    jumlahElaun: "225.00",
    senaraiPenolong: [
      {
        idPenolong: "PA006",
        nama: "Zainab binti Ibrahim",
        jawatan: "Penolong Amil",
        kategori: "Komuniti",
        statusKehadiran: "Hadir",
        elaun: "75.00"
      },
      {
        idPenolong: "PA007",
        nama: "Ibrahim bin Ahmad",
        jawatan: "Penolong Amil",
        kategori: "Komuniti",
        statusKehadiran: "Hadir",
        elaun: "75.00"
      },
      {
        idPenolong: "PA008",
        nama: "Aminah binti Mohamed",
        jawatan: "Penolong Amil",
        kategori: "Komuniti",
        statusKehadiran: "Hadir",
        elaun: "75.00"
      }
    ]
  },
  "MP2024-005": {
    namaAktiviti: "Latihan Sistem e-Zakat",
    jenisAktiviti: "Latihan",
    tarikhAktiviti: "02/04/2024",
    lokasiAktiviti: "Bilik Latihan IT, Pejabat Zakat Petaling Jaya",
    kehadiran: "2/2",
    status: "Belum Dihantar",
    kadarElaun: "60.00",
    jumlahElaun: "120.00",
    senaraiPenolong: [
      {
        idPenolong: "PA009",
        nama: "Hassan bin Omar",
        jawatan: "Penolong Amil",
        kategori: "Kariah",
        statusKehadiran: "Hadir",
        elaun: "60.00"
      },
      {
        idPenolong: "PA010",
        nama: "Mariam binti Ali",
        jawatan: "Penolong Amil",
        kategori: "Kariah",
        statusKehadiran: "Hadir",
        elaun: "60.00"
      }
    ]
  },
  "MP2024-006": {
    namaAktiviti: "Program Bantuan Asnaf Bulanan",
    jenisAktiviti: "Program",
    tarikhAktiviti: "05/04/2024",
    lokasiAktiviti: "Dewan Serbaguna Masjid Kg Delek",
    kehadiran: "45/50",
    status: "Di Tolak",
    kadarElaun: "50.00",
    jumlahElaun: "2250.00",
    senaraiPenolong: [
      {
        idPenolong: "PA011",
        nama: "Omar bin Hassan",
        jawatan: "Penolong Amil",
        kategori: "Asnaf",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      },
      {
        idPenolong: "PA012",
        nama: "Fatimah binti Ahmad",
        jawatan: "Penolong Amil",
        kategori: "Asnaf",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      },
      {
        idPenolong: "PA013",
        nama: "Ahmad bin Omar",
        jawatan: "Penolong Amil",
        kategori: "Asnaf",
        statusKehadiran: "Tidak Hadir",
        elaun: "0.00"
      },
      {
        idPenolong: "PA014",
        nama: "Siti binti Hassan",
        jawatan: "Penolong Amil",
        kategori: "Asnaf",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      },
      {
        idPenolong: "PA015",
        nama: "Mohamed bin Ali",
        jawatan: "Penolong Amil",
        kategori: "Asnaf",
        statusKehadiran: "Hadir",
        elaun: "50.00"
      }
    ]
  },
  "MP2024-007": {
    namaAktiviti: "Mesyuarat Perancangan Aktiviti Q2",
    jenisAktiviti: "Mesyuarat",
    tarikhAktiviti: "10/04/2024",
    lokasiAktiviti: "Dewan Mesyuarat JPPA, Pejabat Zakat Kajang",
    kehadiran: "2/2",
    status: "Lulus",
    kadarElaun: "40.00",
    jumlahElaun: "80.00",
    senaraiPenolong: [
      {
        idPenolong: "PA011",
        nama: "Omar bin Hassan",
        jawatan: "Penolong Amil",
        kategori: "Kariah",
        statusKehadiran: "Hadir",
        elaun: "40.00"
      },
      {
        idPenolong: "PA012",
        nama: "Khadijah binti Abdullah",
        jawatan: "Penolong Amil",
        kategori: "Kariah",
        statusKehadiran: "Hadir",
        elaun: "40.00"
      }
    ]
  },
  "MP2024-008": {
    namaAktiviti: "Latihan Pengurusan Aduan",
    jenisAktiviti: "Latihan",
    tarikhAktiviti: "12/04/2024",
    lokasiAktiviti: "Bilik Latihan, Pejabat Zakat Gombak",
    kehadiran: "2/2",
    status: "Belum Dihantar",
    kadarElaun: "55.00",
    jumlahElaun: "110.00",
    senaraiPenolong: [
      {
        idPenolong: "PA013",
        nama: "Yusuf bin Mohamed",
        jawatan: "Penolong Amil",
        kategori: "Padi",
        statusKehadiran: "Hadir",
        elaun: "55.00"
      },
      {
        idPenolong: "PA014",
        nama: "Aisha binti Hassan",
        jawatan: "Penolong Amil",
        kategori: "Padi",
        statusKehadiran: "Hadir",
        elaun: "55.00"
      }
    ]
  }
};

const formData = ref({
  namaAktiviti: "",
  jenisAktiviti: "",
  tarikhAktiviti: "",
  lokasiAktiviti: "",
  kehadiran: "",
  status: "",
  kadarElaun: "0.00",
  jumlahElaun: "0.00",
  senaraiPenolong: []
});

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Kelulusan": "warning",
    "Lulus": "success",
    "Di Tolak": "danger",
    "Ditolak": "danger",
    "Kembali untuk Pembetulan": "warning",
    "Dalam Pemerhatian": "warning",
    "Belum Dihantar": "disabled", // Use disabled for proper grey color
  };
  return variants[status] || "disabled"; // Use disabled for proper grey color
};

const calculateTotalAllowance = () => {
  const hadirCount = formData.value.senaraiPenolong.filter(
    penolong => penolong.statusKehadiran === "Hadir"
  ).length;
  const kadar = parseFloat(formData.value.kadarElaun);
  formData.value.jumlahElaun = (hadirCount * kadar).toFixed(2);
};

onMounted(async () => {
  const activity = aktivitiData[activityId];
  
  if (activity) {
    formData.value = {
      namaAktiviti: activity.namaAktiviti,
      jenisAktiviti: activity.jenisAktiviti,
      tarikhAktiviti: activity.tarikhAktiviti,
      lokasiAktiviti: activity.lokasiAktiviti,
      kehadiran: activity.kehadiran,
      status: activity.status,
      kadarElaun: activity.kadarElaun,
      jumlahElaun: activity.jumlahElaun,
      senaraiPenolong: activity.senaraiPenolong
    };
    
    // Calculate total allowance
    calculateTotalAllowance();
  } else {
    toast.error("Aktiviti tidak dijumpai");
    navigateTo("/BF-PA/PE/MP/01");
  }
});

const handleSubmit = async (formData) => {
  try {
    // Show confirmation modal
    showSuccessModal.value = true;
  } catch (error) {
    toast.error("Ralat semasa menghantar kiraan elaun");
    console.error("Error submitting allowance calculation:", error);
  }
};

const confirmSubmit = async () => {
  try {
    // TODO: In a real implementation, this would update the activity status
    // For now, we'll just show a success message
    console.log("Submitting allowance calculation:", formData.value);

    // Close modal
    showSuccessModal.value = false;

    // Show success toast
    toast.success("Kiraan elaun telah berjaya dihantar kepada Eksekutif JPPA");

    // Navigate back to activity detail page
    navigateTo(`/BF-PA/PE/MP/${activityId}`);
  } catch (error) {
    toast.error("Ralat semasa menghantar kiraan elaun");
    console.error("Error submitting allowance calculation:", error);
  }
};
</script> 