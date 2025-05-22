<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <img src="@/assets/img/analytic2.jpeg" alt="Analytic A2" />
  </div>
</template>

<script>
definePageMeta({
  title: "Analytic A3",
});

const breadcrumb = ref([
  {
    name: "Analytics",
    type: "link",
    path: "/analytics/R3",
  },
  {
    name: "Analytic A3",
    type: "current",
    path: "/analytics/A3",
  },
]);
</script>
