import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface Tool {
    id?: string
    name: string
    type: string
    availability: string
    condition?: string
    notes?: string
}

interface ToolsState {
    data: Tool[]
    loading: boolean
    error: string | null
}

const initialState: ToolsState = {
    data: [],
    loading: false,
    error: null
}

// --- Async Thunks ---

export const fetchTools = createAsyncThunk('tools/fetchAll', async () => {
    const res = await fetch('/api/tools')
    const data = await res.json()
    return data as Tool[]
})

export const createTool = createAsyncThunk('tools/create', async (tool: Tool) => {
    const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool)
    })
    const data = await res.json()
    return data as Tool
})

export const updateTool = createAsyncThunk('tools/update', async (tool: Tool & { id: string }) => {
    const res = await fetch('/api/tools', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tool)
    })
    const data = await res.json()
    return data as Tool
})

export const deleteTool = createAsyncThunk('tools/delete', async (id: string) => {
    const res = await fetch('/api/tools', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    const data = await res.json()
    return data.id
})

// --- Slice ---
const toolsSlice = createSlice({
    name: 'tools',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTools.pending, state => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchTools.fulfilled, (state, action) => {
                state.loading = false
                state.data = action.payload || [] // garante array
            })
            .addCase(fetchTools.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to fetch tools'
            })
            .addCase(createTool.fulfilled, (state, action) => {
                state.data.push(action.payload)
            })
            .addCase(updateTool.fulfilled, (state, action) => {
                const index = state.data.findIndex(t => t.id === action.payload.id)
                if (index !== -1) state.data[index] = action.payload
            })
            .addCase(deleteTool.fulfilled, (state, action) => {
                state.data = state.data.filter(t => t.id !== action.payload)
            })
    }
})

export default toolsSlice.reducer
