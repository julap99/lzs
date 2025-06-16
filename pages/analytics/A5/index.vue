<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <img src="@/assets/img/analytic4.jpeg" alt="Analytic A2" />
  </div>
</template>

<script>
definePageMeta({
  title: "Analytic A5",
});

const breadcrumb = ref([
  {
    name: "Analytics",
    type: "link",
    path: "/analytics/A5",
  },
  {
    name: "Analytic A5",
    type: "current",
    path: "/analytics/A5",
  },
]);
</script>
