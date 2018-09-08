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
import { sets } from './data/sets';
import { BIG_ZERO, WETH_KOVAN_ADDRESS } from './constants';

export interface IssuanceOrderFormState {
    quantity: number;
    makerTokenAmount: number;
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
const setMap = sets.reduce((acc, set) => {
    acc[set.id] = set;
    return acc;
}, {});
class IssuanceOrderForm extends React.Component<IssuanceOrderFormProps, IssuanceOrderFormState> {
    constructor(props: IssuanceOrderFormProps) {
        super(props);
        this.state = {
            quantity: 0,
            makerTokenAmount: 0,
        };
    }
    public render(): React.ReactNode {
        return (
            <Form onSubmit={this.onSubmitForm}>
                <Header>
                    <Heading>Issue {setMap[this.props.setId].name} Token</Heading>
                </Header>
                <FormFields>
                    <FormField label="Quantity">
                        <NumberInput
                            value={this.state.quantity}
                            min={0}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                this.setState({ quantity: (e.target as any).value });
                            }}
                        />
                    </FormField>
                    <FormField label="WETH Token Amount">
                        <NumberInput
                            value={this.state.makerTokenAmount}
                            min={0}
                            onChange={(e: React.FormEvent<HTMLInputElement>) => {
                                this.setState({ makerTokenAmount: (e.target as any).value });
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
            quantity: new BigNumber(quantity),
            makerTokenAmount: new BigNumber(makerTokenAmount),
            expiration: new BigNumber(Date.now() + 1000 * 30),
            makerRelayerFee: BIG_ZERO,
            takerRelayerFee: BIG_ZERO,
            requiredComponents: set.components.map(componentInfo => componentInfo.address),
            requiredComponentAmounts: set.components.map(componentInfo => new BigNumber(componentInfo.units)),
            salt: new BigNumber(Date.now()),
        };
    };
}

export default IssuanceOrderForm;
