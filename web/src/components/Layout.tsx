import React from 'react';
import { Container } from './Container';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import Wrapper, { WrapperVariant } from './Wrapper';

interface LayoutProps {
    variant: WrapperVariant;
    height?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, height }) => {
    return (
        <>
          <Navbar />
          <Container height={height}>
            <Wrapper variant={variant}>
                {children}
            </Wrapper>
            <Footer variant={variant}/>
          </Container>
        </>
    );
}