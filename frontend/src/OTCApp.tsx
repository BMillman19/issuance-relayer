/* tslint:disable */
import * as React from 'react';
import * as Web3 from 'web3';
import BigNumber from 'bignumber.js';
import SetProtocol from 'setprotocol.js';
import { IssuanceOrder, SignedIssuanceOrder, TakerWalletOrder, ZeroExSignedFillOrder } from 'setprotocol.js';
import { assetDataUtils, orderHashUtils, signatureUtils } from '0x.js';
import { Form } from 'semantic-ui-react';
import { Order, SignerType, SignedOrder } from '@0xproject/types';
/* tslint:enable */

// By default BigNumber's `toString` method converts to exponential notation if the value has
// more then 20 digits. We want to avoid this behavior, so we set EXPONENTIAL_AT to a high number
BigNumber.config({
    EXPONENTIAL_AT: 1000,
});

import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface IAppProps {
    readonly submitDisabled: boolean;
    readonly submitFunc: () => void;
    readonly submitText: string;
    readonly title: string;
    readonly displayData: any;
}

class ActionBox extends React.Component<IAppProps, {}> {
    public render() {
        const { submitDisabled, submitFunc, submitText, title, displayData } = this.props;

        return (
            <div style={{ borderWidth: '2px', borderStyle: 'solid', padding: '10px' }}>
                <h1 className="App-intro">{title}</h1>
                <Form onSubmit={submitFunc}>
                    {Object.keys(displayData).map((key, index) => {
                        return (
                            <React.Fragment key={key}>
                                <u>{key}</u>
                                <br />
                                {displayData[key]}
                                <br />
                                <br />
                            </React.Fragment>
                        );
                    })}
                    <input disabled={submitDisabled} className="button" type="submit" value={submitText} />
                </Form>
            </div>
        );
    }
}

interface IAppState {
    readonly coreAddress: string;
    readonly daiAddress: string;
    readonly daiAllowance: BigNumber;
    readonly daiBalance: BigNumber;
    readonly daiUnits: BigNumber;
    readonly erc20Proxy: string;
    readonly exchange: string;
    readonly isKovan: boolean;
    readonly issueInput: string;
    readonly issueQuantity: BigNumber;
    readonly naturalUnit: BigNumber;
    readonly pendingCreation: boolean;
    readonly pendingIssue: boolean;
    readonly pendingRedeem: boolean;
    readonly redeemQuantity: BigNumber;
    readonly setName: string;
    readonly setProtocol: any;
    readonly setSymbol: string;
    readonly setTokenAddress: string;
    readonly setTokenBalance: BigNumber;
    readonly setTokenFactoryAddress: string;
    readonly signedOrder: SignedIssuanceOrder | undefined;
    readonly transferProxyAddress: string;
    readonly trueUsdAddress: string;
    readonly trueUsdAllowance: BigNumber;
    readonly trueUsdBalance: BigNumber;
    readonly trueUsdUnits: BigNumber;
    readonly validIssueQuantity: boolean | undefined;
    readonly validRedeemQuantity: boolean | undefined;
    readonly vaultAddress: string;
    readonly web3Instance: any;
    readonly wethAddress: string;
    readonly wethAllowance: BigNumber;
}

declare global {
    // tslint:disable-next-line
    interface Window {
        web3: any;
    }
}

