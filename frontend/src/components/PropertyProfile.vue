<template>
  <div ref="propProfileRef" class="animate-fluid-view">
    <div class="print-hdr">
      <h2>Official Property Fact-Sheet</h2>
      <p>System Generated Profile Record — Confidential Client Copy</p>
    </div>

    <div class="card" style="padding:0; overflow:hidden;">
      <table class="prop-table">
        <tr><td>Building Name</td><td>{{ form.pBuilding || 'N/A' }}</td></tr>
        <tr><td>Unit No.</td><td>{{ form.pUnit || 'N/A' }}</td></tr>
        <tr><td>Level</td><td>{{ form.pLevel || 'N/A' }}</td></tr>
        <tr><td>View</td><td>{{ form.pView || 'N/A' }}</td></tr>
        <tr><td>Type</td><td>{{ form.pType || 'N/A' }}</td></tr>
        <tr><td>No Of Bedrooms</td><td>{{ form.pBeds || 'N/A' }}</td></tr>
        <tr><td>No Of Bathrooms</td><td>{{ form.pBaths || 'N/A' }}</td></tr>
        <tr><td>No Of Living Rooms</td><td>{{ form.pLiving || 'N/A' }}</td></tr>
        <tr><td>Balcony Included</td><td>{{ form.pBalcony || 'N/A' }}</td></tr>
        <tr><td>Parking Slots</td><td>{{ form.pParking || 'N/A' }}</td></tr>
        <tr v-if="form.propArchetype === 'Villa'">
          <td>Plot Area Size</td>
          <td>{{ formatNum(form.pPlotArea) }} SQ FT</td>
        </tr>
        <tr><td>Saleable Area Size</td><td>{{ formatNum(form.pSaleArea) }} SQ FT</td></tr>
        <tr>
          <td>Market Price Evaluation</td>
          <td class="highlight-price">AED {{ formatNum(form.pPrice) }}</td>
        </tr>
        <tr><td>Price Per SQ FT Metrics</td><td>AED {{ form.pPriceSqft }} / SQ FT</td></tr>
        <tr><td>Current Occupancy Status</td><td>{{ form.pStatus || 'N/A' }}</td></tr>
        <tr><td>Paid Equity to Developer</td><td>{{ form.pPaidOwner || 'N/A' }}</td></tr>
        <tr><td>Outstanding Developer Liability</td><td>{{ form.pLeft || 'N/A' }}</td></tr>
        <tr><td>Handover Completed Status</td><td>{{ form.propHandoverVal }}</td></tr>
        <tr>
          <td>Expected Annual Contract Lease Value</td>
          <td>AED {{ formatNum(form.pExpectRent) }}</td>
        </tr>
        <tr>
          <td>Projected Capital Return Percentage</td>
          <td style="font-weight:700; color:var(--brand-success);">{{ form.pReturn }}% Gross ROI</td>
        </tr>
      </table>
    </div>

    <div class="card" style="margin-top:20px; padding:1.5rem;">
      <button class="btn-print" @click="exportPDF">⬇ Download PDF Profile</button>
      <button class="btn-home" @click="$emit('back-to-form')">← Edit Inputs</button>
      <button class="btn-home" @click="$emit('go-home')">← Back to Dashboard</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { exportRefToPDF } from '@/utils/pdfExport'

const props = defineProps({ form: Object })
const emit = defineEmits(['back-to-form', 'go-home'])

const propProfileRef = ref(null)

const formatNum = (val) => {
  const n = parseFloat(val)
  return n ? Math.round(n).toLocaleString('en-AE') : val || 'N/A'
}

const exportPDF = async () => {
  await exportRefToPDF(propProfileRef, `X-Suite-Property-${props.form.pBuilding}-Unit${props.form.pUnit}-${Date.now()}`)
}
</script>
