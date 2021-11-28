import { createAsyncThunk } from '@reduxjs/toolkit';

import { SwapTradeRequestInterface } from 'types/swapTradeRequestInterface';
import SmartContractsService from 'api/smartContractsService';
import { EstimateTxType } from 'types/transactionInterfaces';
import PromiseUtils from 'utils/promiseUtils';
import { SwapTradeInterface } from 'types/swapTradeInterface';
import { RootState } from 'store/store';

const swapService = new SmartContractsService();

let previousPromise: any = null;

export const estimateTransaction = createAsyncThunk(
    'swap/estimate',
    async (data: SwapTradeRequestInterface, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        if (previousPromise) {
            previousPromise.cancel();
        }
        const getTradePromise = PromiseUtils.makeCancelable<SwapTradeInterface>(swapService.getTrade(data, state.app.settings));
        previousPromise = getTradePromise;
        const transaction = await getTradePromise.promise;
        return {
            fromAmount: transaction.txType === EstimateTxType.EXACT_IN ? transaction.amount : transaction.quote,
            toAmount: transaction.txType === EstimateTxType.EXACT_IN ? transaction.quote : transaction.amount,
            type: data.txType,
            trade: transaction.trade,
        }
    }
);