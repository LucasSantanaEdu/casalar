import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Employee {
    id?: string
    name: string
    role: string
    availability: string
    email?: string
    phone?: string
}

interface EmployeesState {
    data: Employee[]
    loading: boolean
    error: string | null
}

const initialState: EmployeesState = {
    data: [],
    loading: false,
    error: null
}

// --- Async Thunks (operações assíncronas) ---

// Fetch all employees
export const fetchEmployees = createAsyncThunk('employees/fetchAll', async () => {
    const res = await fetch('/api/employees')
    return (await res.json()) as Employee[]
})

// Create a new employee
export const createEmployee = createAsyncThunk('employees/create', async (employee: Employee) => {
    const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
    })
    return (await res.json()) as Employee
})

// Update an existing employee
export const updateEmployee = createAsyncThunk('employees/update', async (employee: Employee) => {
    const res = await fetch('/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
    })
    return (await res.json()) as Employee
})

// Delete an employee
export const deleteEmployee = createAsyncThunk('employees/delete', async (id: string) => {
    await fetch('/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    return id
})

// --- Slice ---

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // Fetch all
            .addCase(fetchEmployees.pending, state => {
                state.loading = true
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || null
            })
            // Create
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.data.push(action.payload)
            })
            // Update
            .addCase(updateEmployee.fulfilled, (state, action) => {
                const index = state.data.findIndex(e => e.id === action.payload.id)
                if (index !== -1) state.data[index] = action.payload
            })
            // Delete
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.data = state.data.filter(e => e.id !== action.payload)
            })
    }
})

export default employeesSlice.reducer