class App extends React.Component<{}, IAppState> {
    constructor(props: object) {
        super(props);
        const isKovan = true;
        this.state = {
            coreAddress: isKovan
                ? '0x29f13822ece62b7a436a45903ce6d5c97d6e4cc9'
                : '0xcdb56f7d7ca4c53b507af0499abd683df283256a',
            daiAddress: isKovan
                ? '0x1d82471142F0aeEEc9FC375fC975629056c26ceE'
                : '0x4b34bb7e210f5a462e8cd2d92555d1bd18d03bf2',
            daiAllowance: new BigNumber(0),
            daiBalance: new BigNumber(0),
            daiUnits: new BigNumber(5),
            erc20Proxy: isKovan ? '0x5bc0de240e1c1b211538ca077a82bb39f4179087' : SetProtocol.NULL_ADDRESS,
            exchange: isKovan ? '0xb65619b82c4d385de0c5b4005452c2fdee0f86d1' : SetProtocol.NULL_ADDRESS,
            isKovan,
            issueInput: 'Issue input',
            issueQuantity: new BigNumber(10 ** 18), // Issue 1x StableSet or 10**18 wei
            naturalUnit: new BigNumber(10),
            pendingCreation: false,
            pendingIssue: false,
            pendingRedeem: false,
            redeemQuantity: new BigNumber(10 ** 18),
            setName: 'Stable Set',
            setProtocol: null,
            setSymbol: 'STBL',
            setTokenAddress: isKovan
                ? '0x098dedf3ded7c47fd2da8718b58d849ee5eb42be'
                : '0x47faead5687ca45573d2f52ebcc0bf01cf0b3f99', // Replace with N/A to generate new Set
            setTokenBalance: new BigNumber(0),
            setTokenFactoryAddress: isKovan
                ? '0x6c51d8dad8404dbd91e8ab063d21e85ddec9f626'
                : '0xa41e3f8179622054058486946dc97c46b7c6241f',
            signedOrder: undefined,
            transferProxyAddress: isKovan
                ? '0xd50ddfed470cc13572c5246e71d4cfb4aba73def'
                : '0x85754cb8b4820c3b4cdae4f0ed804f33dd55b238',
            trueUsdAddress: isKovan
                ? '0xAdB015D61F4bEb2A712D237D9d4c5B75BAFEfd7B'
                : '0x32cf71b0fc074385da15f8405b7622d14e3690dd',
            trueUsdAllowance: new BigNumber(0),
            trueUsdBalance: new BigNumber(0),
            trueUsdUnits: new BigNumber(5),
            validIssueQuantity: undefined,
            validRedeemQuantity: undefined,
            vaultAddress: isKovan
                ? '0x014e9b34486cfa13e9a2d87028d38cd98f996c8c'
                : '0x6b6a3941b05dd1c2fd70e6c204d04cf8d5241d26',
            web3Instance: null,
            wethAddress: isKovan
                ? '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
                : '0xc778417e063141139fce010982780140aa0cd5ab',
            wethAllowance: new BigNumber(0),
        };
        this.submitCreate = this.submitCreate.bind(this);
        this.submitIssue = this.submitIssue.bind(this);
        this.submitRedeem = this.submitRedeem.bind(this);
        this.submitCreateIssuanceOrder = this.submitCreateIssuanceOrder.bind(this);
        this.submitFillOrder = this.submitFillOrder.bind(this);
        this.submitFillOrderZeroEx = this.submitFillOrderZeroEx.bind(this);
        this.checkData = this.checkData.bind(this);
        this.getWeb3 = this.getWeb3.bind(this);
        this.getWeb3();
    }

    public async getWeb3() {
        const injectedWeb3 = window.web3 || undefined;
        if (typeof injectedWeb3 !== 'undefined') {
            const provider = await injectedWeb3.currentProvider;
            // Use Mist/MetaMask's provider
            const web3Instance = new Web3(provider);

            const setProtocol = this.getSetProtocol(web3Instance);

            // Check balances and issue quantity validity
            await this.checkData(setProtocol, web3Instance);

            const results = { setProtocol, web3Instance, isKovan: web3Instance.version.network === '42' };
            this.setState(results);
        }
    }

