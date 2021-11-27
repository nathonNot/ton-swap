import { useMemo } from 'react';

import './LiquidityInfo.scss';
import { useAppSelector } from 'store/hooks';
import { selectLiquidityPool, selectLiquidityInput0, selectLiquidityInput1 } from 'store/liquidity/liquidity.slice';
import TokenUtils from 'utils/tokenUtils';

function LiquidityInfo() {
    const input0 = useAppSelector(selectLiquidityInput0);
    const input1 = useAppSelector(selectLiquidityInput1);
    const pool = useAppSelector(selectLiquidityPool);

    const token0PerToken1Display = useMemo(() => {
        if (!TokenUtils.isFilled(input0) || !TokenUtils.isFilled(input1)) {
            return;
        }
        return TokenUtils.getDisplayRate(input0, input1);
    }, [input0, input1]);

    const token1PerToken0Display = useMemo(() => {
        if (!TokenUtils.isFilled(input0) || !TokenUtils.isFilled(input1)) {
            return;
        }
        return TokenUtils.getDisplayRate(input1, input0);
    }, [input0, input1]);

    const shareDisplay = useMemo(() => {
        if (!pool.amount) {
            return '0%';
        }
        const result = pool.amount.multipliedBy('100').div(pool.overallAmount!).precision(2);
        if (result.lt('0.01')) {
            return '<0.01%';
        }
        return `${result.toFixed()}%`;
    }, [pool]);

    return (
        <div className="liquidity-info-wrapper">
            <span>Prices and pool share</span>
            <div className="liquidity-price-wrapper">
                <div className="liquidity-price">
                    <div className="text-semibold">
                        {token1PerToken0Display}
                    </div>
                    <div className="text-small">
                        {input1.token?.symbol} per {input0.token?.symbol}
                    </div>
                </div>
                <div className="liquidity-price">
                    <div className="text-semibold">
                        {token0PerToken1Display}
                    </div>
                    <div className="text-small">
                        {input0.token?.symbol} per {input1.token?.symbol}
                    </div>
                </div>
                <div className="liquidity-price">
                    <div className="text-semibold">
                        {shareDisplay}
                    </div>
                    <div className="text-small">
                        Share of Pool
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiquidityInfo;
