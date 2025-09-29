<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title and Button -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Senarai Konfigurasi Penutupan Aduan</h2>
      <rs-button variant="primary" @click="tambahKonfigurasi">
        Tambah Penutupan Aduan
      </rs-button>
    </div>

    <rs-card>
      <template #body>
        <rs-table
          class="mt-4"
          :data="rows"
          :pageSize="5"
          :showNoColumn="true"
          :advanced="true"
          :showSearch="true"
          :showFilter="true"
          :optionsAdvanced="{
            sortable: true,
            filterable: true,
            outsideBorder: true
          }"
          :options="{ variant: 'default', hover: true, bordered: true, striped: true }"
        >
          <!-- Custom headers -->
          <template #head.sebab>
            <span class="font-bold uppercase">Sebab Penutupan</span>
          </template>
          <template #head.status>
            <span class="font-bold uppercase">Status</span>
          </template>
          <template #head.tindakan>
            <span class="font-bold uppercase">Tindakan</span>
          </template>

          <!-- Status badge -->
          <template #status="{ text }">
            <div class="flex justify-center">
              <rs-badge :variant="statusVariant(text)">{{ text }}</rs-badge>
            </div>
          </template>

          <!-- Tindakan buttons -->
          <template #tindakan>
            <div class="flex justify-center gap-2">
              <NuxtLink to="/BF-ADN/PK/KA/01/03"> <!--Tak jumpa page ni tapi ada dalam business requirement kena link ke sini -->
                <rs-button variant="info" size="sm">Lihat</rs-button>
              </NuxtLink>
              <NuxtLink to="/BF-ADN/PK/KP/01/03">
                <rs-button variant="warning" size="sm">Kemaskini</rs-button>
              </NuxtLink>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Senarai Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/01/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  {
    name: "Senarai Konfigurasi Penutupan Aduan",
    type: "current",
    path: "/BF-ADN/PK/KP/01/01",
  },
]);

// Table data — must include 'tindakan' so rs-table renders the slot
const rows = ref([
  { sebab: "Bantuan telah diterima daripada agensi lain", status: "Aktif", tindakan: "" },
  { sebab: "Individu tidak dijumpai selepas siasatan", status: "Tidak Aktif", tindakan: "" },
  { sebab: "Permohonan ditarik balik oleh pemohon", status: "Aktif", tindakan: "" },
  { sebab: "Selesai melalui penyelesaian luar", status: "Tidak Aktif", tindakan: "" },
  { sebab: "Lain-lain sebab teknikal", status: "Aktif", tindakan: "" },
]);

// Badge variant
const statusVariant = (status) => {
  if (status === "Aktif") return "success";
  if (status === "Tidak Aktif") return "danger";
  return "secondary";
};

const tambahKonfigurasi = () => {
  navigateTo("/BF-ADN/PK/KP/01/02");
};
</script>