    public async checkData(setProtocol: SetProtocol, web3Instance: Web3) {
        const {
            daiAddress,
            issueQuantity,
            redeemQuantity,
            setTokenAddress,
            transferProxyAddress,
            trueUsdAddress,
            wethAddress,
        } = this.state;

        // We want to check that our issue quantity is a multiple of the natural unit
        let validIssueQuantity;
        let validRedeemQuantity;
        let setTokenBalance;
        if (setTokenAddress !== 'N/A') {
            validIssueQuantity = await setProtocol.setToken.isMultipleOfNaturalUnitAsync(
                setTokenAddress,
                issueQuantity,
            );
            validRedeemQuantity = await setProtocol.setToken.isMultipleOfNaturalUnitAsync(
                setTokenAddress,
                redeemQuantity,
            );
            setTokenBalance = await setProtocol.erc20.getBalanceOfAsync(setTokenAddress, web3Instance.eth.accounts[0]);
        } else {
            validIssueQuantity = undefined;
            validRedeemQuantity = undefined;
            setTokenBalance = new BigNumber(0);
        }

        const daiBalance = await setProtocol.erc20.getBalanceOfAsync(daiAddress, web3Instance.eth.accounts[0]);
        const trueUsdBalance = await setProtocol.erc20.getBalanceOfAsync(trueUsdAddress, web3Instance.eth.accounts[0]);

        const daiAllowance = await setProtocol.erc20.getAllowanceAsync(
            daiAddress,
            web3Instance.eth.accounts[0],
            transferProxyAddress,
        );
        const trueUsdAllowance = await setProtocol.erc20.getAllowanceAsync(
            trueUsdAddress,
            web3Instance.eth.accounts[0],
            transferProxyAddress,
        );

        const wethAllowance = await setProtocol.erc20.getAllowanceAsync(
            wethAddress,
            web3Instance.eth.accounts[0],
            transferProxyAddress,
        );

        this.setState({
            daiAllowance,
            daiBalance,
            setTokenBalance,
            trueUsdAllowance,
            trueUsdBalance,
            validIssueQuantity,
            validRedeemQuantity,
            wethAllowance,
        });
    }

    public getSetProtocol(web3: any) {
        const { coreAddress, setTokenFactoryAddress, transferProxyAddress, vaultAddress } = this.state;

        const setProtocol = new SetProtocol(web3.currentProvider, {
            coreAddress,
            setTokenFactoryAddress,
            transferProxyAddress,
            vaultAddress,
        });
        return setProtocol;
    }

    public async submitCreateIssuanceOrder() {
        const { daiAddress, setProtocol, setTokenAddress, trueUsdAddress, web3Instance, wethAddress } = this.state;

        const ZERO = new BigNumber(0);
        const maker = web3Instance.eth.accounts[0];
        const makerToken = wethAddress;
        const makerTokenAmount = new BigNumber(400000000000000000);
        const quantity = new BigNumber(1000000000000000000);
        const requiredComponents = [daiAddress, trueUsdAddress];
        const requiredComponentAmounts = [new BigNumber(500000000000000000), new BigNumber(500000000000000000)];
        const issuanceOrder: IssuanceOrder = {
            setAddress: setTokenAddress,
            makerAddress: maker,
            makerToken,
            relayerAddress: SetProtocol.NULL_ADDRESS,
            relayerToken: SetProtocol.NULL_ADDRESS,
            quantity,
            makerTokenAmount,
            expiration: setProtocol.orders.generateExpirationTimestamp(180),
            makerRelayerFee: ZERO,
            takerRelayerFee: ZERO,
            requiredComponents,
            requiredComponentAmounts,
            salt: new BigNumber(Date.now()),
        };
        console.log(issuanceOrder);
        // For the order to be valid, the maker must approve their makerToken to the proxy
        await setProtocol.setUnlimitedTransferProxyAllowanceAsync(makerToken, { from: maker });

        const signedOrder: SignedIssuanceOrder = await setProtocol.orders.createSignedOrderAsync(
            setTokenAddress, // Set Address
            quantity, // Quantity
            requiredComponents, // Required Components
            requiredComponentAmounts, // Required Component Amounts
            maker, // makerAddress
            makerToken, // makerToken
            makerTokenAmount, // maker token amount
            setProtocol.orders.generateExpirationTimestamp(180), // expiration
            SetProtocol.NULL_ADDRESS, // relayer address
            SetProtocol.NULL_ADDRESS, // relayer token
            ZERO, // maker relayer fee
            ZERO, // taker relayer fee
        );

        this.setState({ signedOrder });
    }

