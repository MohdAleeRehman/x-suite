<template>
  <div ref="rentResultsRef" class="animate-fluid-view">
    <div class="print-hdr">
      <h2>Residential Lease Commitment Statement</h2>
      <p>Tenant Total Move-In Financial Obligation — Sharjah Municipality</p>
    </div>

    <!-- Key Metrics -->
    <div class="mgrid">
      <div class="met c-blue">
        <div class="ml">Immediate Cash Required</div>
        <div class="mv">{{ fmt(r.immediateCashNeeded) }}</div>
        <div class="ms">Due on {{ r.firstChequeDate }}</div>
      </div>
      <div class="met c-amber">
        <div class="ml">Full Year Commitment</div>
        <div class="mv">{{ fmt(r.completeYearlyFinancialCommitment) }}</div>
        <div class="ms">Including all fees & deposits</div>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="mgrid">
      <div class="met c-green">
        <div class="ml">Annual Contract Rent</div>
        <div class="mv">{{ fmt(r.annualRent) }}</div>
        <div class="ms">Total yearly rent obligation</div>
      </div>
      <div class="met">
        <div class="ml">First Cheque Amount</div>
        <div class="mv">{{ fmt(r.singleChequeAmt) }}</div>
        <div class="ms">Due on {{ r.firstChequeDate }}</div>
      </div>
    </div>

    <!-- Breakdown Table -->
    <div class="card">
      <div class="slabel">Immediate Move-In Financial Breakdown</div>
      <table class="bt">
        <tr class="grp"><td colspan="2">Cheque Payment (Due on {{ r.firstChequeDate }})</td></tr>
        <tr>
          <td>First Cheque Payment</td>
          <td>{{ fmt(r.singleChequeAmt) }}</td>
        </tr>
        <tr class="grp"><td colspan="2">Municipal & Official Deposits</td></tr>
        <tr>
          <td>Sharjah Municipality Attestation Fee (4%)</td>
          <td>{{ fmt(r.attestFee) }}</td>
        </tr>
        <tr>
          <td>SEWA Security Deposit (Refundable)</td>
          <td>{{ fmt(r.sewa) }}</td>
        </tr>
        <tr>
          <td>Refundable Security Deposit ({{ (r.secPct * 100) }}%)</td>
          <td>{{ fmt(r.securityDeposit) }}</td>
        </tr>
        <tr class="grp"><td colspan="2">Agency Commission</td></tr>
        <tr>
          <td>Real Estate Commission (incl. 5% VAT)</td>
          <td>{{ fmt(r.commWithVat) }}</td>
        </tr>
        <tr class="tot">
          <td>Total Immediate Outflow</td>
          <td>{{ fmt(r.immediateCashNeeded) }}</td>
        </tr>
      </table>
    </div>

    <!-- Cheque Schedule -->
    <div class="card">
      <div class="slabel">Upcoming Post-Dated Cheques Schedule</div>
      <table class="bt">
        <template v-if="r.cheques.length > 0">
          <tr class="grp">
            <td colspan="2">Future Post-Dated Cheques Timeline ({{ r.cheques.length }} Remaining)</td>
          </tr>
          <tr v-for="cheque in r.cheques" :key="cheque.number">
            <td>Cheque #{{ cheque.number }} Due Date ({{ cheque.date }})</td>
            <td>{{ fmt(cheque.amount) }}</td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="2" style="text-align:center; color:var(--text-sub); font-style:italic; font-size:13px; padding:20px 0;">
            Single upfront standard cheque configuration. No upcoming post-dated distributions.
          </td>
        </tr>
      </table>
    </div>

    <div class="card" style="padding:1.5rem; margin-top:20px;">
      <button class="btn-print" @click="exportPDF">⬇ Download PDF Report</button>
      <button class="btn-home" @click="$emit('back-to-form')">← Edit Inputs</button>
      <button class="btn-home" @click="$emit('go-home')">← Back to Dashboard</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fmt } from '@/utils/calculations'
import { exportRefToPDF } from '@/utils/pdfExport'

const props = defineProps({ results: Object })
const emit = defineEmits(['back-to-form', 'go-home'])

const r = props.results
const rentResultsRef = ref(null)

const exportPDF = async () => {
  await exportRefToPDF(rentResultsRef, `X-Suite-Rent-Report-${Date.now()}`)
}
</script>
