<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Kemaskini Profil (EOAD)
          </h2>
          <div class="flex items-center space-x-2">
            <rs-badge variant="warning">Menunggu Kelulusan</rs-badge>
            <span class="text-sm text-gray-500"
              >Dikemaskini: 15 Jun 2023 14:30</span
            >
          </div>
        </div>
      </template>

      <template #body>
        <!-- Current Profile Section -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4 border-b pb-2">
            Maklumat Profil Semasa
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >No. Kad Pengenalan</label
              >
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                770319035991
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nama</label
              >
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                Adnan bin Abu
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tarikh Lahir</label
              >
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                19/03/1977
              </div>
            </div>
            <div class="mb-4 md:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Alamat</label
              >
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                NO 1, JALAN BUKIT INDAH 1, TAMAN BUKIT INDAH, 81200 JOHOR BAHRU,
                JOHOR
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Changes Section -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h3 class="text-lg font-medium">Perubahan Dicadangkan</h3>
            <div class="text-sm text-gray-500">
              Dikemaskini oleh: adnan.abu@email.com
            </div>
          </div>

          <div class="space-y-6">
            <!-- Change Item 1 -->
            <div
              class="p-4 rounded-lg border bg-yellow-50 border-l-4 border-yellow-300"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">Nama</h4>
                <span
                  class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >UA</span
                >
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1"
                    >Nilai Semasa</label
                  >
                  <div class="p-2 bg-gray-50 rounded text-sm">
                    Adnan bin Abu
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1"
                    >Nilai Baru</label
                  >
                  <div
                    class="p-2 bg-green-50 rounded text-sm font-medium text-green-800 border border-green-100"
                  >
                    Haji Adnan bin Abu
                    <Icon
                      name="heroicons:arrow-long-right-20-solid"
                      class="ml-1 text-green-500 inline"
                    />
                  </div>
                </div>
              </div>

              <div class="text-xs text-gray-500 mt-2">
                <span class="font-medium">Sebab:</span> Menambah gelaran Haji
                setelah menunaikan haji
              </div>
            </div>

            <!-- Change Item 2 -->
            <div
              class="p-4 rounded-lg border bg-yellow-50 border-l-4 border-yellow-300"
            >
              <div class="flex justify-between items-start mb-2">
                <h4 class="font-medium text-gray-900">Pendapatan</h4>
                <span
                  class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >AR</span
                >
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1"
                    >Nilai Semasa</label
                  >
                  <div class="p-2 bg-gray-50 rounded text-sm">RM 300</div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1"
                    >Nilai Baru</label
                  >
                  <div
                    class="p-2 bg-green-50 rounded text-sm font-medium text-green-800 border border-green-100"
                  >
                    RM 200
                    <Icon
                      name="heroicons:arrow-long-right-20-solid"
                      class="ml-1 text-green-500 inline"
                    />
                  </div>
                </div>
              </div>

              <div class="text-xs text-gray-500 mt-2">
                <span class="font-medium">Sebab:</span> Perubahan pendapatan
              </div>
            </div>
          </div>
        </div>

        <!-- Approval Actions with Remarks -->
        <div class="mt-8 border-t pt-6">
          <FormKit type="form" @submit="handleApproval" :actions="false">
            <FormKit
              type="textarea"
              name="remarks"
              label="Catatan (Pilihan)"
              placeholder="Sila beri catatan jika perlu"
              rows="2"
            />

            <div class="mt-6 flex justify-end gap-4">
              <rs-button
                type="button"
                variant="danger-outline"
                @click="rejectChanges"
                :disabled="processing"
              >
                Tolak
              </rs-button>
              <rs-button
                type="submit"
                variant="primary"
                :disabled="processing"
                @click="handleApproval"
              >
                <template v-if="processing">
                  <Icon name="eos-icons:loading" class="mr-1" size="1rem" />
                  Memproses...
                </template>
                <template v-else> Luluskan </template>
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const breadcrumb = ref([
  { name: "Laman Utama", type: "link", path: "/BF-PRF/AS/UP/04" },
  { name: "Kelulusan", type: "link", path: "/BF-PRF/AS/UP/04" },
  { name: "Profil", type: "current", path: "/BF-PRF/AS/UP/04" },
]);

const processing = ref(false);

const handleApproval = async () => {

  toast.success("Kemaskini profil berjaya");

  navigateTo(`/BF-PRF/AS/UP/05`);
};

const rejectChanges = async () => {


  toast.error("Kemaskini profil ditolak");
};
</script>

<style scoped>
.change-highlight {
  background-color: #fffbeb;
  border-left: 4px solid #f59e0b;
}
</style>
