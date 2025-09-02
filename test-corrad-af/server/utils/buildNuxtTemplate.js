export function buildNuxtTemplate({ title, name }) {
  // Ensure title is properly escaped for use in template
  const escapedTitle = title.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  
  return `<script setup>
    definePageMeta({
      title: "${escapedTitle}",
      middleware: ["auth"],
      requiresAuth: true,
    });
    </script>
    
    <template>
      <div>
        <LayoutsBreadcrumb />
        <rs-card>
          <template #header>
            <div>
              ${title}
            </div>
          </template>
          <template #body>
            <div>
              Content for ${title}
            </div>
          </template>
        </rs-card>
      </div>
    </template>
    
    <style scoped>
    /* Add your styles here */
    </style>
    `;
}
