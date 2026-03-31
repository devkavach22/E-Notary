import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchData = createAsyncThunk('example/fetchData', async () => {
  const res = await fetch('https://api.example.com/data')
  return res.json()
})

const exampleSlice = createSlice({
  name: 'example',
  initialState: { data: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => { state.status = 'loading' })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default exampleSlice.reducer
