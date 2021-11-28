import { useCallback, useMemo } from 'react';

import './AddLiquidityConfirm.scss';
import LiquidityInfo from './LiquidityInfo';
import Modal from 'components/Modal';
import TokenInput from 'components/TokenInput';
import Spinner from 'components/Spinner';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
    resetLiquidity,
    selectLiquidityPool,
    selectLiquidityInput0,
    selectLiquidityInput1,
} from 'store/liquidity/liquiditySlice';
import { resetTransaction, selectWalletTransaction } from 'store/wallet/walletSlice';
import { walletAddLiquidity } from 'store/wallet/walletThunks';
import { selectSettings } from 'store/app/appSlice';
import { DEFAULT_SLIPPAGE } from 'constants/swap';
import { TxStatus } from 'types/transactionInterfaces';
import TokenUtils from 'utils/tokenUtils';

function AddLiquidityConfirm({onClose}: any) {
    const dispatch = useAppDispatch();
    const input0 = useAppSelector(selectLiquidityInput0);
    const input1 = useAppSelector(selectLiquidityInput1);
    const pool = useAppSelector(selectLiquidityPool);
    const settings = useAppSelector(selectSettings);
    const walletTransaction = useAppSelector(selectWalletTransaction);

    const modalClassName = useMemo(() => {
        return walletTransaction.status !== TxStatus.INITIAL ? 'add-liquidity-confirm-modal mini' : 'add-liquidity-confirm-modal';
    }, [walletTransaction]);

    const token0Display = useMemo(() => {
        return TokenUtils.getDisplay(input0);
    }, [input0]);

    const token1Display = useMemo(() => {
        return TokenUtils.getDisplay(input1);
    }, [input1]);

    const poolDisplay = useMemo(() => {
        return TokenUtils.getDisplay(pool);
    }, [pool]);


    const handleConfirmSupply = useCallback(() => {
        dispatch(walletAddLiquidity());
    }, [dispatch]);

    const handleClose = useCallback(() => {
        dispatch(resetTransaction());
        if (walletTransaction.status === TxStatus.CONFIRMED) {
            dispatch(resetLiquidity());
        }
        onClose && onClose();
    }, [dispatch, walletTransaction, onClose]);

    return (
        <Modal className={modalClassName} onClose={handleClose}>
            {
                walletTransaction.status === TxStatus.INITIAL && <>
                  <h4>Confirm Supply</h4>
                  <div className="add-liquidity-confirm-wrapper">
                    <TokenInput token={input0.token}
                                value={input0.amount}
                                showMax={true}
                                selectable={false}
                                editable={false}
                    />
                    <div className="btn-icon">
                      +
                    </div>
                    <TokenInput token={input1.token}
                                value={input1.amount}
                                showMax={false}
                                selectable={false}
                                editable={false}
                    />
                    <LiquidityInfo/>
                    <div className="pool-tokens-info">
                      <span>You will receive </span>
                      <span className="text-semibold">{poolDisplay}</span>
                      <span> {input0.token!.symbol}/{input1.token!.symbol} Pool Tokens</span>
                    </div>
                      {
                          <span className="help-text text-small">
                              Output is estimated. If the price changes by more than {settings.slippage || DEFAULT_SLIPPAGE}% your transaction will revert.
                          </span>
                      }
                    <button className="btn btn-primary supply__btn"
                            onClick={handleConfirmSupply}>
                      Confirm Supply
                    </button>
                  </div>
                </>
            }
            {
                walletTransaction.status === TxStatus.PENDING && <>
                    <div className="add-liquidity-confirm-wrapper">
                      <div className="add-liquidity-status">
                        <Spinner />
                        <span>
                            Supplying {token0Display} {input0.token!.symbol} and {token1Display} {input1.token!.symbol}
                        </span>
                        <span className="text-small">
                          Confirm this transaction in your wallet
                        </span>
                      </div>
                    </div>
                </>
            }
            {
                walletTransaction.status === TxStatus.CONFIRMED && <>
                  <div className="add-liquidity-confirm-wrapper">
                    <div className="add-liquidity-status">
                      <h2 className="text-semibold">
                        Transaction submitted
                      </h2>
                      <a>View on Explorer</a>
                      <button className="btn btn-primary"
                              onClick={handleClose}>
                        Close
                      </button>
                    </div>
                  </div>
                </>
            }
            {
                walletTransaction.status === TxStatus.REJECTED && <>
                  <h4 className="text-error">Error</h4>
                  <div className="add-liquidity-confirm-wrapper">
                    <div className="add-liquidity-status">
                      <h2 className="text-semibold text-error">
                        Transaction rejected
                      </h2>
                      <button className="btn btn-primary"
                              onClick={handleClose}>
                        Dismiss
                      </button>
                    </div>
                  </div>
                </>
            }
        </Modal>
    )
}

export default AddLiquidityConfirm;
