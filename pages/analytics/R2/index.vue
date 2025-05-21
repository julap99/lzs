<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
  </div>
</template>

<script>
definePageMeta({
  title: "Report 2",
});

const breadcrumb = ref([
  {
    name: "Analytics",
    type: "link",
    path: "/analytics/R2",
  },
  {
    name: "Report 2",
    type: "current",
    path: "/analytics/R2",
  },
]);
</script>
