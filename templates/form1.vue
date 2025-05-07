<script setup>
definePageMeta({
  title: "Form 1",
});

const param = ref({
  field1: "",
  field2: "",
  field3: "",
  field4: "",
  field5: "",
  field6: "",
  field7: "",
  field8: "",
});

const submit = () => {
  console.log("submit");
};
</script>

<template>
  <div>
    <rs-card>
      <template #header> Contact Form </template>
      <template #body>
        <FormKit type="form" @submit="submit">
          <div class="grid grid-cols-2 gap-x-4">
            <FormKit
              v-model="param.field1"
              label="First Name"
              type="text"
              validation="required"
              validation-visibility="dirty"
            />
            <FormKit
              v-model="param.field2"
              label="Last Name"
              type="text"
              validation="required"
              validation-visibility="dirty"
            />
          </div>

          <FormKit
            v-model="param.field3"
            label="Gender"
            type="radio"
            validation="required"
            :options="[
              { label: 'Lelaki', value: 'lelaki' },
              { label: 'Perempuan', value: 'perempuan' },
            ]"
            :classes="{
              fieldset: 'border-0 !p-0',
              legend: '!font-semibold !text-sm mb-0',
              options: '!flex !flex-row gap-4 mt-3',
            }"
          />
          <FormKit
            v-model="param.field4"
            label="Email"
            type="email"
            validation="required|email"
            validation-visibility="dirty"
          />
          <FormKit
            v-model="param.field5"
            label="Phone Number"
            type="tel"
            validation="matches:/^[0-9]{3}-[0-9]{7}$/"
            validation-visibility="dirty"
            :validation-messages="{
              matches: 'Phone number must be in the format xxx-xxxxxxx',
            }"
            help="Phone number must be in the format xxx-xxxxxxx"
          />

          <FormKit
            v-model="param.field6"
            label="Date of Birth"
            type="date"
            validation="required|date_before:2005-01-01"
            validation-visibility="dirty"
            help="Date of birth must be before 2005-01-01"
          />
          <FormKit
            v-model="param.field7"
            label="Address"
            type="textarea"
            rows="10"
            validation="required"
            validation-visibility="dirty"
          />
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>
