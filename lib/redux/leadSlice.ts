// lib/redux/leadSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  visas: string;
  resume: string;
  openInput: string;
  status: 'PENDING' | 'REACHED_OUT';
}

interface LeadState {
  leads: Lead[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeadState = {
  leads: [],
  status: 'idle',
  error: null,
};

export const fetchLeads = createAsyncThunk('leads/fetchLeads', async () => {
  const response = await fetch('/api/leads');
  return response.json();
});

export const updateLeadStatus = createAsyncThunk(
  'leads/updateLeadStatus',
  async ({ id, status }: { id: string; status: 'PENDING' | 'REACHED_OUT' }) => {
    const response = await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.status = 'succeeded';
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateLeadStatus.fulfilled, (state, action: PayloadAction<Lead>) => {
        const index = state.leads.findIndex((lead) => lead.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      });
  },
});

export default leadSlice.reducer;