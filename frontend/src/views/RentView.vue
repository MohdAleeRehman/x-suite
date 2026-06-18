<template>
  <AppLayout
    :title="editId ? 'PropCRM Rental Engine (Editing)' : 'PropCRM Rental Engine'"
    subtitle="Sharjah Residential & Commercial Leasing"
  >
    <!-- RENT FORM -->
    <div class="animate-fluid-view" v-if="!showResults">
      <!-- Rental Value Parameters -->
      <div class="card">
        <div class="slabel">Rental Value Parameters</div>
        <div class="g3">
          <div class="field">
            <label>Annual Contract Rent (AED)</label>
            <input type="number" v-model="form.rentAnnual" />
          </div>
          <div class="field">
            <label>Number of Cheques</label>
            <input type="number" v-model="form.rentCheques" min="1" max="12" />
          </div>
          <div class="field">
            <label>Contract Start Date</label>
            <input type="date" v-model="form.rentStartDate" />
          </div>
        </div>
      </div>

      <!-- Deposits & Regulations -->
      <div class="card">
        <div class="slabel">Deposits & Regulations</div>
        <div class="g2">
          <div class="field">
            <label>SEWA Connection Deposit (AED)</label>
            <input type="number" v-model="form.rentSewa" />
          </div>
          <div class="field">
            <label>Municipality Attestation Fee</label>
            <input type="text" value="4% of Annual Rent" disabled />
          </div>
        </div>
        <div class="trow">
          <label>Property Furnishing Class</label>
          <div class="toggle-pill">
            <button :class="{ on: form.rentFurnished === 'unfurnished' }" @click="form.rentFurnished = 'unfurnished'">Unfurnished (5%)</button>
            <button :class="{ on: form.rentFurnished === 'furnished' }" @click="form.rentFurnished = 'furnished'">Furnished (10%)</button>
          </div>
        </div>
      </div>

      <!-- Brokerage Commissions -->
      <div class="card">
        <div class="slabel">Brokerage Commissions</div>
        <div class="field">
          <label>Agency Commission Base</label>
          <div class="pair">
            <select v-model="form.rcType">
              <option value="pct">%</option>
              <option value="amt">AED</option>
            </select>
            <input type="number" v-model="form.rcVal" step="any" />
          </div>
          <div class="note">
            {{ form.rcType === 'pct' ? '5% of Annual Contract Rent + 5% UAE VAT' : 'Fixed base fee + 5% UAE VAT' }}
          </div>
        </div>
      </div>

      <button class="btn-calc" @click="handleCalculate" :disabled="saving">
        {{ saving ? 'Saving...' : (editId ? 'Update & Save Record' : 'Calculate & Save Now') }}
      </button>
      <button class="btn-home" @click="$router.push('/')">← Go Back</button>
    </div>

    <!-- RENT RESULTS -->
    <div v-else ref="resultsContainerRef">
      <RentResults
        :results="results"
        @back-to-form="showResults = false"
        @go-home="$router.push('/')"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import RentResults from '@/components/RentResults.vue'
import { useRecordsStore } from '@/stores/records'
import { calculateRentResults, todayStr } from '@/utils/calculations'

const route = useRoute()
const recordsStore = useRecordsStore()

const editId = ref(null)
const showResults = ref(false)
const saving = ref(false)
const results = ref(null)
const resultsContainerRef = ref(null)

const form = ref({
  rentAnnual: 65000,
  rentCheques: 4,
  rentSewa: 2000,
  rentFurnished: 'unfurnished',
  rcType: 'pct',
  rcVal: 5,
  rentStartDate: todayStr()
})

const handleCalculate = async () => {
  saving.value = true
  try {
    results.value = calculateRentResults(form.value)

    if (editId.value) {
      await recordsStore.updateRecord(editId.value, 'rent', { ...form.value })
    } else {
      const record = await recordsStore.createRecord('rent', { ...form.value })
      editId.value = record._id
    }

    showResults.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error('Save failed:', err)
    showResults.value = true
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const recordId = route.query.edit
  if (recordId) {
    await recordsStore.fetchRecords()
    const rec = recordsStore.records.find(r => r._id === recordId)
    if (rec?.rentDataset) {
      editId.value = recordId
      Object.assign(form.value, rec.rentDataset)
    }
  }

  const viewId = route.query.view
  if (viewId) {
    await recordsStore.fetchRecords()
    const rec = recordsStore.records.find(r => r._id === viewId)
    if (rec?.rentDataset) {
      Object.assign(form.value, rec.rentDataset)
      results.value = calculateRentResults(form.value)
      showResults.value = true
    }
  }
})
</script>