    public async submitFillOrder() {
        const { daiAddress, setProtocol, signedOrder, trueUsdAddress, web3Instance } = this.state;

        /* tslint:disable */
        const taker = web3Instance.eth.accounts[0];

        await setProtocol.setUnlimitedTransferProxyAllowanceAsync(trueUsdAddress, { from: taker });
        await setProtocol.setUnlimitedTransferProxyAllowanceAsync(daiAddress, { from: taker });

        const orderData1: TakerWalletOrder = {
            takerTokenAddress: trueUsdAddress,
            takerTokenAmount: new BigNumber(500000000000000000), // 5 * 10 ^ 17
        };

        const orderData2: TakerWalletOrder = {
            takerTokenAddress: daiAddress,
            takerTokenAmount: new BigNumber(500000000000000000), // 5 * 10 ^ 17
        };

        const orderData = [orderData1, orderData2];

        // The taker is going to fill the entire order
        let quantityToFill;
        if (signedOrder) {
            quantityToFill = signedOrder.quantity; // 1 * 10 ^ 18
            await setProtocol.orders.validateOrderFillableOrThrowAsync(signedOrder, quantityToFill);
        }

        await setProtocol.orders.fillOrderAsync(signedOrder, quantityToFill, orderData, {
            from: taker,
            gas: 4000000,
            gasPrice: 8000000000,
        });
    }

    public async submitFillOrderZeroEx() {
        const {
            daiAddress,
            erc20Proxy,
            exchange,
            setProtocol,
            signedOrder,
            trueUsdAddress,
            web3Instance,
            wethAddress,
        } = this.state;

        /* tslint:disable */
        const taker = web3Instance.eth.accounts[0];
        const zeroExMaker = web3Instance.eth.accounts[0];

        await setProtocol.erc20.approveAsync(
            trueUsdAddress,
            erc20Proxy,
            new BigNumber(500000000000000000000), // 500 units of trueUSD
            { from: zeroExMaker },
        );

        await setProtocol.erc20.approveAsync(
            daiAddress,
            erc20Proxy,
            new BigNumber(500000000000000000000), // 500 units of Dai
            { from: zeroExMaker },
        );

        await setProtocol.setUnlimitedTransferProxyAllowanceAsync(trueUsdAddress, { from: taker });
        await setProtocol.setUnlimitedTransferProxyAllowanceAsync(daiAddress, { from: taker });

        const zeroExOrderTrueUSD: Order = {
            exchangeAddress: exchange,
            expirationTimeSeconds: setProtocol.orders.generateExpirationTimestamp(180),
            feeRecipientAddress: SetProtocol.NULL_ADDRESS,
            makerAddress: zeroExMaker,
            makerAssetAmount: new BigNumber(50000000000000000000),
            makerAssetData: assetDataUtils.encodeERC20AssetData(trueUsdAddress),
            makerFee: new BigNumber(0),
            salt: setProtocol.orders.generateSalt(),
            senderAddress: SetProtocol.NULL_ADDRESS,
            takerAddress: SetProtocol.NULL_ADDRESS,
            takerAssetAmount: new BigNumber(170000000000000000),
            takerAssetData: assetDataUtils.encodeERC20AssetData(wethAddress),
            takerFee: new BigNumber(0),
        };

        const zeroExOrderDai: Order = {
            exchangeAddress: exchange,
            expirationTimeSeconds: setProtocol.orders.generateExpirationTimestamp(180),
            feeRecipientAddress: SetProtocol.NULL_ADDRESS,
            makerAddress: zeroExMaker,
            makerAssetAmount: new BigNumber(50000000000000000000),
            makerAssetData: assetDataUtils.encodeERC20AssetData(daiAddress),
            makerFee: new BigNumber(0),
            salt: setProtocol.orders.generateSalt(),
            senderAddress: SetProtocol.NULL_ADDRESS,
            takerAddress: SetProtocol.NULL_ADDRESS,
            takerAssetAmount: new BigNumber(170000000000000000),
            takerAssetData: assetDataUtils.encodeERC20AssetData(wethAddress),
            takerFee: new BigNumber(0),
        };

        const trueUSDzeroExOrderHash = orderHashUtils.getOrderHashHex(zeroExOrderTrueUSD);
        const trueUSDzeroExOrderSig = await signatureUtils.ecSignOrderHashAsync(
            web3Instance.currentProvider,
            trueUSDzeroExOrderHash,
            zeroExMaker,
            SignerType.Metamask,
        );
        const trueUSDSignedZeroExOrder: SignedOrder = Object.assign({}, zeroExOrderTrueUSD, {
            signature: trueUSDzeroExOrderSig,
        });

        const zeroExSignedOrderTrueUSD: ZeroExSignedFillOrder = Object.assign({}, trueUSDSignedZeroExOrder, {
            fillAmount: trueUSDSignedZeroExOrder.takerAssetAmount,
        });

        const daiZeroExOrderHash = orderHashUtils.getOrderHashHex(zeroExOrderDai);
        const daiZeroExOrderSig = await signatureUtils.ecSignOrderHashAsync(
            web3Instance.currentProvider,
            daiZeroExOrderHash,
            zeroExMaker,
            SignerType.Metamask,
        );
        const daiSignedZeroExOrder: SignedOrder = Object.assign({}, zeroExOrderDai, { signature: daiZeroExOrderSig });

        const zeroExSignedOrderDai: ZeroExSignedFillOrder = Object.assign({}, daiSignedZeroExOrder, {
            fillAmount: daiSignedZeroExOrder.takerAssetAmount,
        });

        const orderData = [zeroExSignedOrderTrueUSD, zeroExSignedOrderDai];

        // The taker is going to fill the entire order
        let quantityToFill;
        if (signedOrder) {
            quantityToFill = signedOrder.quantity;
            await setProtocol.orders.validateOrderFillableOrThrowAsync(signedOrder, quantityToFill);
        }

        await setProtocol.orders.fillOrderAsync(signedOrder, quantityToFill, orderData, {
            from: taker,
            gas: 5000000,
            gasPrice: 8000000000,
        });
    }

