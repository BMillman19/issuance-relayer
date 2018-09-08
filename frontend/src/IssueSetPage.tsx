import * as React from 'react';
import { IssuanceOrder, SignedIssuanceOrder } from 'setprotocol.js';
import { RouteProps } from 'react-router-dom';

import Box from 'grommet/components/Box';

import IssuanceOrderForm from './IssuanceOrderForm';
import { getSetProtocolInstance } from './setProtocol';
import styled from './styled';

export interface IssueSetPageState {
    isLoading: boolean;
    errorMessage: string;
}

const setProtocol = getSetProtocolInstance();

class IssueSetPage extends React.Component<RouteProps, IssueSetPageState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            errorMessage: '',
        };
    }
    public render(): React.ReactNode {
        return (
            <Box>
                <IssuanceOrderForm
                    isLoading={this.state.isLoading}
                    setId={this.props.match.params.setId}
                    onSubmit={this.handleFormSubmit}
                />
            </Box>
        );
    }
    handleFormSubmit = async (issuanceOrder: IssuanceOrder): Promise<void> => {
        const {
            setAddress,
            quantity,
            requiredComponents,
            requiredComponentAmounts,
            makerAddress,
            makerToken,
            makerTokenAmount,
            expiration,
            relayerAddress,
            relayerToken,
            makerRelayerFee,
            takerRelayerFee,
            salt,
        } = issuanceOrder;
        this.setState({ isLoading: true });
        try {
            const signedIssuanceOrder: SignedIssuanceOrder = await setProtocol.orders.createSignedOrderAsync(
                setAddress,
                quantity,
                requiredComponents,
                requiredComponentAmounts,
                makerAddress,
                makerToken,
                makerTokenAmount,
                expiration,
                relayerAddress,
                relayerToken,
                makerRelayerFee,
                takerRelayerFee,
                salt,
            );
            // TODO: Send SignedIssuanceOrder
        } catch (e) {
            console.log(e);
        } finally {
            this.setState({ isLoading: false });
        }
    };
}

export default IssueSetPage;
