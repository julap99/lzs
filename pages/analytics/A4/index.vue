<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <img src="@/assets/img/analytic3.jpeg" alt="Analytic A2" />
  </div>
</template>

<script>
definePageMeta({
  title: "Analytic A4",
});

const breadcrumb = ref([
  {
    name: "Analytics",
    type: "link",
    path: "/analytics/A4",
  },
  {
    name: "Analytic A4",
    type: "current",
    path: "/analytics/A4",
  },
]);
</script>
