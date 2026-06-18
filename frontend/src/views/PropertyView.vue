<template>
  <AppLayout
    :title="editId ? 'Property Fact-Sheet Profile (Editing)' : 'Property Fact-Sheet Profile'"
    subtitle="Sharjah Layout & Performance Spec Record"
  >
    <!-- PROP FORM -->
    <div class="animate-fluid-view" v-if="!showResults">
      <!-- Identity & Location -->
      <div class="card">
        <div class="slabel">Identity, Layout Type & Location</div>
        <div class="g2">
          <div class="field">
            <label>Building Name</label>
            <input type="text" v-model="form.pBuilding" />
          </div>
          <div class="field">
            <label>Unit No.</label>
            <input type="text" v-model="form.pUnit" />
          </div>
          <div class="field">
            <label>Level</label>
            <input type="text" v-model="form.pLevel" />
          </div>
          <div class="field">
            <label>View</label>
            <input type="text" v-model="form.pView" />
          </div>
        </div>
        <div class="trow">
          <label>Property Layout Archetype</label>
          <div class="toggle-pill">
            <button :class="{ on: form.propArchetype === 'Apartment' }" @click="setArchetype('Apartment')">Apartment</button>
            <button :class="{ on: form.propArchetype === 'Villa' }" @click="setArchetype('Villa')">Villa / Townhouse / Land</button>
          </div>
        </div>
      </div>

      <!-- Configuration Dimensions -->
      <div class="card">
        <div class="slabel">Configuration Dimensions</div>
        <div class="g3">
          <div class="field">
            <label>Type Designation</label>
            <input type="text" v-model="form.pType" />
          </div>
          <div class="field">
            <label>No. of Bedrooms</label>
            <input type="number" v-model="form.pBeds" />
          </div>
          <div class="field">
            <label>No. of Bathrooms</label>
            <input type="number" v-model="form.pBaths" />
          </div>
          <div class="field">
            <label>No. of Living Rooms</label>
            <input type="number" v-model="form.pLiving" />
          </div>
          <div class="field">
            <label>Balcony</label>
            <input type="text" v-model="form.pBalcony" />
          </div>
          <div class="field">
            <label>Parking Allocations</label>
            <input type="text" v-model="form.pParking" />
          </div>
        </div>
      </div>

      <!-- Area Sizing & Financial Metrics -->
      <div class="card">
        <div class="slabel">Area Sizing & Financial Metrics</div>
        <div class="g2">
          <div class="field" v-if="form.propArchetype === 'Villa'">
            <label>Plot Area (SQ FT)</label>
            <input type="number" v-model="form.pPlotArea" @input="calcPricePerSqFt" />
          </div>
          <div class="field">
            <label>Saleable Area (SQ FT)</label>
            <input type="number" v-model="form.pSaleArea" @input="calcPricePerSqFt" />
          </div>
          <div class="field">
            <label>Selling Price (DHS)</label>
            <input type="number" v-model="form.pPrice" @input="calcPricePerSqFt" />
          </div>
          <div class="field">
            <label>Price / SQ FT</label>
            <input type="number" v-model="form.pPriceSqft" />
          </div>
        </div>
      </div>

      <!-- Status Parameters -->
      <div class="card">
        <div class="slabel">Status Parameters</div>
        <div class="g2">
          <div class="field">
            <label>Occupancy Status</label>
            <input type="text" v-model="form.pStatus" />
          </div>
          <div class="field">
            <label>Paid by Owner Status</label>
            <input type="text" v-model="form.pPaidOwner" />
          </div>
          <div class="field">
            <label>Outstanding Left</label>
            <input type="text" v-model="form.pLeft" />
          </div>
          <div class="field">
            <label>Expected Rent Value</label>
            <input type="number" v-model="form.pExpectRent" @input="calcReturnPct" />
          </div>
          <div class="field">
            <label>Return Metric (%)</label>
            <input type="number" v-model="form.pReturn" step="0.1" />
          </div>
        </div>
        <div class="trow">
          <label>Handover</label>
          <div class="toggle-pill">
            <button :class="{ on: form.propHandoverVal === 'Yes' }" @click="form.propHandoverVal = 'Yes'">Yes</button>
            <button :class="{ on: form.propHandoverVal === 'No' }" @click="form.propHandoverVal = 'No'">No</button>
          </div>
        </div>
      </div>

      <button class="btn-calc" @click="handleCalculate" :disabled="saving">
        {{ saving ? 'Saving...' : (editId ? 'Update & Save Record' : 'Generate Profile & Save') }}
      </button>
      <button class="btn-home" @click="$router.push('/')">← Go Back</button>
    </div>

    <!-- PROP RESULTS -->
    <div v-else>
      <PropertyProfile
        :form="form"
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
import PropertyProfile from '@/components/PropertyProfile.vue'
import { useRecordsStore } from '@/stores/records'

const route = useRoute()
const recordsStore = useRecordsStore()

const editId = ref(null)
const showResults = ref(false)
const saving = ref(false)

const form = ref({
  propArchetype: 'Villa',
  propHandoverVal: 'Yes',
  pBuilding: 'Robinia',
  pUnit: '131',
  pLevel: '1',
  pView: 'Community',
  pType: 'C2',
  pBeds: '3',
  pBaths: '4',
  pLiving: '1',
  pBalcony: 'Yes',
  pParking: '2',
  pPlotArea: '1816',
  pSaleArea: '2591',
  pPrice: '2450000',
  pPriceSqft: '946',
  pStatus: 'Rented till November 26',
  pPaidOwner: 'Fully paid',
  pLeft: 'Nill',
  pExpectRent: '140000',
  pReturn: '5.7'
})

const setArchetype = (arch) => {
  form.value.propArchetype = arch
  calcPricePerSqFt()
}

const calcPricePerSqFt = () => {
  const price = parseFloat(form.value.pPrice) || 0
  const area = parseFloat(form.value.pSaleArea) || 0
  if (area > 0) {
    form.value.pPriceSqft = Math.round(price / area)
  }
}

const calcReturnPct = () => {
  const price = parseFloat(form.value.pPrice) || 0
  const rent = parseFloat(form.value.pExpectRent) || 0
  if (price > 0) {
    form.value.pReturn = ((rent / price) * 100).toFixed(1)
  }
}

const handleCalculate = async () => {
  saving.value = true
  try {
    if (editId.value) {
      await recordsStore.updateRecord(editId.value, 'prop', { ...form.value })
    } else {
      const record = await recordsStore.createRecord('prop', { ...form.value })
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
    if (rec?.propDataset) {
      editId.value = recordId
      Object.assign(form.value, rec.propDataset)
    }
  }

  const viewId = route.query.view
  if (viewId) {
    await recordsStore.fetchRecords()
    const rec = recordsStore.records.find(r => r._id === viewId)
    if (rec?.propDataset) {
      Object.assign(form.value, rec.propDataset)
      showResults.value = true
    }
  }
})
</script>
