import React from 'react';
import { Container } from './Container';
import { Navbar } from './Navbar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
    variant: WrapperVariant;
    height?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, height="100vh" }) => {
    return (
        <>
          <Navbar />
          <Container height={height}>
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
          </Container>
        </>
    );
}