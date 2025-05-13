<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima Notifikasi Penerimaan Bantuan (Pemohon / Asnaf)
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Notifikasi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ notifikasiDetails.rujukan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh</p>
              <p class="font-medium">{{ formattedCurrentDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status</p>
              <p class="font-medium text-green-600">SEDIA UNTUK DITUNTUT</p>
            </div>
          </div>
        </div>

        <!-- Email Preview Section -->
        <div class="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div class="bg-green-700 p-4 text-white text-center">
            <h3 class="text-lg font-medium">NOTIFIKASI PENERIMAAN BANTUAN</h3>
          </div>

          <div class="p-6">
            <p>Assalamualaikum dan Salam Sejahtera,</p>

            <p class="font-medium">Tuan/Puan {{ pemohonDetails.nama }},</p>

            <p>
              Dengan sukacitanya kami ingin memaklumkan bahawa
              <span class="font-medium">permohonan bantuan kewangan</span> anda telah
              <span class="font-medium">DILULUSKAN</span> dan kini
              <span class="font-medium">SEDIA UNTUK DITUNTUT</span>.
            </p>

            <!-- Applicant Info -->
            <div class="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-700">
              <h4 class="text-base font-medium mb-2">Maklumat Pemohon:</h4>
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <p class="text-sm text-gray-600">Nombor Kad Pengenalan</p>
                  <p class="font-medium">{{ pemohonDetails.noKP }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Nama</p>
                  <p class="font-medium">{{ pemohonDetails.nama }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Rujukan Permohonan</p>
                  <p class="font-medium">{{ notifikasiDetails.rujukan }}</p>
                </div>
              </div>
            </div>

            <!-- Assistance Details -->
            <div class="my-4 p-4 bg-green-50 rounded-lg">
              <h4 class="text-base font-medium mb-2">Maklumat Bantuan:</h4>
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <p class="text-sm text-gray-600">Jenis Bantuan</p>
                  <p class="font-medium">{{ bantuanDetails.jenis }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Jumlah Bantuan</p>
                  <p class="font-medium text-xl text-green-700">
                    RM {{ bantuanDetails.jumlah }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Lokasi Pengambilan</p>
                  <p class="font-medium">{{ bantuanDetails.lokasi }}</p>
                </div>
              </div>
            </div>

            <!-- Steps -->
            <div class="my-4">
              <h4 class="text-base font-medium mb-2">
                Langkah-langkah Untuk Menuntut Bantuan:
              </h4>

              <div class="ml-2 mb-2">
                <div class="flex items-start gap-2">
                  <div
                    class="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold"
                  >
                    1
                  </div>
                  <p>Hadir ke cawangan yang dinyatakan di atas.</p>
                </div>
              </div>

              <div class="ml-2 mb-2">
                <div class="flex items-start gap-2">
                  <div
                    class="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold"
                  >
                    2
                  </div>
                  <p>Bawa kad pengenalan asal dan salinan.</p>
                </div>
              </div>

              <div class="ml-2 mb-2">
                <div class="flex items-start gap-2">
                  <div
                    class="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold"
                  >
                    3
                  </div>
                  <p>
                    Tunjukkan e-mel ini atau nombor rujukan permohonan kepada pegawai
                    kaunter.
                  </p>
                </div>
              </div>

              <div class="ml-2 mb-2">
                <div class="flex items-start gap-2">
                  <div
                    class="flex-shrink-0 w-6 h-6 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold"
                  >
                    4
                  </div>
                  <p>Tandatangan borang pengesahan penerimaan bantuan di kaunter.</p>
                </div>
              </div>
            </div>

            <!-- Important Note -->
            <div class="my-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <p class="font-medium">NOTA PENTING:</p>
              <p>
                Bantuan ini boleh dituntut dalam tempoh
                <span class="font-medium">30 hari</span> dari tarikh e-mel ini. Sila
                tuntut bantuan anda sebelum
                <span class="font-medium">{{ tamatTempoh }}</span
                >.
              </p>
            </div>

            <div class="text-center my-6">
              <rs-button variant="primary">SEMAK STATUS BANTUAN</rs-button>
            </div>

            <p>
              Sila hubungi talian bantuan kami di
              <span class="font-medium">03-8000 8000</span> atau e-mel
              <span class="font-medium">bantuan@nas.gov.my</span> jika anda mempunyai
              sebarang pertanyaan.
            </p>

            <p class="mt-4">Terima kasih.</p>

            <p>
              Yang benar,<br />
              <span class="font-medium">Unit Bantuan Kewangan</span><br />
              Jabatan Bantuan Sosial<br />
              Sistem Nasional Agihan Sosial (NAS)
            </p>
          </div>

          <div class="bg-gray-100 p-4 text-sm text-gray-600 text-center">
            <p>
              E-mel ini dijana secara automatik oleh sistem NAS. Sila jangan balas e-mel
              ini.
            </p>
            <p>© 2025 Sistem Nasional Agihan Sosial (NAS). Hak Cipta Terpelihara.</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <div>
            <rs-button variant="primary" class="ml-auto" @click="navigateNext">
              Seterusnya
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Terima Notifikasi Penerimaan Bantuan",
});

const route = useRoute();
const router = useRouter();
const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/pengurusan-bantuan",
  },
  {
    name: "Terima Notifikasi Penerimaan Bantuan",
    type: "current",
    path: "/pengurusan-bantuan/notifikasi-penerimaan",
  },
]);

// Applicant details
const pemohonDetails = ref({
  noKP: "850213-14-5561",
  nama: "Ahmad bin Hassan",
  email: "ahmad.hassan@email.com",
  telefon: "012-3456789",
});

// Aid details
const bantuanDetails = ref({
  jenis: "Bantuan Kecemasan Banjir",
  jumlah: "1,000.00",
  lokasi:
    "Cawangan NAS Kuala Lumpur, Tingkat 2, Menara NAS, Jalan Sultan Ismail, 50250 Kuala Lumpur",
});

// Notification details
const notifikasiDetails = ref({
  rujukan: "BAN-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentDate = computed(() => {
  return new Date().toISOString().slice(0, 10);
});

const currentTime = computed(() => {
  return new Date().toTimeString().slice(0, 5);
});

const formattedCurrentDate = computed(() => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("ms-MY", options);
});

// Calculate expiry date (30 days from now)
const tamatTempoh = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("ms-MY", options);
});

const navigateBack = () => {
  router.back();
};

const navigateNext = () => {
  // Navigate to the next page
  router.push(`/BF-PTPC/MT/TT/02`);
};
</script>
