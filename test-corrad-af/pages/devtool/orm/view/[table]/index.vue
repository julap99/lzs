<script setup>
definePageMeta({
  title: "ORM Table Editor",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal } = useNuxtApp();

const { table } = useRoute().params;

const { data: tableData } = await useFetch("/api/devtool/orm/data/get", {
  method: "GET",
  query: {
    tableName: table,
  },
});

const openPrismaStudio = async () => {
  const { data } = await useFetch("/api/devtool/orm/studio", {
    method: "GET",
    query: {
      tableName: table,
    },
  });

  if (data.value.statusCode === 200) {
    $swal.fire({
      title: "Prisma Studio",
      text: data.value.message,
      icon: "success",
    });
  } else {
    $swal.fire({
      title: "Prisma Studio",
      text: data.value.message,
      icon: "error",
    });
  }
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-card class="py-5">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-2 px-5"
      >
        <div>
          <h5 class="font-semibold">Table - {{ table }}</h5>
          <span class="text-sm text-gray-500">
            Below is the data of the table.
          </span>
        </div>

        <rs-button @click="openPrismaStudio" class="mb-4">
          Open Prisma Studio
        </rs-button>
      </div>

      <rs-table
        v-if="tableData.data && tableData.data.length > 0"
        :key="tableData.data"
        :data="tableData.data"
        advanced
      />
      <div v-else class="flex justify-center my-3">
        <div class="text-center">
          <h6 class="font-semibold">Data Not Found</h6>
          <span class="text-sm text-gray-500">
            There is no data available for this table.
          </span>
        </div>
      </div>
    </rs-card>
  </div>
</template>
