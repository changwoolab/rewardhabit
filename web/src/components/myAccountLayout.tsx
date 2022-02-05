import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { Layout } from './Layout';
import { SideBar } from './SideBar';

interface MyAccountLayoutProps {

}

export const MyAccountLayout: React.FC<MyAccountLayoutProps> = ({ children }) => {
    return (
      <>
        <Layout variant="large">
          <Grid templateColumns="1fr 3fr" gap={1}>
            <GridItem>
              <SideBar />
            </GridItem>
            <GridItem>{children}</GridItem>
          </Grid>
        </Layout>
      </>
    );
}