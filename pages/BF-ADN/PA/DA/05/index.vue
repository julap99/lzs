<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Notifikasi Penerimaan Aduan</h2>
        </div>
      </template>

      <template #body>
        <!-- Success Message -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon
              name="mdi:check-circle"
              class="text-green-500"
              size="1.5rem"
            />
            <p class="text-green-600 font-medium">
              Aduan anda telah diterima. Nombor Rujukan:
              {{ complaintDetails.referenceNumber }}
            </p>
          </div>
          <p class="text-gray-600">
            Penerimaan akan dihantar melalui emel yang didaftarkan.
          </p>
        </div>

        <!-- Complaint Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Notifikasi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nombor Rujukan Aduan</p>
              <p class="font-medium">{{ complaintDetails.referenceNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Masa & Tarikh Aduan</p>
              <p class="font-medium">
                {{ formatDateTime(complaintDetails.submissionDateTime) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Nama Pengguna</p>
              <p class="font-medium">{{ complaintDetails.userName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Emel Pengguna</p>
              <p class="font-medium">{{ complaintDetails.userEmail }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status Aduan</p>
              <p class="font-medium text-green-600">Diterima</p>
            </div>
          </div>
        </div>

        <!-- Email Preview Section -->
        <div class="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <div class="bg-green-700 p-4 text-white text-center">
            <h3 class="text-lg font-medium">NOTIFIKASI PENERIMAAN ADUAN</h3>
          </div>

          <div class="p-6">
            <p>Assalamualaikum dan Salam Sejahtera,</p>

            <p class="font-medium">
              Tuan/Puan {{ complaintDetails.userName }},
            </p>

            <p>
              Dengan sukacitanya kami ingin memaklumkan bahawa aduan anda telah
              <span class="font-medium">DITERIMA</span> dan sedang diproses.
            </p>

            <!-- Complaint Info -->
            <div
              class="my-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-700"
            >
              <h4 class="text-base font-medium mb-2">Maklumat Aduan:</h4>
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <p class="text-sm text-gray-600">Nombor Rujukan</p>
                  <p class="font-medium">
                    {{ complaintDetails.referenceNumber }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Tarikh & Masa</p>
                  <p class="font-medium">
                    {{ formatDateTime(complaintDetails.submissionDateTime) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Status</p>
                  <p class="font-medium text-green-600">Diterima</p>
                </div>
              </div>
            </div>

            <p>
              Kami akan memproses aduan anda dan akan menghubungi anda sekiranya
              memerlukan maklumat tambahan.
            </p>

            <p class="mt-4">Terima kasih kerana menghubungi kami.</p>

            <p class="mt-4">
              Salam hormat,<br />
              Sistem Nasional Agihan Sosial (NAS)
            </p>
          </div>

          <div class="bg-gray-100 p-4 text-sm text-gray-600 text-center">
            <p>
              E-mel ini dijana secara automatik oleh sistem NAS. Sila jangan
              balas e-mel ini.
            </p>
            <p>
              © 2025 Sistem Nasional Agihan Sosial (NAS). Hak Cipta Terpelihara.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <rs-button variant="primary" @click="navigateNext">
            Selesai
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Notifikasi Penerimaan Aduan",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/DA/01",
  },
  {
    name: "Notifikasi Penerimaan Aduan",
    type: "current",
    path: "/BF-ADN/PA/DA/05",
  },
]);

// Mock data - In real application, this would come from props or API
const complaintDetails = ref({
  referenceNumber: `NAS-ADUAN-${new Date().getFullYear()}-${Math.floor(
    Math.random() * 10000
  )
    .toString()
    .padStart(4, "0")}`,
  submissionDateTime: new Date().toISOString(),
  userName: "Ahmad bin Abdullah",
  userEmail: "ahmad.abdullah@email.com",
});

const formatDateTime = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const navigateNext = () => {
  // Navigate to the next page or dashboard
  router.push("/BF-ADN/PA/DA/01");
};
</script>
