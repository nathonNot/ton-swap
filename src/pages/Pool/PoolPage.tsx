import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './PoolPage.scss';
import SettingsIcon from 'components/icons/SettingsIcon';
import Settings from 'components/Settings';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { selectWalletAdapter } from 'store/wallet/walletSlice';
import { getPoolPools } from 'store/pool/poolThunks';
import { selectPoolPools } from 'store/pool/poolSlice';
import Accordion from 'components/Accordion';
import TokenUtils from 'utils/tokenUtils';
import TokenIcon from 'components/TokenIcon';
import QuestionIcon from 'components/icons/QuestionIcon';
import Tooltip from 'components/Tooltip';
import BigNumber from 'bignumber.js';


function PoolPage() {
    const dispatch = useAppDispatch();
    const [showSettings, setShowSettings] = useState(false);
    const walletAdapter = useAppSelector(selectWalletAdapter);
    const pools = useAppSelector(selectPoolPools);

    useEffect(() => {
        dispatch(getPoolPools());
    }, [dispatch])

    return (
        <div className="pool-wrapper">
            <div className="pool-header-wrapper">
                <div className="pool-header">
                    <div className="text-semibold">
                        Your Liquidity
                        <Tooltip content={<span className="text-small">When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.</span>}
                                 direction="bottom">
                            <div className="btn-icon">
                                <QuestionIcon />
                            </div>
                        </Tooltip>
                    </div>
                    <span className="text-small">Remove liquidity to receive tokens back</span>
                </div>
                <div className="btn-icon" onClick={() => setShowSettings(!showSettings)}>
                    <SettingsIcon/>
                </div>
            </div>
            <div className="pool-list-wrapper">
                {
                    !walletAdapter && <span>
                      Connect to a wallet to view your liquidity.
                    </span>
                }
                {
                    walletAdapter && pools.length === 0 && <span>
                      No liquidity found.
                    </span>
                }
                {
                    walletAdapter && pools.length > 0 && (
                        <Accordion panels={pools.map((pool, index) => {
                            const share = new BigNumber(pool.pool.amount).multipliedBy('100').div(pool.pool.overallAmount).precision(2);
                            const shareText = share.lt('0.01') ? '<0.01%' : `${share.toFixed()}%`;

                            return {
                                label: (
                                    <div key={index} className="pool-item-wrapper">
                                        <div>
                                            <TokenIcon address={pool.input0.token.address} name={pool.input0.token.name}/>
                                            <TokenIcon address={pool.input1.token.address} name={pool.input1.token.name}/>
                                        </div>
                                        <span>{pool.input0.token.symbol}/{pool.input1.token.symbol}</span>
                                    </div>
                                ),
                                content: (
                                    <div key={index} className="pool-item-details-wrapper">
                                        <div>
                                            <div>Pooled {pool.input0.token.symbol}</div>
                                            <div>
                                                {TokenUtils.getDisplay(pool.input0)}
                                                <TokenIcon address={pool.input0.token.address}
                                                           name={pool.input0.token.name}
                                                           size={'small'}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div>Pooled {pool.input1.token.symbol}</div>
                                            <div>
                                                {TokenUtils.getDisplay(pool.input1)}
                                                <TokenIcon address={pool.input1.token.address}
                                                           name={pool.input1.token.name}
                                                           size={'small'}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div>Your pool tokens</div>
                                            <div>{TokenUtils.getDisplay(pool.pool)}</div>
                                        </div>
                                        <div>
                                            <div>Your pool share</div>
                                            <div>{shareText}</div>
                                        </div>
                                        <div>
                                            <Link className="btn btn-primary" to={`add/${pool.input0.token.symbol}/${pool.input1.token.symbol}`}>
                                                Add
                                            </Link>
                                            <Link className="btn btn-primary" to={`remove/${pool.input0.token.symbol}/${pool.input1.token.symbol}`}>
                                                Remove
                                            </Link>
                                        </div>
                                    </div>
                                )
                            }
                        })} />
                    )
                }
            </div>
            <Link className="btn btn-primary" to="add">
                Add Liquidity
            </Link>
            <div className="import-pool">
                <span>Don't see a pool you joined?</span>
                <Link className="btn btn-outline" to="import">
                    Import Pool
                </Link>
            </div>
            {
                showSettings && <Settings onClose={() => setShowSettings(false)}/>
            }
        </div>
    )
}

export default PoolPage;