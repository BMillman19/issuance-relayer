import * as React from 'react';

import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

class IssueSetPage extends React.Component {
    public render(): React.ReactNode {
        return (
            <Box>
                <Form>
                    <Header>
                        <Heading>Issue Set</Heading>
                    </Header>
                    <FormFields />
                    <Footer pad={{ vertical: 'medium' }}>
                        <Button label="Submit" type="submit" primary={true} onClick={this.handleFormSubmit} />
                    </Footer>
                </Form>
            </Box>
        );
    }
    handleFormSubmit = (): void => {};
}

export default IssueSetPage;
