import { useCallback, useMemo } from 'react';

import './RemoveLiquidityConfirm.scss';
import Modal from 'components/Modal';
import TokenInput from 'components/TokenInput';
import LiquidityInfo from './LiquidityInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
    resetLiquidity,
    selectLiquidityPool,
    selectLiquidityOne,
    selectLiquidityTwo,
} from 'store/liquidity/liquidity.slice';
import { resetTransaction, selectWalletTransaction } from 'store/wallet/wallet.slice';
import { DEFAULT_SLIPPAGE, TOKEN_PRECISION } from 'constants/swap';
import { WalletTxStatus } from 'interfaces/transactionInterfaces';
import {  walletRemoveLiquidity } from 'store/wallet/wallet.thunks';
import Spinner from 'components/Spinner';
import { selectSettings } from 'store/app/app.slice';
import TokenUtils from 'utils/tokenUtils';

function RemoveLiquidityConfirm({onClose}: any) {
    const dispatch = useAppDispatch();
    const one = useAppSelector(selectLiquidityOne);
    const two = useAppSelector(selectLiquidityTwo);
    const pool = useAppSelector(selectLiquidityPool);
    const settings = useAppSelector(selectSettings);
    const walletTransaction = useAppSelector(selectWalletTransaction);

    const className = useMemo(() => {
        return walletTransaction.status !== WalletTxStatus.INITIAL ? 'remove-liquidity-confirm-modal mini' : 'remove-liquidity-confirm-modal';
    }, [walletTransaction]);

    const oneRemoveDisplay = useMemo(() => {
        return TokenUtils.getRemoveDisplay(one);
    }, [one]);

    const twoRemoveDisplay = useMemo(() => {
        return TokenUtils.getRemoveDisplay(two);
    }, [two]);

    const poolRemoveDisplay = useMemo(() => {
        return TokenUtils.getRemoveDisplay(pool)
    }, [pool]);

    const handleConfirmRemove = useCallback(() => {
        dispatch(walletRemoveLiquidity());
    }, [dispatch]);

    const handleClose = useCallback(() => {
        dispatch(resetTransaction());
        if (walletTransaction.status === WalletTxStatus.CONFIRMED) {
            dispatch(resetLiquidity());
        }
        onClose && onClose();
    }, [dispatch, walletTransaction, onClose]);

    return (
        <Modal className={className} onClose={handleClose}>
            {
                walletTransaction.status === WalletTxStatus.INITIAL && <>
                  <h4>Confirm Remove Liquidity</h4>
                  <div className="remove-liquidity-confirm-wrapper">
                    <span>You will receive</span>
                    <TokenInput token={one.token}
                                value={one.removeAmount}
                                showMax={true}
                                selectable={false}
                                editable={false}
                    />
                    <div className="btn-icon">
                      +
                    </div>
                    <TokenInput token={two.token}
                                value={two.removeAmount}
                                showMax={false}
                                selectable={false}
                                editable={false}
                    />
                    <LiquidityInfo/>
                    <div className="pool-tokens-info">
                      <span>You will burn </span>
                      <span className="text-semibold">{poolRemoveDisplay}</span>
                      <span> {one.token.symbol}/{two.token.symbol} Pool Tokens</span>
                    </div>
                      {
                          <span className="help-text text-small">
                              Output is estimated. If the price changes by more than {settings.slippage || DEFAULT_SLIPPAGE}% your transaction will revert.
                          </span>
                      }
                    <button className="btn btn-primary remove__btn"
                            onClick={handleConfirmRemove}>
                      Confirm Remove Liquidity
                    </button>
                  </div>
                </>
            }
            {
                walletTransaction.status === WalletTxStatus.PENDING && <>
                    <div className="remove-liquidity-confirm-wrapper">
                      <div className="remove-liquidity-status">
                        <Spinner />
                        <span>
                            Removing {oneRemoveDisplay} {one.token.symbol} and {twoRemoveDisplay} {two.token.symbol}
                        </span>
                        <span className="text-small">
                          Confirm this transaction in your wallet
                        </span>
                      </div>
                    </div>
                </>
            }
            {
                walletTransaction.status === WalletTxStatus.CONFIRMED && <>
                  <div className="remove-liquidity-confirm-wrapper">
                    <div className="remove-liquidity-status">
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
                walletTransaction.status === WalletTxStatus.REJECTED && <>
                  <h4 className="text-error">Error</h4>
                  <div className="remove-liquidity-confirm-wrapper">
                    <div className="remove-liquidity-status">
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

export default RemoveLiquidityConfirm;