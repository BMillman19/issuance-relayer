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
import Logo from './Logo';
import OTCApp from './OTCApp';
import { NETWORK_ID_KOVAN } from './constants';
import { web3Wrapper } from './web3Wrapper';
import ToastErrorBoundary from './ToastErrorBoundary';

export interface AppProps {}
export interface AppState {}

class App extends React.Component<AppProps, AppState> {
    // public componentDidMount(): void {
    //     this.throwOnWrongNetwork();
    // }
    // throwOnWrongNetwork = async () => {
    //     const networkId = await web3Wrapper.getNetworkIdAsync();
    //     if (networkId !== NETWORK_ID_KOVAN) {
    //         throw new Error('Please switch to Kovan');
    //     }
    // };
    public render() {
        return (
            <BrowserRouter>
                <Box pad="medium">
                    <Layout>
                        <Header fixed={false} float={false} size="large" splash={false}>
                            <Title>
                                <Link to="/">
                                    <Logo />
                                </Link>
                            </Title>
                            <Box flex={true} justify="end" direction="row" responsive={false}>
                                <Menu icon={<Actions />} dropAlign={{ right: 'right' }}>
                                    <Anchor>
                                        <Link to="orders">See Your Orders</Link>
                                    </Anchor>
                                    <Anchor>
                                        <Link to="orderbook">See All Orders</Link>
                                    </Anchor>
                                    <Anchor>
                                        <Link to="/">See Token Sets</Link>
                                    </Anchor>
                                </Menu>
                            </Box>
                        </Header>
                        <Section margin={{ vertical: 'large' }}>
                            <Route exact={true} path="/" component={SetSelectionPage} />
                            <Route path="/issue/:setId" component={IssueSetPage} />
                            <Route path="/otc" component={OTCApp} />
                        </Section>
                        <Footer justify="between">
                            <Title />
                            <Box direction="row" align="center" pad={{ between: 'medium' }}>
                                <Paragraph margin="none">© 2018 Bündler</Paragraph>
                                <Menu direction="row" size="small" dropAlign={{ right: 'right' }}>
                                    <Anchor href="#">About</Anchor>
                                    <Anchor href="#">FAQ</Anchor>
                                    <Anchor href="#">Contact</Anchor>
                                </Menu>
                            </Box>
                        </Footer>
                    </Layout>
                </Box>
            </BrowserRouter>
        );
    }
}

export default App;
