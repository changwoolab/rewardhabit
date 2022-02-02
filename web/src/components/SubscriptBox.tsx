import { Box, Text, useColorMode } from '@chakra-ui/react';
import React from 'react';
import styles from "../style/hrStyle.module.css"

interface SubscriptBoxProps {
    desc: string;
}

export const SubscriptBox: React.FC<SubscriptBoxProps> = ({ desc, children}) => {
    const {colorMode} = useColorMode();
    const hrStyle = colorMode === "dark" ? styles.hr_dark : styles.hr_light;
    return (
        <Box flex={1} textAlign={"center"}>
          <Text mb={2}>{desc}</Text>
          <hr className={hrStyle}/>
          {children}
        </Box>
    );
}