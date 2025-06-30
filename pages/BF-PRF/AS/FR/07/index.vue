<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Family Tree (Asnaf)</h2>
        </div>
      </template>

      <template #body>
        <div id="tree" class="w-full h-screen"></div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Family Tree",
});

const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/07",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/FR/07",
  },
  {
    name: "Family Tree",
    type: "current",
    path: "/BF-PRF/AS/FR/07",
  },
]);

onMounted(() => {
  // Dynamically load the FamilyTree.js script from CDN
  const script = document.createElement("script");
  script.src = "https://cdn.balkan.app/orgchart.js";

  script.onload = () => {
    new OrgChart(
      "#tree",

      {
        nodeBinding: {
          field_0: "name",
          field_1: "role",
          field_2: "jobStatus",
          field_3: "income",
          field_4: "customId",
        },
        nodes: [
          {
            id: 1,
            name: "Ahmad Faizal",
            role: "Diri Sendiri",
            jobStatus: "Status Pekerjaan: Bekerja",
            income: "Pendapatan: RM 1200.00",
            customId: "#174805",
            gender: "male",
            tags: ["highlight"],
            img: "https://ui-avatars.com/api/?name=Ahmad+Faizal"
          },
          {
            id: 2,
            pid: 1,
            name: "Siti Aishah",
            role: "Pasangan",
            jobStatus: "Status Pekerjaan: Tidak Bekerja",
            income: "Pendapatan: RM 1500.00",
            customId: "#174806",
            gender: "female",
            img: "https://ui-avatars.com/api/?name=Siti+Aishah"

          },
          {
            id: 3,
            pid: 1,
            name: "Zainab Binti Ahmad",
            role: "Ibu",
            jobStatus: "Status Pekerjaan: Tidak Bekerja",
            income: "Pendapatan: RM 0.00",
            customId: "#174808",
            gender: "female",
            img: "https://ui-avatars.com/api/?name=Zainab+Binti+Ahmad"

          },
          {
            id: 4,
            pid: 2,
            name: "Muhammad Ali",
            role: "Anak",
            jobStatus: "Status Pekerjaan: Bekerja",
            income: "Pendapatan: RM 2000.00",
            customId: "#174807",
            gender: "male",
            img: "https://ui-avatars.com/api/?name=Muhammad+Ali"

          },
        ],
      }
    );
  };
  document.body.appendChild(script);
});
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
