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
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { ethers, JsonRpcSigner, parseEther } from "ethers";
import { FC, useEffect, useState } from "react";
import LotteryAbi from "./abis/LotteryAbi.json";
import MintModal from "./components/MintModal";
// import axios from "axios";

const App: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [buttonText, setButtonText] = useState<string>("CONNECT WALLET");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [buyer, setBuyer] = useState<boolean | null>(null); // 나중에 RECENT PLAYS 만들 때 사용하기
  const [isWinner, setIsWinner] = useState<boolean | null>(null);
  const [tokenId, setTokenID] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const contractAddress = "0xaEEef264DDbf9D6CC4737B1AbD954DC7DE9C1F1c"; // old contract
  const contractAddress = "0xf0AFb3688035a824C1c0E592A3149fBd231E1135";

  const getSigner = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    setSigner(await provider.getSigner());
  };

  const onClickMetamask = async () => {
    try {
      getSigner();

      localStorage.setItem("isLogin", "true");
    } catch (error) {
      console.error(error);
    }
  };

  const purchaseTicket = async () => {
    try {
      setIsLoading(true);

      // console.log(parseEther("0.02046"));
      const response = await contract?.purchaseTicket({
        value: parseEther("0.02046001"),
      });

      await response.wait();

      onOpen();

      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setIsLoading(false);
    }
  };

  // 로그아웃 기능 없음!
  // const onClickLogout = () => {
  //   setSigner(null);

  //   localStorage.removeItem("isLogin");
  // };

  useEffect(() => {
    const localIsLogin = localStorage.getItem("isLogin");

    if (localIsLogin === "true") {
      getSigner();
    }
  }, []);

  useEffect(() => {
    if (signer) {
      setButtonText("BUY TICKET");
    }
  }, [signer]);

  const recentPlays = [
    {
      text: "user1: .drawing",
      loading: true,
    },
    {
      text: "user2: .drawing",
      loading: true,
    },
    {
      text: "user3: +0.04ETH",
      loading: false,
    },
    {
      text: "user4: -0.02ETH",
      loading: false,
    },
    {
      text: "user5: +0.04ETH",
      loading: false,
    },
    {
      text: "user6: +0.04ETH",
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

  // on을 쓰면 스마트컨트랙트에서 일어나는 event를 청취할 수 있다.
  contract?.on("TicketPurchased", (_buyer, _tokenId, _isWinner) => {
    //_buyer은 모달창에서 사용하기
    // console.log(
    //   `Ticket Purchased - Buyer: ${_buyer}, Token ID: ${_tokenId}, Is Winner: ${_isWinner}`
    // ); //테스트 완료
    setIsWinner(_isWinner);
    setTokenID(_tokenId);
  });
  // console.log(isWinner);
  // console.log(tokenId);

  useEffect(() => {
    if (!signer) return;

    const lotteryContract = new ethers.Contract(
      contractAddress,
      LotteryAbi,
      signer
    );
    setContract(lotteryContract);
  }, [signer]);

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
              onClick={signer ? purchaseTicket : onClickMetamask}
              isLoading={isLoading}
              colorScheme="purple"
              size="lg"
              mb={8}
              width="100%"
              maxW="500px"
              letterSpacing={"10px"}
              fontSize={"40px"}
              textColor={"white"}
            >
              {buttonText}
            </Button>
            <MintModal
              isOpen={isOpen}
              onClose={onClose}
              isWinner={isWinner}
              tokenId={tokenId}
            />
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
              RUG +0.04ETH / Rugged -0.02ETH
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
};

export default App;
