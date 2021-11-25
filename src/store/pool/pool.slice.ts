import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from 'store/store'
import { getPoolPools } from './pool.thunks';
import PoolInterface from '../../interfaces/poolInterface';

interface PoolState {
    pools: PoolInterface[],
}

const initialState: PoolState = {
    pools: [],
}

export const poolSlice = createSlice({
    name: 'pool',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getPoolPools.fulfilled, (state, action) => {
            state.pools = action.payload;
        })
    },
})

export const {  } = poolSlice.actions

export const selectPoolPools = (state: RootState) => state.pool.pools;

export default poolSlice.reducer;