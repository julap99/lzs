<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
  </div>
</template>

<script>
definePageMeta({
  title: "Analytic A2",
});

const breadcrumb = ref([
  {
    name: "Analytics",
    type: "link",
    path: "/analytics/A2",
  },
  {
    name: "Analytic A2",
    type: "current",
    path: "/analytics/A2",
  },
]);
</script>
