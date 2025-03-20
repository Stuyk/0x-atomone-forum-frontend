import { reactive } from 'vue';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import { coins, SigningStargateClient } from '@cosmjs/stargate';

import chainInfo from '../chain-config.json';
import forumInfo from '../forum-config.json';

export interface WalletState {
    address: string | null;
    signer: OfflineSigner | null;
    type: 'keplr';
}

const state = reactive<WalletState>({
    address: null,
    signer: null,
    type: 'keplr',
});

async function invokeAction(formattedMemo: string) {
    if (!state.address) {
        throw new Error('No Wallet Connected');
    }

    if (!state.signer) {
        throw new Error('No Signer Available');
    }

    try {
        const client = await SigningStargateClient.connectWithSigner(chainInfo.rpc, state.signer);
        const simulate = await client.simulate(
            state.address,
            [
                {
                    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                    value: {
                        fromAddress: state.address,
                        toAddress: forumInfo.owner,
                        amount: coins(1, chainInfo.feeCurrencies[0].coinMinimalDenom),
                    },
                },
            ],
            formattedMemo
        );

        const gasLimit = simulate && simulate > 0 ? '' + Math.ceil(simulate * 2.0) : '500000';
        const result = await client.sendTokens(
            state.address, // From
            forumInfo.owner, // To
            [{ amount: '1', denom: chainInfo.feeCurrencies[0].coinMinimalDenom }], // Amount
            { amount: [{ amount: '10000', denom: chainInfo.feeCurrencies[0].coinMinimalDenom }], gas: gasLimit }, // Gas
            formattedMemo
        );

        return result;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function refreshKeplrAddress() {
    if (!window.getOfflineSignerOnlyAmino) {
        throw new Error('Could not connect to Keplr: getOfflineSigner method does not exist');
    }

    const accounts = await window.getOfflineSignerOnlyAmino(chainInfo.chainId).getAccounts();
    state.address = accounts[0].address;
}

async function handleConnectKeplr() {
    if (!window.keplr) {
        throw new Error(`Keplr is not installed`);
    }

    try {
        await window.keplr?.experimentalSuggestChain(chainInfo);
        await window.keplr?.enable(chainInfo.chainId);
        if (!window.getOfflineSignerOnlyAmino) {
            throw new Error('Could not connect to Keplr: getOfflineSigner method does not exist');
        }

        await refreshKeplrAddress();
        state.signer = window.getOfflineSignerOnlyAmino(chainInfo.chainId);
        state.type = 'keplr';
    } catch (e) {
        throw new Error('Could not connect to Keplr: ' + e);
    }
}

export function useWallet() {
    const connect = async () => {
        handleConnectKeplr();
    };

    const disconnect = async () => {
        state.signer = null;
        state.address = null;
    };

    const refreshAddress = () => {
        if (state.type === 'keplr') {
            refreshKeplrAddress();
        }
    };

    // Action 0
    const actionCreateThread = async (title: string, content: string) => {
        if (title.length <= 0) {
            throw new Error('Title must be at least 1 length');
        }

        if (content.length <= 0) {
            throw new Error('Thread hash must be at least 1 length');
        }

        if (!state.address) {
            throw new Error('No Wallet Connected');
        }

        if (!state.signer) {
            throw new Error('No Signer Available');
        }

        const params = new URLSearchParams();
        params.append('a', '0');
        params.append('t', title);
        params.append('c', content);
        return await invokeAction(`0xForum?${params.toString()}`);
    };

    // Action 1
    const actionReply = async (threadHash: string, content: string) => {
        if (content.length <= 0) {
            throw new Error('Content must be at least 1 length');
        }

        if (threadHash.length !== 64) {
            throw new Error('Thread hash must be 64 length');
        }

        if (!state.address) {
            throw new Error('No Wallet Connected');
        }

        if (!state.signer) {
            throw new Error('No Signer Available');
        }

        // Reply Action
        const params = new URLSearchParams();
        params.append('a', '1');
        params.append('th', threadHash);
        params.append('c', content);
        return await invokeAction(`0xForum?${params.toString()}`);
    };

    // Action 2
    const actionRemoveMessage = async (threadHash: string, msgHash: string) => {
        if (threadHash.length !== 64) {
            throw new Error('Thread hash must be 64 length');
        }

        if (msgHash.length !== 64) {
            throw new Error('MsgHash must be 64 length');
        }

        if (!state.address) {
            throw new Error('No Wallet Connected');
        }

        if (!state.signer) {
            throw new Error('No Signer Available');
        }

        // Reply Action
        const params = new URLSearchParams();
        params.append('a', '2');
        params.append('th', threadHash);
        params.append('mh', msgHash);
        return await invokeAction(`0xForum?${params.toString()}`);
    };

    // Action 3
    const actionRemoveThread = async (threadHash: string) => {
        if (threadHash.length !== 64) {
            throw new Error('Thread hash must be 64 length');
        }

        if (!state.address) {
            throw new Error('No Wallet Connected');
        }

        if (!state.signer) {
            throw new Error('No Signer Available');
        }

        // Reply Action
        const params = new URLSearchParams();
        params.append('a', '3');
        params.append('th', threadHash);
        return await invokeAction(`0xForum?${params.toString()}`);
    };

    // Action 6
    const actionUpvoteMessage = async (threadHash: string, messageHash: string) => {
        if (threadHash.length !== 64) {
            throw new Error('Thread hash must be 64 length');
        }

        if (messageHash.length !== 64) {
            throw new Error('Message hash must be 64 length');
        }

        if (!state.address) {
            throw new Error('No Wallet Connected');
        }

        if (!state.signer) {
            throw new Error('No Signer Available');
        }

        // Reply Action
        const params = new URLSearchParams();
        params.append('a', '6');
        params.append('th', threadHash);
        params.append('mh', messageHash);
        return await invokeAction(`0xForum?${params.toString()}`);
    };

    window.addEventListener('keplr_keystorechange', refreshAddress);

    return {
        actionCreateThread,
        actionReply,
        actionRemoveMessage, 
        actionRemoveThread,
        actionUpvoteMessage,
        connect,
        disconnect,
        state,
    };
}
