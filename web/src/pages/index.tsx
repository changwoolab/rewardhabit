import { Text } from '@chakra-ui/react'
import { Container } from '../components/Container'
import { Navbar } from '../components/Navbar'
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from '../utils/createUrqlClient'

const Index = () => (
  <>
  <Navbar/>
  <Container height="100vh">
      <Text>Next ❤️ Chakra</Text>
  </Container>
  </>
)

// withUrqlClient(Client 정보)(페이지)
export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
