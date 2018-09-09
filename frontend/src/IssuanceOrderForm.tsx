import * as React from 'react';
import SetProtocol, { IssuanceOrder } from 'setprotocol.js';
import { BigNumber } from '0x.js';

import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';
import Select from 'grommet/components/Select';
import NumberInput from 'grommet/components/NumberInput';

import { web3Wrapper } from './web3Wrapper';
import { sets, setMap } from './data/sets';
import { api } from './api';
import { BIG_ZERO, WETH_KOVAN_ADDRESS } from './constants';

export interface IssuanceOrderFormState {
    quantity: BigNumber;
    makerTokenAmount: BigNumber;
}

export interface IssuanceOrderFormProps {
    setId: string;
    onSubmit: (form: IssuanceOrder) => void;
    isLoading: boolean;
}

const setOptions = sets.map(set => ({
    value: set.address,
    label: set.name,
}));

class IssuanceOrderForm extends React.Component<IssuanceOrderFormProps, IssuanceOrderFormState> {
    constructor(props: IssuanceOrderFormProps) {
        super(props);
        this.state = {
            quantity: BIG_ZERO,
            makerTokenAmount: BIG_ZERO,
        };
    }
    public render(): React.ReactNode {
        const set = setMap[this.props.setId];
        return (
            <Form onSubmit={this.onSubmitForm}>
                <Header>
                    <Heading>Issue {set.name} Token</Heading>
                </Header>
                <FormFields>
                    <FormField label="Quantity">
                        <NumberInput
                            value={this.state.quantity ? this.state.quantity.toNumber() : null}
                            min={0}
                            step={+set.natural_units}
                            onChange={async (e: React.FormEvent<HTMLInputElement>) => {
                                const quantity = (e.target as any).value;
                                if (!quantity) {
                                    this.setState({ quantity: null });
                                    return;
                                }
                                const bigQuantity = new BigNumber(quantity);
                                this.setState({ quantity: bigQuantity });
                                const { totalCost, price } = await api.getQuote(set.address, quantity);
                                this.setState({ makerTokenAmount: totalCost });
                            }}
                        />
                    </FormField>
                    <FormField label="WETH Token Amount">
                        <NumberInput
                            value={this.state.makerTokenAmount ? this.state.makerTokenAmount.toNumber() : null}
                            min={0}
                            step={0.0000000001}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                const value = (e.target as any).value;
                                if (!value) {
                                    this.setState({ makerTokenAmount: null });
                                    return;
                                }
                                this.setState({ makerTokenAmount: new BigNumber(value) });
                            }}
                        />
                    </FormField>
                </FormFields>
                <Footer pad={{ vertical: 'medium' }}>
                    <Button label={this.props.isLoading ? '...Loading' : 'Submit'} type="submit" primary={true} />
                </Footer>
            </Form>
        );
    }
    onSubmitForm = async (e: any) => {
        e.preventDefault();
        const issuanceOrder = await this.createIssuanceOrder();
        this.props.onSubmit(issuanceOrder);
    };
    createIssuanceOrder = async (): Promise<IssuanceOrder> => {
        const { quantity, makerTokenAmount } = this.state;
        const set = setMap[this.props.setId];
        const [makerAddress] = await web3Wrapper.getAvailableAddressesAsync();
        return {
            setAddress: set.address,
            makerAddress: makerAddress,
            makerToken: WETH_KOVAN_ADDRESS,
            relayerAddress: SetProtocol.NULL_ADDRESS,
            relayerToken: SetProtocol.NULL_ADDRESS,
            quantity: quantity,
            makerTokenAmount: makerTokenAmount,
            expiration: new BigNumber(Date.now() + 1000 * 30),
            makerRelayerFee: BIG_ZERO,
            takerRelayerFee: BIG_ZERO,
            requiredComponents: set.components.map(componentInfo => componentInfo.address),
            requiredComponentAmounts: set.components.map(componentInfo => {
                const bigUnits = new BigNumber(componentInfo.units);
                return bigUnits.mul(quantity);
            }),
            salt: new BigNumber(Date.now()),
        };
    };
}

export default IssuanceOrderForm;
