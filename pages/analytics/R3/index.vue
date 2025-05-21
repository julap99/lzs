<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
  </div>
</template>

<script>
definePageMeta({
  title: "Report 3",
});

const breadcrumb = ref([
  {
    name: "Analytics",
    type: "link",
    path: "/analytics/R3",
  },
  {
    name: "Report 3",
    type: "current",
    path: "/analytics/R3",
  },
]);
</script>
