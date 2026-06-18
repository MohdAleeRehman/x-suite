import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useRecordsStore = defineStore('records', () => {
  const records = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRecords = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/records')
      records.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to load records'
    } finally {
      loading.value = false
    }
  }

  const createRecord = async (type, dataset) => {
    try {
      const response = await api.post('/records', { type, dataset })
      records.value.unshift(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create record'
      throw err
    }
  }

  const updateRecord = async (id, type, dataset) => {
    try {
      const response = await api.put(`/records/${id}`, { type, dataset })
      const idx = records.value.findIndex(r => r._id === id)
      if (idx !== -1) records.value[idx] = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update record'
      throw err
    }
  }

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/records/${id}`)
      records.value = records.value.filter(r => r._id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete record'
      throw err
    }
  }

  const getDataset = (record) => {
    if (record.type === 'sale') return record.saleDataset
    if (record.type === 'rent') return record.rentDataset
    if (record.type === 'prop') return record.propDataset
    return null
  }

  return {
    records, loading, error,
    fetchRecords, createRecord, updateRecord, deleteRecord, getDataset
  }
})
