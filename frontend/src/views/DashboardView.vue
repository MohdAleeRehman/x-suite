<template>
  <AppLayout title="X Suite - Real Estate Solutions" subtitle="Sharjah Property Transaction Suite">
    <div id="homeSec" class="animate-fluid-view">
      <div class="dashboard-grid">
        <div class="tile" @click="$router.push('/rent')">
          <div class="icon">🔑</div>
          <h3>For Rent</h3>
          <p>Tenant move-in costs, cheques schedules, refundable SEWA deposits, and Municipal processing.</p>
        </div>
        <div class="tile" @click="$router.push('/sale')">
          <div class="icon">🏢</div>
          <h3>For Sale</h3>
          <p>Secondary market pricing, developer balance distributions, and Land Department metrics.</p>
        </div>
        <div class="tile" @click="$router.push('/property')">
          <div class="icon">📋</div>
          <h3>Property Details</h3>
          <p>Fact-sheet profiles matching official print configurations. Best for direct client shares.</p>
        </div>
      </div>

      <div class="management-row">
        <div class="tile tile-inline" @click="$router.push('/records')">
          <div class="icon">🗂️</div>
          <div class="tile-text">
            <h3>Saved Records Directory</h3>
            <p>Browse, edit, remove or isolate specific property transaction summaries historically saved here.</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/AppLayout.vue'
</script>
