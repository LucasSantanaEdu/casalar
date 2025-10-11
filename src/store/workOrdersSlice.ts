import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface WorkOrder {
    id?: string
    customerId: string
    employees: string[]
    services: string[]
    tools: string[]
    startDate?: string
    endDate?: string
    status: 'Pending' | 'In Progress' | 'Completed'
    notes?: string
    createdAt?: string
    updatedAt?: string
}

interface WorkOrdersState {
    data: WorkOrder[]
    loading: boolean
    error: string | null
}

const initialState: WorkOrdersState = {
    data: [],
    loading: false,
    error: null
}

// --- Async Thunks ---

// Fetch all work orders
export const fetchWorkOrders = createAsyncThunk('workOrders/fetchAll', async () => {
    const res = await fetch('/api/work-orders')
    return (await res.json()) as WorkOrder[]
})

// Create a new work order
export const createWorkOrder = createAsyncThunk('workOrders/create', async (workOrder: WorkOrder) => {
    const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workOrder)
    })
    return (await res.json()) as WorkOrder
})

// Update a work order
export const updateWorkOrder = createAsyncThunk('workOrders/update', async (workOrder: WorkOrder) => {
    const res = await fetch('/api/work-orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workOrder)
    })
    return (await res.json()) as WorkOrder
})

// Delete a work order
export const deleteWorkOrder = createAsyncThunk('workOrders/delete', async (id: string) => {
    await fetch('/api/work-orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    return id
})

// --- Slice ---

const workOrdersSlice = createSlice({
    name: 'workOrders',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // Fetch
            .addCase(fetchWorkOrders.pending, state => {
                state.loading = true
            })
            .addCase(fetchWorkOrders.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchWorkOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || null
            })
            // Create
            .addCase(createWorkOrder.fulfilled, (state, action) => {
                state.data.push(action.payload)
            })
            // Update
            .addCase(updateWorkOrder.fulfilled, (state, action) => {
                const index = state.data.findIndex(w => w.id === action.payload.id)
                if (index !== -1) state.data[index] = action.payload
            })
            // Delete
            .addCase(deleteWorkOrder.fulfilled, (state, action) => {
                state.data = state.data.filter(w => w.id !== action.payload)
            })
    }
})

export default workOrdersSlice.reducer