    public async submitCreate() {
        const {
            daiAddress,
            daiUnits,
            naturalUnit,
            setName,
            setProtocol,
            setSymbol,
            trueUsdAddress,
            trueUsdUnits,
        } = this.state;

        const txHash = await setProtocol.createSetAsync(
            [trueUsdAddress, daiAddress], // components
            [trueUsdUnits, daiUnits], // units
            naturalUnit, // naturalUnits
            setName, // name
            setSymbol, // symbol
            {
                gas: 4000000,
                gasPrice: 8000000000,
            }, // txOptions,
        );

        this.setState({ pendingCreation: true });

        const stableSetAddress = await setProtocol.getSetAddressFromCreateTxHashAsync(txHash);

        this.setState({ setTokenAddress: stableSetAddress, pendingCreation: false });

        return txHash;
    }

    public async submitIssue() {
        const {
            daiAddress,
            daiAllowance,
            issueQuantity,
            setProtocol,
            setTokenAddress,
            trueUsdAddress,
            trueUsdAllowance,
            web3Instance,
        } = this.state;

        if (daiAllowance.toNumber() === 0) {
            await setProtocol.setUnlimitedTransferProxyAllowanceAsync(
                trueUsdAddress,
                {
                    gas: 4000000,
                    gasPrice: 8000000000,
                }, // txOptions
            );
        }
        if (trueUsdAllowance.toNumber() === 0) {
            await setProtocol.setUnlimitedTransferProxyAllowanceAsync(
                daiAddress,
                {
                    gas: 4000000,
                    gasPrice: 8000000000,
                }, // txOptions
            );
        }

        const txHash = await setProtocol.issueAsync(
            setTokenAddress,
            issueQuantity,
            {
                from: web3Instance.eth.accounts[0],
                gas: 4000000,
                gasPrice: 8000000000,
            }, // txOptions,
        );

        return txHash;
    }

    public async submitRedeem() {
        const { redeemQuantity, setProtocol, setTokenAddress, web3Instance } = this.state;

        const txHash = await setProtocol.redeemAsync(
            setTokenAddress,
            redeemQuantity,
            true,
            [],
            {
                from: web3Instance.eth.accounts[0],
                gas: 4000000,
                gasPrice: 8000000000,
            }, // txOptions,
        );

        return txHash;
    }

