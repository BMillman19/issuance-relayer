import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Anchor from 'grommet/components/Anchor';
import Layout from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Header from 'grommet/components/Header';
import Actions from 'grommet/components/icons/base/Actions';
import Menu from 'grommet/components/Menu';
import Paragraph from 'grommet/components/Paragraph';
import Section from 'grommet/components/Section';
import Title from 'grommet/components/Title';

import SetSelectionPage from './SetSelectionPage';
import IssueSetPage from './IssueSetPage';

class App extends React.Component {
    public render() {
        return (
            <BrowserRouter>
                <Layout>
                    <Header fixed={false} float={false} size="large" splash={false}>
                        <Title>
                            <Link to="/">Issuance Relayer </Link>
                        </Title>
                        <Box flex={true} justify="end" direction="row" responsive={false}>
                            <Menu icon={<Actions />} dropAlign={{ right: 'right' }}>
                                <Anchor href="#">Create Issuance Order</Anchor>
                                <Anchor href="#">See All Orders</Anchor>
                            </Menu>
                        </Box>
                    </Header>
                    <Section margin={{ vertical: 'large' }}>
                        <Route exact={true} path="/" component={SetSelectionPage} />
                        <Route path="/issue/:setId" component={IssueSetPage} />
                    </Section>
                    <Footer justify="between">
                        <Title />
                        <Box direction="row" align="center" pad={{ between: 'medium' }}>
                            <Paragraph margin="none">© 2018 0x Project</Paragraph>
                            <Menu direction="row" size="small" dropAlign={{ right: 'right' }}>
                                <Anchor href="#">About</Anchor>
                                <Anchor href="#">FAQ</Anchor>
                                <Anchor href="#">Contact</Anchor>
                            </Menu>
                        </Box>
                    </Footer>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default App;
