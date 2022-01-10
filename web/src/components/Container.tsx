import { As, Flex, FlexProps, OmitCommonProps, useColorMode } from '@chakra-ui/react'
import { DetailedHTMLProps, HTMLAttributes } from 'react'

export const Container = (props: JSX.IntrinsicAttributes & OmitCommonProps<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof FlexProps> & FlexProps & OmitCommonProps<any, keyof FlexProps> & { as?: As<any> | undefined }) => {
  const { colorMode } = useColorMode()

  const bgColor = { light: 'gray.50', dark: 'gray.900' }

  const color = { light: 'black', dark: 'white' }
  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      {...props}
    />
  )
}
