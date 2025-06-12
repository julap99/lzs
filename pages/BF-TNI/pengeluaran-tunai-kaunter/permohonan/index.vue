<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <Icon name="heroicons:document-text" class="mr-2 text-primary" />
            <h2 class="text-xl font-semibold">Permohonan Pengeluaran Tunai</h2>
          </div>
        </div>
      </template>

      <template #body>
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-4">
            Sila masukkan nombor kad pengenalan pemohon untuk melihat maklumat
            dan senarai bantuan yang layak
          </p>
        </div>

        <!-- Search Form -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex items-center">
              <Icon
                name="heroicons:magnifying-glass"
                class="mr-2 text-primary"
              />
              <h3 class="text-lg font-semibold">Cari Pemohon</h3>
            </div>
          </template>

          <template #body>
            <FormKit
              type="form"
              :actions="false"
              @submit="handleSearch"
              v-model="searchForm"
            >
              <div class="">
                <FormKit
                  type="text"
                  name="icNumber"
                  label="Nombor IC Pemohon"
                  placeholder="Masukkan nombor IC"
                  validation="required|length:12|matches:/^[0-9]{12}$/"
                  :validation-messages="{
                    required: 'Nombor IC diperlukan',
                    length: 'Nombor IC mesti 12 digit',
                    matches: 'Nombor IC mesti mengandungi digit sahaja',
                  }"
                  :validation-visibility="'live'"
                  help="Masukkan nombor kad pengenalan tanpa tanda sengkang (-)"
                />
              </div>

              <div class="flex justify-end gap-2 mt-6">
                <rs-button
                  variant="primary-outline"
                  @click="resetForm"
                  :disabled="isSearching"
                >
                  <Icon name="heroicons:arrow-path" class="mr-2" />
                  Reset
                </rs-button>
                <rs-button
                  type="submit"
                  :loading="isSearching"
                  @click="handleSearch"
                >
                  <Icon name="heroicons:magnifying-glass" class="mr-2" />
                  {{ isSearching ? "Mencari..." : "Cari IC" }}
                </rs-button>
              </div>
            </FormKit>
          </template>
        </rs-card>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-6">
          <rs-alert type="error" :message="errorMessage" />
        </div>

        <!-- Applicant Info Card -->
        <rs-card v-if="applicantInfo" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <div class="flex items-center">
                <Icon name="heroicons:user" class="mr-2 text-primary" />
                <h3 class="text-lg font-semibold">Maklumat Pemohon</h3>
              </div>
              <rs-badge
                type="success"
                v-if="applicantInfo.asnafStatus === 'Aktif'"
              >
                {{ applicantInfo.asnafStatus }}
              </rs-badge>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <span class="text-sm text-gray-600 block"
                  >No Kad Pengenalan Pemohon</span
                >
                <span class="font-medium">{{ applicantInfo.icNumber }}</span>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <span class="text-sm text-gray-600 block">Nama Pemohon</span>
                <span class="font-medium">{{ applicantInfo.name }}</span>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <span class="text-sm text-gray-600 block"
                  >Status Asnaf / Kelayakan</span
                >
                <span class="font-medium">{{ applicantInfo.asnafStatus }}</span>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <span class="text-sm text-gray-600 block">Kategori Asnaf</span>
                <span class="font-medium">{{
                  applicantInfo.asnafCategory
                }}</span>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <rs-button
                @click="navigateToListing"
                :loading="isSearching"
                class="flex items-center"
              >
                <Icon name="heroicons:list-bullet" class="mr-2" />
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
  title: "Permohonan Pengeluaran Tunai",
});

interface ApplicantInfo {
  icNumber: string;
  name: string;
  asnafStatus: string;
  asnafCategory: string;
}

interface SearchForm {
  icNumber: string;
  applicantName: string;
  profileStatus: string;
}

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Pengeluaran Tunai Kaunter",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Permohonan",
    type: "current",
    path: "/BF-TNI/pengeluaran-tunai-kaunter/permohonan",
  },
]);

// Form and state management
const searchForm = ref<SearchForm>({
  icNumber: "",
  applicantName: "",
  profileStatus: "",
});

const isSearching = ref(false);
const applicantInfo = ref<ApplicantInfo | null>(null);
const errorMessage = ref<string | null>(null);

// Form handlers
const handleSearch = async () => {
  try {
    isSearching.value = true;
    errorMessage.value = null;

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
    errorMessage.value = "Ralat semasa mencari pemohon. Sila cuba lagi.";
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
  errorMessage.value = null;
};

const navigateToListing = () => {
  if (applicantInfo.value) {
    navigateTo(
      `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/listing?icNumber=${applicantInfo.value.icNumber}`
    );
  }
};
</script>

<style lang="scss" scoped>
.text-primary {
  color: #005aad;
}
</style>
