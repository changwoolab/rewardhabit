import { Center, Text } from '@chakra-ui/react'
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from '../utils/createUrqlClient'
import { Layout } from '../components/Layout'

const Index = () => (
  <Layout variant="large">
      <Center><Text>Next ❤️ Chakra</Text></Center>
  </Layout>
)

// withUrqlClient(Client 정보)(페이지)
export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
