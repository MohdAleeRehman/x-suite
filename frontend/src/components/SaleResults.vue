<template>
  <div>
    <!-- Tabs -->
    <div class="tab-row">
      <button class="tab" :class="{ on: activeTab === 'buyer' }" @click="activeTab = 'buyer'">Buyer Costs</button>
      <button class="tab" :class="{ on: activeTab === 'seller' }" @click="activeTab = 'seller'">Seller Profits</button>
      <button class="tab" :class="{ on: activeTab === 'summary' }" @click="activeTab = 'summary'">Deal Snapshot</button>
    </div>

    <!-- BUYER TAB -->
    <div v-if="activeTab === 'buyer'" class="tab-panel on" ref="buyerTabRef">
      <div class="print-hdr">
        <h2>Buyer Closing Statement</h2>
        <p>Sharjah Secondary Real Estate Purchase Summary</p>
      </div>
      <div class="mgrid">
        <div class="met c-blue">
          <div class="ml">Total Investment Required</div>
          <div class="mv">{{ fmt(r.buyerTotal) }}</div>
          <div class="ms">Purchase price plus all closing fees</div>
        </div>
        <div class="met c-amber">
          <div class="ml">Frictional Fee Overhead</div>
          <div class="mv">{{ pct(r.premPct) }}</div>
          <div class="ms">Total fees above buying price</div>
        </div>
      </div>
      <div class="card">
        <div class="slabel">Buyer Money Breakdown</div>
        <table class="bt">
          <tr class="grp"><td colspan="2">Property Purchase Overview</td></tr>
          <tr><td>Agreed Real Estate Transaction Value</td><td style="color:#111;">{{ fmt(r.sell) }}</td></tr>
          <tr class="grp"><td colspan="2">Property Payments Split</td></tr>
          <tr><td>Cash Paid to Seller</td><td>{{ fmt(r.equityToSeller) }}</td></tr>
          <tr><td>Remaining Balance Owed to Developer</td><td>{{ fmt(r.devBal) }}</td></tr>
          <tr class="grp"><td colspan="2">Government & Admin Fees</td></tr>
          <tr><td>Sharjah Land Department Fee ({{ r.dld }}%)</td><td>{{ fmt(r.dldFee) }}</td></tr>
          <tr><td>Title Deed / Registration Charge</td><td>{{ fmt(r.tdFee) }}</td></tr>
          <tr><td>Sale Purchase Agreement ARADA</td><td>{{ fmt(r.spa) }}</td></tr>
          <tr class="grp"><td colspan="2">Utility Handover Fees</td></tr>
          <tr v-if="r.bUtil > 0"><td>Utility Deposits (Buyer Share)</td><td>{{ fmt(r.bUtil) }}</td></tr>
          <tr class="grp"><td colspan="2">Real Estate Agent</td></tr>
          <tr><td>Agency Commission (incl. 5% VAT)</td><td>{{ fmt(r.bComm) }}</td></tr>
          <tr class="tot"><td>Total Buyer Cost</td><td>{{ fmt(r.buyerTotal) }}</td></tr>
        </table>
      </div>
      <div class="card" style="padding:1.5rem;">
        <button class="btn-print" @click="exportPDF('buyer')">⬇ Download PDF Report</button>
        <button class="btn-home" @click="$emit('back-to-form')">← Edit Inputs</button>
        <button class="btn-home" @click="$emit('go-home')">← Back to Dashboard</button>
      </div>
    </div>

    <!-- SELLER TAB -->
    <div v-if="activeTab === 'seller'" class="tab-panel on" ref="sellerTabRef">
      <div class="print-hdr">
        <h2>Seller Realization Statement</h2>
        <p>Sharjah Secondary Real Estate Profit & Deduction Statement</p>
      </div>
      <div class="banner" :class="r.netSeller >= 0 ? 'g' : 'r'">
        <div>
          <div class="bl">{{ r.netSeller >= 0 ? 'Net Take-Home Profit' : 'Net Loss After Fees' }}</div>
          <div class="bv">{{ fmt(Math.abs(r.netSeller)) }}</div>
        </div>
      </div>
      <div class="mgrid">
        <div class="met">
          <div class="ml">Gross Price Increase</div>
          <div class="mv">{{ fmt(r.assetPremium) }}</div>
        </div>
        <div class="met">
          <div class="ml">Total Selling Fees</div>
          <div class="mv">{{ fmt(r.totalSellerCosts) }}</div>
        </div>
      </div>
      <div class="card">
        <div class="slabel">Seller Profit Breakdown</div>
        <table class="bt">
          <tr class="grp"><td colspan="2">Contract Deal Valuation</td></tr>
          <tr><td>Agreed Real Estate Transaction Value</td><td style="color:#111;">{{ fmt(r.sell) }}</td></tr>
          <tr class="grp"><td colspan="2">Property Appreciation</td></tr>
          <tr><td>Gross Value Gain (Selling Price - Original Price)</td><td style="color:#0073bb">{{ fmt(r.assetPremium) }}</td></tr>
          <tr class="grp"><td colspan="2">Selling Expenses</td></tr>
          <tr><td>Sharjah Land Dept. Base Fee ({{ r.sldBase }}%)</td><td style="color:var(--brand-danger)">{{ minus(r.sldBaseFee) }}</td></tr>
          <tr><td>Sharjah Resale Admin Fee ({{ r.sldSell }}%)</td><td style="color:var(--brand-danger)">{{ minus(r.sldSellFee) }}</td></tr>
          <tr><td>Developer NOC Fee</td><td style="color:var(--brand-danger)">{{ minus(r.noc) }}</td></tr>
          <tr v-if="r.sUtil > 0"><td>Utility Expenses (Seller Share)</td><td style="color:var(--brand-danger)">{{ minus(r.sUtil) }}</td></tr>
          <tr class="grp"><td colspan="2">Real Estate Agent</td></tr>
          <tr><td>Agency Commission (incl. 5% VAT)</td><td style="color:var(--brand-danger)">{{ minus(r.sComm) }}</td></tr>
          <tr class="tot">
            <td>{{ r.netSeller >= 0 ? 'Net Profit After Fees' : 'Net Loss After Fees' }}</td>
            <td :style="{ color: r.netSeller >= 0 ? 'var(--brand-success)' : 'var(--brand-danger)' }">
              {{ fmt(Math.abs(r.netSeller)) }}
            </td>
          </tr>
          <tr>
            <td style="font-size:12px; padding-top:4px;">Total Cost Drag Summary</td>
            <td style="font-size:12px; padding-top:4px; font-weight:normal; color:var(--text-sub);">{{ minus(r.totalSellerCosts) }}</td>
          </tr>
        </table>
      </div>
      <div class="card" style="padding:1.5rem;">
        <button class="btn-print" @click="exportPDF('seller')">⬇ Download PDF Report</button>
        <button class="btn-home" @click="$emit('back-to-form')">← Edit Inputs</button>
        <button class="btn-home" @click="$emit('go-home')">← Back to Dashboard</button>
      </div>
    </div>

    <!-- SUMMARY TAB -->
    <div v-if="activeTab === 'summary'" class="tab-panel on" ref="summaryTabRef">
      <div class="print-hdr">
        <h2>Secondary Deal Ledger</h2>
        <p>Complete Transaction Flow & Capitalization Ratios</p>
      </div>
      <div class="card" style="padding:1.5rem;">
        <div class="slabel">Visual Progress Charts</div>

        <div style="margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; margin-bottom: 4px;">
            <span>Initial Buying Price</span>
            <span>{{ fmt(r.orig) }}</span>
          </div>
          <div class="visual-bar-container">
            <div class="visual-bar-fill" :style="{ background: '#555', width: r.graphOrigPercent + '%' }"></div>
            <div class="visual-bar-label">Original Price</div>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; margin-bottom: 4px;">
            <span>New Selling Price</span>
            <span>{{ fmt(r.sell) }}</span>
          </div>
          <div class="visual-bar-container">
            <div class="visual-bar-fill" :style="{ background: 'var(--hsbc-red)', width: r.graphSellPercent + '%' }"></div>
            <div class="visual-bar-label">Selling Price</div>
          </div>
        </div>

        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600; margin-bottom: 4px;">
            <span>Total Capital Required (Price + Extra Fees)</span>
            <span>{{ fmt(r.buyerTotal) }}</span>
          </div>
          <div class="visual-bar-container">
            <div class="visual-bar-fill" :style="{ background: '#0073bb', width: r.graphBuyerPercent + '%' }"></div>
            <div class="visual-bar-label">Total Buyer Budget</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="slabel">Consolidated Deal Metrics</div>
        <table class="bt">
          <tr><td>Agreed Resale Transaction Price</td><td>{{ fmt(r.sell) }}</td></tr>
          <tr><td>Historical Original Purchase Price</td><td>{{ fmt(r.orig) }}</td></tr>
          <tr><td>Gross Asset Capital Appreciation</td><td style="color:var(--brand-success)">{{ pct(r.apprec) }}</td></tr>
          <tr><td>Unleveraged Return Yield on Cost</td><td style="color:var(--brand-success)">{{ pct(r.yieldOnCost) }}</td></tr>
          <tr class="grp"><td colspan="2">Net Position Disparities</td></tr>
          <tr><td>Total Buyer All-In Capital Injection</td><td style="color:#0073bb">{{ fmt(r.buyerTotal) }}</td></tr>
          <tr><td>Total Seller Liquid Capital Payout</td><td style="color:var(--brand-success)">{{ fmt(r.netSeller) }}</td></tr>
          <tr class="grp"><td colspan="2">Transaction Friction</td></tr>
          <tr><td>Total Deal Friction (Fees + Costs)</td><td>{{ fmt(r.totalFriction) }}</td></tr>
          <tr><td>Friction as % of Deal Value</td><td>{{ pct(r.fricPct) }}</td></tr>
        </table>
      </div>

      <div class="summary-para" v-html="r.summaryPara"></div>

      <div class="card" style="padding:1.5rem; margin-top:20px;">
        <button class="btn-print" @click="exportPDF('summary')">⬇ Download PDF Report</button>
        <button class="btn-home" @click="$emit('back-to-form')">← Edit Inputs</button>
        <button class="btn-home" @click="$emit('go-home')">← Back to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { fmt, pct, minus } from '@/utils/calculations'
import { exportRefToPDF } from '@/utils/pdfExport'

const props = defineProps({
  results: Object,
  form: Object
})

const emit = defineEmits(['back-to-form', 'go-home'])

const activeTab = ref('buyer')
const buyerTabRef = ref(null)
const sellerTabRef = ref(null)
const summaryTabRef = ref(null)

const r = props.results

const exportPDF = async (tab) => {
  const refMap = {
    buyer: buyerTabRef,
    seller: sellerTabRef,
    summary: summaryTabRef
  }
  const targetRef = refMap[tab]
  if (targetRef.value) {
    await exportRefToPDF(targetRef, `X-Suite-Sale-${tab}-${Date.now()}`)
  }
}
</script>
