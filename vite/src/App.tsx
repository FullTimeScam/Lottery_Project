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
  Link,
  IconButton,
  Grid,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { ethers, JsonRpcSigner, parseEther } from "ethers";
import { FC, useEffect, useState } from "react";
import LotteryAbi from "./abis/LotteryAbi.json";
import MintModal from "./components/MintModal";
import { FaTelegram, FaDiscord, FaXTwitter } from "react-icons/fa6";
// import MouseFollower from "./components/MouseFollowe";

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
  const isLargerThan1280 = useBreakpointValue({ base: false, xl: true });

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
      setButtonText("Go Rug, Degen!");
    }
  }, [signer]);

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
      text: "0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a: +0.04ETH",
      loading: false,
    },
    {
      text: "0xE92d1A43df510F82C66382592a047d288f85226f: -0.02ETH",
      loading: false,
    },
    {
      text: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045: +0.04ETH",
      loading: false,
    },
    {
      text: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B: +0.04ETH",
      loading: false,
    },
    {
      text: "0xc57eA958E33dc87c7C7951774bab9221346bA26f: -0.02ETH",
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
      bg="win95.warmYellow"
      width="100%"
    >
      {/* <MouseFollower /> */}
      <Flex width="100%" mx="auto">
        {/* left영역 시작 */}
        {isLargerThan1280 && (
          <Flex
            flex={1}
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            <Box
              mt="auto"
              mb={4}
              display="flex"
              justifyContent="space-between"
              width="200px"
            >
              <Link href="https://x.com/FulltimeScam" isExternal>
                <IconButton
                  as="span"
                  aria-label="Twitter"
                  icon={<FaXTwitter />}
                  fontSize="40px"
                  color="black"
                  _hover={{ color: "blue" }}
                  variant="ghost"
                />
              </Link>
              <Link href="https://t.me/fulltime_scam" isExternal>
                <IconButton
                  as="span"
                  aria-label="Telegram"
                  icon={<FaTelegram />}
                  fontSize="40px"
                  color="black"
                  _hover={{ color: "blue" }}
                  variant="ghost"
                />
              </Link>
              <Link href="https://discord.gg/zdC7kChdjg" isExternal>
                <IconButton
                  as="span"
                  aria-label="Discord"
                  icon={<FaDiscord />}
                  fontSize="40px"
                  color="black"
                  _hover={{ color: "blue" }}
                  variant="ghost"
                />
              </Link>
            </Box>
          </Flex>
        )}
        {/* left영역 끝 */}
        {/* middle영역 시작 */}
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
            py={3}
            px={3}
            boxShadow="md"
            rounded="md"
            textAlign="center"
            textColor={"white"}
            width="full"
            maxW="800px"
            minW={"500px"}
          >
            <Text fontSize={"xl"}>Ticket Price : 0.02ETH</Text>
            <Text
              fontSize={"4xl"}
              textColor={"orange"}
              textDecoration="underline"
            >
              Win Rate: 50% (No SCAM!!)
            </Text>
            <Box fontSize={"4xl"} border={"3px solid red"} px={"17px"}>
              RUG +0.04ETH / Rugged -0.02ETH
            </Box>
            <Text mb={4} fontSize={"5xl"}>
              Try to Rug me, Degen :)
            </Text>

            <Text mb={2} fontSize={"25px"}>
              RECENT PLAYS
            </Text>
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
        {/* middle영역 끝 */}
        {/* right영역 시작 */}
        {isLargerThan1280 && (
          <Flex
            flex={1}
            alignItems="center"
            justifyContent="center"
            direction="column"
            textAlign="center"
          >
            <Box
              border={"2px solid"}
              borderColor="win95.gray"
              rounded={"20px"}
              p={4}
            >
              <Text fontSize="40px" fontWeight="bold" mb={4}>
                OUR BACKERS
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <Image src="./SBF.png" alt="FTX" boxSize="120px" />
                <Image src="./Kwon-Do.png" alt="Kwon.Do" boxSize="120px" />
                <Image src="./Quadriga.png" alt="Quadriga" boxSize="120px" />
                <Image
                  src="./bitconnect.png"
                  alt="BitConnect"
                  boxSize="120px"
                />
                <Image src="./OneCoin.png" alt="OneCoin" boxSize="120px" />
                <Image src="./SQUID.png" alt="$SQUID" boxSize="120px" />
              </Grid>
            </Box>
          </Flex>
        )}
        {/* right영역 끝 */}
      </Flex>
    </Flex>
  );
};

export default App;
