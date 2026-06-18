<template>
  <AppLayout
    :title="editId ? 'PropCRM Sales Calculator (Editing)' : 'PropCRM Sales Calculator'"
    subtitle="Sharjah Property — Secondary Market"
  >
    <!-- SALE FORM -->
    <div class="animate-fluid-view" v-if="!showResults">
      <!-- Property Prices -->
      <div class="card">
        <div class="slabel">Property Prices</div>
        <div class="g2">
          <div class="field">
            <label>Original Buying Price (AED)</label>
            <input type="number" v-model="form.origPrice" @input="autoCalcDevBalance" />
          </div>
          <div class="field">
            <label>New Resale Price (AED)</label>
            <input type="number" v-model="form.sellPrice" />
          </div>
        </div>
        <div class="trow">
          <label>Property Status</label>
          <div class="toggle-pill">
            <button :class="{ on: form.propStatus === 'offplan' }" @click="setStatus('offplan')">Off-plan</button>
            <button :class="{ on: form.propStatus === 'Ready' }" @click="setStatus('Ready')">Ready</button>
          </div>
        </div>
      </div>

      <!-- Offplan Section -->
      <div class="card" v-if="form.propStatus === 'offplan'">
        <div class="slabel">Payments Paid So Far</div>
        <div class="g2">
          <div class="field">
            <label>Amount Paid to Developer</label>
            <div class="pair">
              <select v-model="form.paidType" @change="updatePaidNote(); autoCalcDevBalance()">
                <option value="pct">%</option>
                <option value="amt">AED</option>
              </select>
              <input type="number" v-model="form.paidVal" @input="autoCalcDevBalance" />
            </div>
            <div class="note">{{ paidNote }}</div>
          </div>
          <div class="field">
            <label>Remaining Developer Balance (AED)</label>
            <input type="number" v-model="form.devBal" />
          </div>
        </div>
      </div>

      <!-- Land Department Fees -->
      <div class="card">
        <div class="slabel">Land Department Fees (SRERD)</div>
        <div class="g3">
          <div class="field">
            <label>Buyer Share (%)</label>
            <input type="number" v-model="form.dldPct" step="0.1" />
            <div class="note">Standard split: 2%</div>
          </div>
          <div class="field">
            <label>Seller Share (%)</label>
            <input type="number" v-model="form.sldBasePct" step="0.1" />
            <div class="note">Standard split: 2%</div>
          </div>
          <div class="field">
            <label>Resale Transfer Fee (%)</label>
            <input type="number" v-model="form.sldSellPct" step="0.1" />
            <div class="note">Standard resale: 1%</div>
          </div>
        </div>
        <div class="info-tip">Government fees are calculated based on the new Resale Price.</div>
      </div>

      <!-- Developer Fees -->
      <div class="card">
        <div class="slabel">Developer & Paperwork Fees</div>
        <div class="g3">
          <div class="field">
            <label>Developer NOC Fee (AED)</label>
            <input type="number" v-model="form.nocFee" />
            <div class="note">Paid by Seller</div>
          </div>
          <div class="field">
            <label>Sale Purchase Agreement ARADA (AED)</label>
            <input type="number" v-model="form.spaFee" />
            <div class="note">Paid by Buyer</div>
          </div>
          <div class="field">
            <label>Title Deed / Reg Fee (AED)</label>
            <input type="number" v-model="form.titleDeed" />
            <div class="note">Paid by Buyer</div>
          </div>
        </div>
      </div>

      <!-- Agent Commission -->
      <div class="card">
        <div class="slabel">Agent Commission (+ 5% UAE VAT)</div>
        <div class="g2">
          <div class="field">
            <label>Buyer Agent Commission</label>
            <div class="pair">
              <select v-model="form.bcType">
                <option value="pct">%</option>
                <option value="amt">AED</option>
              </select>
              <input type="number" v-model="form.bcVal" step="any" />
            </div>
            <div class="note">5% VAT added on top</div>
          </div>
          <div class="field">
            <label>Seller Agent Commission</label>
            <div class="pair">
              <select v-model="form.scType">
                <option value="pct">%</option>
                <option value="amt">AED</option>
              </select>
              <input type="number" v-model="form.scVal" step="any" />
            </div>
            <div class="note">5% VAT added on top</div>
          </div>
        </div>
      </div>

      <!-- Utility Deposits -->
      <div class="card">
        <div class="slabel">Utility / Handover Deposits</div>
        <div class="trow" style="margin-top:0; padding-top:0; border-top:none;">
          <label>Include utility setup/meter fees?</label>
          <div class="toggle-pill">
            <button :class="{ on: form.hasUtil }" @click="setUtil(true)">Yes</button>
            <button :class="{ on: !form.hasUtil }" @click="setUtil(false)">No</button>
          </div>
        </div>
        <div v-if="form.hasUtil">
          <div class="util-grid">
            <div class="util-item" v-for="util in utils" :key="util.key">
              <label>{{ util.label }} (AED)</label>
              <input type="number" v-model="form[util.model]" placeholder="0" />
              <div class="payer-toggle">
                <button :class="{ on: form.payerMap[util.key] === 'buyer' }" @click="setPayer(util.key, 'buyer')">Buyer</button>
                <button :class="{ on: form.payerMap[util.key] === 'seller' }" @click="setPayer(util.key, 'seller')">Seller</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-calc" @click="handleCalculate" :disabled="saving">
        {{ saving ? 'Saving...' : (editId ? 'Update & Save Record' : 'Calculate & Save Now') }}
      </button>
      <button class="btn-home" @click="$router.push('/')">← Go Back</button>
    </div>

    <!-- SALE RESULTS -->
    <div v-else ref="resultsRef">
      <SaleResults
        :results="results"
        :form="form"
        @back-to-form="showResults = false"
        @go-home="$router.push('/')"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import SaleResults from '@/components/SaleResults.vue'
