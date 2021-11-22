import BigNumber from 'bignumber.js';
import { SwapTransactionRequestInterface } from 'interfaces/swap-transaction-request.interface';
import { SwapTransactionInterface } from 'interfaces/swap-transaction.interface';
import { SwapTypes } from 'interfaces/swap.types';


class SwapService {
    getTransactionEstimation(data: SwapTransactionRequestInterface): Promise<SwapTransactionInterface> {
        // TODO: Implement real api for transaction estimation
        return Promise.resolve({
            amount: data.type === SwapTypes.EXACT_IN ? data.from!.amount! : data.to!.amount!,
            quote: data.type === SwapTypes.EXACT_IN ? data.from!.amount! : data.to!.amount!,
            type: data.type,
            fee: new BigNumber('0.003'),
        });
    }

    getPriceImpact(data: SwapTransactionRequestInterface, transaction: SwapTransactionInterface): Promise<BigNumber> {
        // TODO: Implement real api for estimate price impact
        return Promise.resolve(new BigNumber('2.00'));
    }

    checkLiquidity(data: SwapTransactionRequestInterface, transaction: SwapTransactionInterface): Promise<boolean> {
        // TODO: Implement real api for estimate transaction liquidity
        return Promise.resolve(true);
    }
}

export default SwapService