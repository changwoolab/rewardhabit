import {
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react'
import { Container } from '../components/Container'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { Navbar } from '../components/Navbar'

const Index = () => (
  <>
  <Navbar/>
  <Container height="100vh">
      <Text>Next ❤️ Chakra</Text>
  </Container>
  </>
)

export default Index
