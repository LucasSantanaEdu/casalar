import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Customer {
    id?: string
    name: string
    address: string
    contact: string
}

interface CustomersState {
    data: Customer[]
    loading: boolean
    error: string | null
}

const initialState: CustomersState = {
    data: [],
    loading: false,
    error: null
}

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async () => {
    const res = await fetch('/api/customers')
    return (await res.json()) as Customer[]
})

export const createCustomer = createAsyncThunk('customers/create', async (customer: Customer) => {
    const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    })
    return (await res.json()) as Customer
})

export const updateCustomer = createAsyncThunk('customers/update', async (customer: Customer) => {
    const res = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    })
    return (await res.json()) as Customer
})

export const deleteCustomer = createAsyncThunk('customers/delete', async (id: string) => {
    await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    return id
})

const customersSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchCustomers.pending, state => {
                state.loading = true
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || null
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.data.push(action.payload)
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const index = state.data.findIndex(c => c.id === action.payload.id)
                if (index !== -1) state.data[index] = action.payload
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.data = state.data.filter(c => c.id !== action.payload)
            })
    }
})

export default customersSlice.reducer
