import TokenInterface from './token.interface';
import BigNumber from 'bignumber.js';

export interface InputTokenInterface {
    token?: TokenInterface;
    amount?: BigNumber;
}
