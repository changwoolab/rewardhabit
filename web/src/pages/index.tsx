import {
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'

const Index = () => (
  <Container height="100vh">

    <DarkModeSwitch />
      <Text>Next ❤️ Chakra</Text>
  </Container>
)

export default Index
