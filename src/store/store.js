import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import advocateReducer from './slices/advocateSlice'
import caseReducer from './slices/caseSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    advocate: advocateReducer,
    case: caseReducer,
  },
})
