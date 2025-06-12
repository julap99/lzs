<template>
  <div>
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Cari Pemohon</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSearch"
          v-model="searchForm"
        >
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <FormKit
              type="text"
              name="icNumber"
              label="Nombor IC Pemohon"
              placeholder="Masukkan nombor IC"
              validation="required|length:12"
              :validation-messages="{
                required: 'Nombor IC diperlukan',
                length: 'Nombor IC mesti 12 digit',
              }"
            />
            <FormKit
              type="text"
              name="applicantName"
              label="Nama Pemohon"
              :disabled="true"
            />
            <FormKit
              type="text"
              name="profileStatus"
              label="Status Profil"
              :disabled="true"
            />
          </div>

          <div class="flex justify-end gap-2">
            <rs-button variant="primary-outline" @click="resetForm">
              Reset
            </rs-button>
            <rs-button
              type="submit"
              :loading="isSearching"
              @click="handleSearch"
            >
              Cari IC
            </rs-button>
          </div>
        </FormKit>

        <!-- Applicant Info Card -->
        <rs-card v-if="applicantInfo" class="mt-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Pemohon</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">No Kad Pengenalan Pemohon:</span>
                <span class="ml-2">{{ applicantInfo.icNumber }}</span>
              </div>
              <div>
                <span class="font-medium">Nama Pemohon:</span>
                <span class="ml-2">{{ applicantInfo.name }}</span>
              </div>
              <div>
                <span class="font-medium">Status Asnaf / Kelayakan:</span>
                <span class="ml-2">{{ applicantInfo.asnafStatus }}</span>
              </div>
              <div>
                <span class="font-medium">Kategori Asnaf:</span>
                <span class="ml-2">{{ applicantInfo.asnafCategory }}</span>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <rs-button @click="navigateToListing">
                Lihat Senarai Bantuan
              </rs-button>
            </div>
          </template>
        </rs-card>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Cari Pemohon",
});

interface ApplicantInfo {
  icNumber: string;
  name: string;
  asnafStatus: string;
  asnafCategory: string;
}

const router = useRouter();

// Form and state management
const searchForm = ref({
  icNumber: "",
  applicantName: "",
  profileStatus: "",
});

const isSearching = ref(false);
const applicantInfo = ref<ApplicantInfo | null>(null);

// Form handlers
const handleSearch = async () => {
  try {
    isSearching.value = true;

    // TODO: Implement API call to search applicant
    // Mock data for now
    applicantInfo.value = {
      icNumber: searchForm.value.icNumber,
      name: "Ahmad bin Abdullah",
      asnafStatus: "Aktif",
      asnafCategory: "Fakir",
    };
  } catch (error) {
    console.error("Error searching applicant:", error);
  } finally {
    isSearching.value = false;
  }
};

const resetForm = () => {
  searchForm.value = {
    icNumber: "",
    applicantName: "",
    profileStatus: "",
  };
  applicantInfo.value = null;
};

const navigateToListing = () => {
  if (applicantInfo.value) {
    router.push({
      path: '/BF-TNI/pengeluaran-tunai-kaunter/permohonan/listing',
      query: { icNumber: applicantInfo.value.icNumber }
    });
  }
};
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 