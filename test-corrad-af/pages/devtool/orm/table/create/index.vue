<script setup>
definePageMeta({
  title: "Database Create Table",
  middleware: ["auth"],
  requiresAuth: true,
});

const tableName = ref("");
const tableKey = ref(0);
const tableData = ref([]);
const columnTypes = ref([]);

const { $swal } = useNuxtApp();

const { data: dbConfiguration } = await useFetch(
  "/api/devtool/orm/table/config"
);

if (dbConfiguration.value && dbConfiguration.value.statusCode === 200) {
  let tempObject = {};

  dbConfiguration.value.data.tableField.forEach((field) => {
    tempObject[field] = "";
  });

  tableData.value.push(tempObject);

  // Update columnTypes to use the new structure
  columnTypes.value = dbConfiguration.value.data.columnTypes.flatMap((group) =>
    group.options.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option
    )
  );
}

const addNewField = () => {
  let tempObject = {};

  // Add new field after the last field
  dbConfiguration.value.data.tableField.forEach((field) => {
    tempObject[field] = "";
  });

  tableData.value.push(tempObject);

  tableKey.value++;
};

const removeField = (index) => {
  tableData.value.splice(index, 1);
};

const sortField = (index, direction) => {
  if (direction === "up") {
    if (index === 0) return;

    let temp = tableData.value[index];
    tableData.value[index] = tableData.value[index - 1];
    tableData.value[index - 1] = temp;

    tableKey.value++;
  } else {
    if (index === tableData.value.length - 1) return;

    let temp = tableData.value[index];
    tableData.value[index] = tableData.value[index + 1];
    tableData.value[index + 1] = temp;

    tableKey.value++;
  }
};

const autoIcrementColumn = ref("");

const computedAutoIncrementColumn = computed(() => {
  return tableData.value.map((data) => {
    return {
      label: data.name,
      value: data.name,
    };
  });
});

const checkRadioButton = async (index, event) => {
  try {
    // change tableData[index].primaryKey value to true
    tableData.value[index].primaryKey = event.target.checked;

    // change all other tableData[index].primaryKey value to false
    tableData.value.forEach((data, i) => {
      if (i !== index) {
        tableData.value[i].primaryKey = "";
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const resetData = () => {
  $swal
    .fire({
      title: "Are you sure?",
      text: "You will lose all the data you have entered.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset it!",
      cancelButtonText: "No, cancel!",
    })
    .then((result) => {
      if (result.isConfirmed) {
        tableName.value = "";
        tableData.value = [];
        tableKey.value = 0;

        let tempObject = {};

        dbConfiguration.value.data.tableField.forEach((field) => {
          tempObject[field] = "";
        });

        tableData.value.push(tempObject);
      }
    });
};

const submitCreateTable = async () => {
  try {
    const { data } = await useFetch("/api/devtool/orm/table/create", {
      method: "POST",
      body: {
        tableName: tableName.value,
        tableSchema: tableData.value,
        autoIncrementColumn: autoIcrementColumn.value,
      },
    });

    if (data.value.statusCode == 200) {
      $swal.fire({
        title: "Success",
        text: data.value.message,
        icon: "success",
      });

      navigateTo("/devtool/orm");
    } else {
      $swal.fire({
        title: "Error",
        text: data.value.message,
        icon: "error",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <rs-card class="py-5">
      <FormKit
        type="form"
        :classes="{
          messages: 'px-5',
        }"
        :actions="false"
        @submit="submitCreateTable"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-2 mb-5 px-5"
        >
          <div>
            <h5 class="font-semibold">Create Table</h5>
            <span class="text-sm text-gray-500">
              Create a new table in the database.
            </span>
          </div>

          <div class="flex gap-3">
            <rs-button @click="resetData" variant="primary-outline">
              Reset Table
            </rs-button>
            <rs-button btnType="submit" class="mb-4 w-[100px]">
              Save
            </rs-button>
          </div>
        </div>

        <section class="px-5">
          <FormKit
            v-model="tableName"
            type="text"
            label="Table name"
            placeholder="Enter table name"
            validation="required|length:3,64"
            :classes="{ outer: 'mb-8' }"
            :validation-messages="{
              required: 'Table name is required',
              length:
                'Table name must be at least 3 characters and at most 64 characters',
            }"
          />
        </section>

        <rs-table
          v-if="tableData && tableData.length > 0"
          :data="tableData"
          :key="tableKey"
          :disableSort="true"
          class="mb-8"
        >
          <template v-slot:name="data">
            <FormKit
              v-model="data.value.name"
              :classes="{
                outer: 'mb-0 w-[200px]',
              }"
              placeholder="Enter column name"
              type="text"
              validation="required|length:3,64"
              :validation-messages="{
                required: 'Column name is required',
                length:
                  'Column name must be at least 3 characters and at most 64 characters',
              }"
            />
          </template>
          <template v-slot:type="data">
            <FormKit
              v-if="columnTypes && columnTypes.length > 0"
              v-model="data.value.type"
              :classes="{ outer: 'mb-0 w-[100px]' }"
              :options="columnTypes"
              type="select"
              placeholder="Select type"
              validation="required"
              :validation-messages="{
                required: 'Column type is required',
              }"
            />
          </template>
          <template v-slot:length="data">
            <FormKit
              v-model="data.value.length"
              :classes="{ outer: 'mb-0 w-[150px]' }"
              placeholder="Enter length"
              type="number"
            />
          </template>
          <template v-slot:defaultValue="data">
            <FormKit
              v-model="data.value.defaultValue"
              :classes="{ outer: 'mb-0 w-[150px]' }"
              placeholder="Optional"
              type="text"
            />
          </template>
          <template v-slot:nullable="data">
            <FormKit
              v-model="data.value.nullable"
              :classes="{ wrapper: 'mb-0', outer: 'mb-0' }"
              type="checkbox"
            />
          </template>
          <template v-slot:primaryKey="data">
            <FormKit
              v-model="data.value.primaryKey"
              :classes="{
                wrapper: 'mb-0',
                outer: 'mb-0',
                input: 'icon-check rounded-full',
              }"
              type="checkbox"
              @change="checkRadioButton(data.index, $event)"
            />
          </template>
          <template v-slot:actions="data">
            <div class="flex justify-center items-center gap-2">
              <rs-button @click="addNewField" type="button" class="p-1 w-6 h-6">
                <Icon name="ph:plus" />
              </rs-button>

              <rs-button
                @click="sortField(data.index, 'up')"
                type="button"
                class="p-1 w-6 h-6"
                :disabled="data.index === 0"
              >
                <Icon name="ph:arrow-up" />
              </rs-button>
              <rs-button
                @click="sortField(data.index, 'down')"
                type="button"
                class="p-1 w-6 h-6"
                :disabled="data.index === tableData.length - 1"
              >
                <Icon name="ph:arrow-down" />
              </rs-button>
              <rs-button
                @click="removeField(data.index)"
                type="button"
                class="p-1 w-6 h-6"
                variant="danger"
                :disabled="data.index === 0 && tableData.length === 1"
              >
                <Icon name="ph:x" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </FormKit>
    </rs-card>
  </div>
</template>