import { useRecordsStore } from '@/stores/records'
import { calculateSaleResults } from '@/utils/calculations'

const route = useRoute()
const recordsStore = useRecordsStore()

const editId = ref(null)
const showResults = ref(false)
const saving = ref(false)
const results = ref(null)

const form = ref({
  origPrice: 913000,
  sellPrice: 1100000,
  propStatus: 'offplan',
  paidType: 'pct',
  paidVal: 25,
  devBal: 684750,
  dldPct: 2,
  sldBasePct: 2,
  sldSellPct: 1,
  nocFee: 5250,
  spaFee: 1250,
  titleDeed: 520,
  bcType: 'pct',
  bcVal: 2,
  scType: 'pct',
  scVal: 2,
  hasUtil: true,
  uWater: 0,
  uGas: 0,
  uElec: 0,
  uFire: 0,
  payerMap: { Water: 'buyer', Gas: 'buyer', Elec: 'buyer', Fire: 'buyer' }
})

const utils = [
  { key: 'Water', label: 'Water Meter', model: 'uWater' },
  { key: 'Gas', label: 'Gas Meter', model: 'uGas' },
  { key: 'Elec', label: 'Electric Meter', model: 'uElec' },
  { key: 'Fire', label: 'Fire Alarm', model: 'uFire' }
]

const paidNote = computed(() => {
  return form.value.paidType === 'pct'
    ? `${form.value.paidVal}% of original purchase price`
    : 'Fixed AED amount'
})

const setStatus = (v) => {
  form.value.propStatus = v
  autoCalcDevBalance()
}

const setUtil = (v) => {
  form.value.hasUtil = v
}

const setPayer = (key, payer) => {
  form.value.payerMap[key] = payer
}

const updatePaidNote = () => {}

const autoCalcDevBalance = () => {
  if (form.value.propStatus !== 'offplan') return
  const orig = parseFloat(form.value.origPrice) || 0
  const pv = parseFloat(form.value.paidVal) || 0
  let paidDev = form.value.paidType === 'pct' ? (orig * pv / 100) : pv
  let balance = orig - paidDev
  form.value.devBal = balance > 0 ? Math.round(balance) : 0
}

const handleCalculate = async () => {
  saving.value = true
  try {
    results.value = calculateSaleResults(form.value)

    if (editId.value) {
      await recordsStore.updateRecord(editId.value, 'sale', { ...form.value })
    } else {
      const record = await recordsStore.createRecord('sale', { ...form.value })
      editId.value = record._id
    }

    showResults.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error('Failed to save:', err)
    // Still show results even if save fails
    showResults.value = true
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  // Check if editing from records
  const recordId = route.query.edit
  if (recordId) {
    await recordsStore.fetchRecords()
    const rec = recordsStore.records.find(r => r._id === recordId)
    if (rec && rec.saleDataset) {
      editId.value = recordId
      const d = rec.saleDataset
      Object.keys(d).forEach(k => {
        if (k in form.value) form.value[k] = d[k]
      })
      if (d.payerMap) form.value.payerMap = { ...d.payerMap }
    }
  }

  // Check if viewing from records
  const viewId = route.query.view
  if (viewId) {
    await recordsStore.fetchRecords()
    const rec = recordsStore.records.find(r => r._id === viewId)
    if (rec && rec.saleDataset) {
      const d = rec.saleDataset
      Object.keys(d).forEach(k => {
        if (k in form.value) form.value[k] = d[k]
      })
      if (d.payerMap) form.value.payerMap = { ...d.payerMap }
      results.value = calculateSaleResults(form.value)
      showResults.value = true
    }
  }
})
</script>
