import { Box } from '@chakra-ui/react';
import React from 'react';

export type WrapperVariant = "small" | "regular" | "large";

export const wrapperSize = {
    "small": "400px",
    "regular": "800px",
    "large": "1000px",
}

interface WrapperProps {
  variant: WrapperVariant;
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }) => {
  return (
    <Box maxW={wrapperSize[variant]} minH={"100vh"} w="100%" mt={8} mx="auto">
      {children}
    </Box>
  );
};

export default Wrapper;