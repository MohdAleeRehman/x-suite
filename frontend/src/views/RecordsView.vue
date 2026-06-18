<template>
  <AppLayout
    title="PropCRM Saved Directory"
    subtitle="Access and Manage Saved Transaction Files"
  >
    <div class="animate-fluid-view">
      <div class="card">
        <div class="slabel">Saved Transactions History</div>

        <div v-if="recordsStore.loading" style="text-align:center; padding:2rem; color:var(--text-sub);">
          <div class="loader-ring" style="margin: 0 auto 12px;"></div>
          Loading records...
        </div>

        <div v-else-if="recordsStore.records.length === 0" class="no-records">
          No transaction calculations found. Create a sale, rent, or property profile to populate your directory!
        </div>

        <div v-else class="rec-list">
          <div class="rec-card" v-for="record in recordsStore.records" :key="record._id">
            <div class="rec-info" @click="viewRecord(record)">
              <h4>{{ record.title }}</h4>
              <p>
                {{ formatDate(record.createdAt) }}
                <span v-if="record.updatedAt !== record.createdAt"> · Updated {{ formatDate(record.updatedAt) }}</span>
                · Click to open statement view
              </p>
            </div>
            <div class="rec-actions">
              <button class="btn-action edit" @click.stop="editRecord(record)">Edit</button>
              <button class="btn-action delete" @click.stop="deleteRecord(record)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <button class="btn-home" @click="$router.push('/')">← Go Back</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useRecordsStore } from '@/stores/records'

const router = useRouter()
const recordsStore = useRecordsStore()

onMounted(() => {
  recordsStore.fetchRecords()
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('en-AE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const viewRecord = (record) => {
  const routeMap = { sale: '/sale', rent: '/rent', prop: '/property' }
  const path = routeMap[record.type]
  if (path) {
    router.push({ path, query: { view: record._id } })
  }
}

const editRecord = (record) => {
  const routeMap = { sale: '/sale', rent: '/rent', prop: '/property' }
  const path = routeMap[record.type]
  if (path) {
    router.push({ path, query: { edit: record._id } })
  }
}

const deleteRecord = async (record) => {
  const confirmed = confirm(`Are you sure you want to delete this record?\n\n"${record.title}"`)
  if (!confirmed) return

  try {
    await recordsStore.deleteRecord(record._id)
  } catch (err) {
    alert('Failed to delete record. Please try again.')
  }
}
</script>
