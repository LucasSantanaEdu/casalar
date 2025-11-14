import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Service {
    id?: string
    description: string
    estimatedDuration: string
    cost: number
    startDate?: string 
    notes?: string
}

interface ServicesState {
    data: Service[]
    loading: boolean
    error: string | null
}

const initialState: ServicesState = {
    data: [],
    loading: false,
    error: null
}

// --- Async Thunks ---

// Fetch all services
export const fetchServices = createAsyncThunk('services/fetchAll', async () => {
    const res = await fetch('/api/services')
    return (await res.json()) as Service[]
})

// Create a new service
export const createService = createAsyncThunk('services/create', async (service: Service) => {
    const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
    })
    return (await res.json()) as Service
})

// Update a service
export const updateService = createAsyncThunk('services/update', async (service: Service) => {
    const res = await fetch('/api/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
    })
    return (await res.json()) as Service
})

// Delete a service
export const deleteService = createAsyncThunk('services/delete', async (id: string) => {
    await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    return id
})

// --- Slice ---

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // Fetch
            .addCase(fetchServices.pending, state => {
                state.loading = true
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || null
            })
            // Create
            .addCase(createService.fulfilled, (state, action) => {
                state.data.push(action.payload)
            })
            // Update
            .addCase(updateService.fulfilled, (state, action) => {
                const index = state.data.findIndex(s => s.id === action.payload.id)
                if (index !== -1) state.data[index] = action.payload
            })
            // Delete
            .addCase(deleteService.fulfilled, (state, action) => {
                state.data = state.data.filter(s => s.id !== action.payload)
            })
    }
})

export default servicesSlice.reducer
