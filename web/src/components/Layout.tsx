import React from 'react';
import { Container } from './Container';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
    variant: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
    return (
        <>
          <Navbar />
          <Container>
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
            <Footer />
          </Container>
        </>
    );
}