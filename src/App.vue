<script setup lang="ts">
import { ref } from 'vue'

import BaseButton from '@/components/button/BaseButton.vue'
import BaseTextField from '@/components/input/BaseTextField.vue'
import BaseTextarea from './components/input/BaseTextarea.vue'
import BaseCheckbox from '@/components/input/BaseCheckbox.vue'
import BaseRadio from '@/components/input/BaseRadio.vue'

const email = ref('')
const description = ref('')
const remember = ref(false)
const gender = ref('male')
</script>

<template>
  <div class="max-w-md p-10 space-y-5">
    <BaseTextField v-model="email" label="Email" placeholder="Enter email" clearable />

    <BaseTextarea v-model="description" label="Description" placeholder="Write something..." />

    <BaseCheckbox v-model="remember" label="Remember me" />

    <div class="flex gap-4">
      <BaseRadio v-model="gender" name="gender" value="male" label="Male" />

      <BaseRadio v-model="gender" name="gender" value="female" label="Female" />
    </div>

    <BaseButton> Submit </BaseButton>
  </div>
</template>
