import { configureStore } from '@reduxjs/toolkit'
import customersReducer from './customersSlice'
import employeesReducer from './employeesSlice'
import servicesReducer from './servicesSlice'
import toolsReducer from './toolsSlice'
import workOrdersSlice from './workOrdersSlice'

export const store = configureStore({
    reducer: {
        customers: customersReducer,
        employees: employeesReducer,
        services: servicesReducer,
        tools: toolsReducer,
        workOrders: workOrdersSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