    public renderCreate() {
        const {
            setTokenAddress,
            daiAddress,
            daiAllowance,
            daiBalance,
            daiUnits,
            issueQuantity,
            naturalUnit,
            pendingCreation,
            pendingIssue,
            pendingRedeem,
            redeemQuantity,
            setName,
            setSymbol,
            setTokenBalance,
            trueUsdAddress,
            trueUsdAllowance,
            trueUsdBalance,
            trueUsdUnits,
            validIssueQuantity,
            validRedeemQuantity,
        } = this.state;

        return (
            <div style={{ width: '500px', margin: '50px auto' }}>
                <div style={{ borderWidth: '2px', borderStyle: 'solid', padding: '10px' }}>
                    <h1 className="App-intro">Current State</h1>
                    <div>
                        <u>Dai Balance</u>
                        <br />
                        {daiBalance.toNumber()}
                        <br />
                        <br />
                        <u>Dai Allowance</u>
                        <br />
                        {daiAllowance.toNumber()}
                        <br />
                        <br />
                        <u>TrueUSD Balance</u>
                        <br />
                        {trueUsdBalance.toNumber()}
                        <br />
                        <br />
                        <u>TrueUSD Allowance</u>
                        <br />
                        {trueUsdAllowance.toNumber()}
                        <br />
                        <br />
                        <u>Set Token Balance</u>
                        <br />
                        {setTokenBalance.toNumber()}
                        <br />
                    </div>
                </div>

                <br />
                <br />

                <div style={{ borderWidth: '2px', borderStyle: 'solid', padding: '10px' }}>
                    <h1 className="App-intro">Create Set Token</h1>
                    <Form onSubmit={this.submitCreate}>
                        <div>
                            <u>Set</u>
                            <br />
                            {setName} ({setSymbol})<br />
                            <br />
                            <u>Tokens</u>
                            <br />
                            <b>Dai</b> ({daiAddress})<br />
                            <b>TrueUSD</b> ({trueUsdAddress})<br />
                            <br />
                            <u>Units</u>
                            <br />
                            <b>Dai</b> ({daiUnits.toNumber()})<br />
                            <b>TrueUSD</b> ({trueUsdUnits.toNumber()})<br />
                            <br />
                            <u>Natural Unit</u>
                            <br />
                            {naturalUnit.toNumber()}
                            <br />
                            <br />
                            <input
                                className="button"
                                type="submit"
                                value={pendingCreation ? '...Transaction Pending...' : 'Create Set'}
                            />
                            <br />
                            <br />
                            <u>Set Token Address</u>
                            <br />
                            <b>{setTokenAddress || 'N/A'}</b>
                        </div>
                    </Form>
                </div>

                <br />
                <br />

                <ActionBox
                    submitDisabled={setTokenAddress === 'N/A'}
                    submitFunc={this.submitIssue}
                    submitText={pendingIssue ? '...Transaction Pending...' : 'Issue Set'}
                    title="Issue Set Token"
                    displayData={{
                        'Issue Quantity': issueQuantity.toNumber(),
                        'Set Token Address': setTokenAddress || 'N/A',
                        'Valid Quantity': validIssueQuantity ? 'Valid' : '',
                    }}
                />

                <br />
                <br />

                <ActionBox
                    submitDisabled={setTokenAddress === 'N/A'}
                    submitFunc={this.submitRedeem}
                    submitText={pendingRedeem ? '...Transaction Pending...' : 'Redeem Set'}
                    title="Redeem Set Token"
                    displayData={{
                        'Redeem Quantity': redeemQuantity.toNumber(),
                        'Set Token Address': setTokenAddress || 'N/A',
                        'Valid Quantity': validRedeemQuantity ? 'Valid' : '',
                    }}
                />

                <br />
                <br />

                <ActionBox
                    submitDisabled={setTokenAddress === 'N/A'}
                    submitFunc={this.submitCreateIssuanceOrder}
                    submitText={'Create Issuance Order'}
                    title="Create Issuance Order"
                    displayData={{
                        'Set Token Address': setTokenAddress || 'N/A',
                    }}
                />

                <br />
                <br />

                <ActionBox
                    submitDisabled={setTokenAddress === 'N/A'}
                    submitFunc={this.submitFillOrder}
                    submitText={'Fill Order'}
                    title="Fill Order"
                    displayData={{
                        'Set Token Address': setTokenAddress || 'N/A',
                    }}
                />

                <br />
                <br />

                <ActionBox
                    submitDisabled={setTokenAddress === 'N/A'}
                    submitFunc={this.submitFillOrderZeroEx}
                    submitText={'Fill Order w/ Zero Ex'}
                    title="Fill Order"
                    displayData={{
                        'Set Token Address': setTokenAddress || 'N/A',
                    }}
                />
            </div>
        );
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Set Demo App</h1>
                </header>
                {this.renderCreate()}
            </div>
        );
    }
}

export default App;
