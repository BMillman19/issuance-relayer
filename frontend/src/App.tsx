import * as React from "react";

import Actions from "grommet/components/icons/base/Actions";
import Anchor from "grommet/components/Anchor";
import Paragraph from "grommet/components/Paragraph";
import Layout from "grommet/components/App";
import Box from "grommet/components/Box";
import Footer from "grommet/components/Footer";
import Header from "grommet/components/Header";
import Menu from "grommet/components/Menu";
import Section from "grommet/components/Section";
import Title from "grommet/components/Title";

class App extends React.Component {
  public render() {
    return (
      <Layout>
        <Header fixed={false} float={false} size="large" splash={false}>
          <Title>Issuance Relayer</Title>
          <Box flex={true} justify="end" direction="row" responsive={false}>
            <Menu icon={<Actions />} dropAlign={{ right: "right" }}>
              <Anchor href="#" className="active">
                First
              </Anchor>
              <Anchor href="#">Create Issuance Order</Anchor>
              <Anchor href="#">See All Orders</Anchor>
            </Menu>
          </Box>
        </Header>
        <Section>{/** TODO: react-router...*/}</Section>
        <Footer justify="between">
          <Title>
            <s />
            Issuance Relayer
          </Title>
          <Box direction="row" align="center" pad={{ between: "medium" }}>
            <Paragraph margin="none">© 2018 0x Project</Paragraph>
            <Menu direction="row" size="small" dropAlign={{ right: "right" }}>
              <Anchor href="#">About</Anchor>
              <Anchor href="#">FAQ</Anchor>
              <Anchor href="#">Contact</Anchor>
            </Menu>
          </Box>
        </Footer>
      </Layout>
    );
  }
}

export default App;
