import {
  Flex,
  Box,
  Button,
  Text,
  Image,
  VStack,
  List,
  ListItem,
  ListIcon,
  Spinner,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

function App() {
  const recentPlays = [
    {
      text: "0x28C6c06298d514Db089934071355E5743bf21d60: .drawing",
      loading: true,
    },
    {
      text: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2: .drawing",
      loading: true,
    },
    {
      text: "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a: +0.02ETH",
      loading: false,
    },
    {
      text: "0xE92d1A43df510F82C66382592a047d288f85226f: -0.01ETH",
      loading: false,
    },
    {
      text: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045: +0.02ETH",
      loading: false,
    },
    {
      text: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B: +0.02ETH",
      loading: false,
    },
  ];

  const getTextColor = (text: string) => {
    if (text.includes(".drawing")) {
      return "white";
    }
    if (text.includes("+")) {
      return "green.500";
    }
    if (text.includes("-")) {
      return "red.500";
    }
    return "gray.500";
  };

  const formatText = (text: string) => {
    const [address, status] = text.split(": ");
    return (
      <>
        <Text as="span" color="white">
          {address}:
        </Text>{" "}
        <Text as="span" color={getTextColor(status)}>
          {status}
        </Text>
      </>
    );
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      bg="gray.50"
      width="100%"
    >
      <Flex width="100%" mx="auto">
        <Flex flex={1} alignItems="center" justifyContent="center">
          left
        </Flex>
        <Flex
          flex={2}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Box
            w="full"
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
            maxW="800px"
          >
            <Image
              src="/main_banner.png"
              alt="Main Banner"
              width="100%"
              maxW="500px"
            />
            <Button
              colorScheme="purple"
              size="lg"
              mb={8}
              width="100%"
              maxW="500px"
              letterSpacing={"10px"}
              fontSize={"40px"}
              textColor={"white"}
            >
              CONNECT WALLET
            </Button>
          </Box>

          <Box
            bg="blue"
            py={8}
            px={3}
            boxShadow="md"
            rounded="md"
            textAlign="center"
            textColor={"white"}
            width="full"
            maxW="800px"
            minW={"500px"}
          >
            <Box fontSize={"4xl"} border={"3px solid red"} px={"17px"}>
              RUG +0.02ETH / Rugged -0.01ETH
            </Box>
            <Text mb={4} fontSize={"5xl"}>
              Try to Rug me, Degen :)
            </Text>

            <Text mb={2}>RECENT PLAYS</Text>
            <Box
              border="1px solid white"
              w="full"
              maxW="400px"
              h="200px"
              mt={4}
              px={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              margin="0 auto"
            >
              <VStack spacing={2} w="full">
                <List textAlign="left" w="full" fontSize={"16px"}>
                  {recentPlays.map((play, index) => (
                    <ListItem
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <ListIcon
                        as={play.loading ? Spinner : CheckCircleIcon}
                        color="green.500"
                      />
                      <Text>{formatText(play.text)}</Text>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Box>
          </Box>
        </Flex>
        <Flex flex={1} alignItems="center" justifyContent="center">
          right
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
