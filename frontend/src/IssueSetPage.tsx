import * as React from 'react';
import { IssuanceOrder } from 'setprotocol.js';
import { RouteProps } from 'react-router-dom';

import Box from 'grommet/components/Box';

import IssuanceOrderForm from './IssuanceOrderForm';

class IssueSetPage extends React.Component<RouteProps> {
    constructor(props) {
        super(props);
        this.state;
    }
    public render(): React.ReactNode {
        return (
            <Box>
                <IssuanceOrderForm setId={this.props.match.params.setId} onSubmit={console.log} />
            </Box>
        );
    }
    handleFormSubmit = (): void => {};
}

export default IssueSetPage;
