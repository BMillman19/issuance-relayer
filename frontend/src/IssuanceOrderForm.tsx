import * as React from 'react';
import { IssuanceOrder } from 'setprotocol.js';

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

import { sets } from './data/sets';

export interface IssuanceOrderFormState {
    quantity: number;
    makerTokenAmount: number;
}

export interface IssuanceOrderFormProps {
    setId: string;
    onSubmit: (form: IssuanceOrderFormState) => void;
}

// export interface IssuanceOrder {
//     setAddress: Address; // INPUT: dropdown
//     makerAddress: Address; // from metamask
//     makerToken: Address; // INPUT: WETH or DAI
//     relayerAddress: Address; // NULL
//     relayerToken: Address; // NULL
//     quantity: BigNumber; // INPUT: slider
//     makerTokenAmount: BigNumber; // INPUT: number input
//     expiration: BigNumber; // Default to 30 mins
//     makerRelayerFee: BigNumber; // NULL
//     takerRelayerFee: BigNumber; // NULL
//     salt: BigNumber; // OPTIONAL
//     requiredComponents: Address[]; // All components
//     requiredComponentAmounts: BigNumber[]; // All components
// }

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
            <Form
                onSubmit={e => {
                    e.preventDefault();
                    this.props.onSubmit(this.state);
                }}
            >
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
                    <Button label="Submit" type="submit" primary={true} />
                </Footer>
            </Form>
        );
    }
}

export default IssuanceOrderForm;
