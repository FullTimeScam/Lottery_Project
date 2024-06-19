import {
  Button,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenId: number | null;
  isWinner: boolean | null;
}

const MintModal: FC<MintModalProps> = ({
  isOpen,
  onClose,
  tokenId,
  isWinner,
}) => {
  const imgUrl =
    "https://lavender-neat-porcupine-347.mypinata.cloud/ipfs/QmdAsAtaS9USqzbPyKpJ5aVhoeJug9e47hjhYygKyLLprx/";

  const { width, height } = useWindowSize();

  return (
    <>
      {isOpen && <ReactConfetti width={width} height={height} />}
      {isOpen && isWinner && <ReactConfetti width={width} height={height} />}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.1)" />

        {isOpen && <ReactConfetti width={width} height={height} />}

        <ModalContent
          border="1px solid"
          borderColor="win95.darkGray"
          boxShadow="lg"
          maxW="600px"
        >
          <ModalHeader
            bgColor="win95.blue"
            color="white"
            borderBottom="4px solid"
            borderColor="win95.darkGray"
            fontSize="24px"
            fontWeight="bold"
            letterSpacing={"0.1em"}
          >
            Rug Or Ruggrd
          </ModalHeader>
          {isOpen && <ReactConfetti width={width} height={height} />}
          <ModalCloseButton
            position="absolute"
            top="4px"
            right="4px"
            border="2px solid"
            borderColor="win95.darkGray"
            bgColor="win95.lightGray"
            _hover={{ bgColor: "win95.gray" }}
          />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            bgColor="win95.gray"
            color="black"
            px={4}
            py={8}
          >
            <Image
              alignSelf="center"
              w={80}
              h={80}
              src={
                isWinner ? `${imgUrl}WIN.png` : `${imgUrl}rugged_${tokenId}.png`
              }
              alt="NFT Image"
            />
            <Text
              fontSize={24}
              fontWeight="semibold"
              textColor={"red.500"}
              letterSpacing={"0.1em"}
            >
              {isWinner ? "WIN" : `ROR#${tokenId}`}
            </Text>
            <Text
              fontSize={"52px"}
              textAlign="center"
              fontWeight="bold"
              color="win95.black"
              letterSpacing={"0.05em"}
              whiteSpace="pre-line"
            >
              {isWinner
                ? "Winner Winner Chicken Dinner!\nYou Rugged Me Degen!"
                : "You Rugged!!!\nKimchi Hehehe :)"}
            </Text>
          </ModalBody>
          <Divider borderColor="win95.darkGray" />
          <ModalFooter
            bgColor="win95.lightGray"
            borderTop="1px solid"
            borderColor="win95.darkGray"
            justifyContent="center"
          >
            <Button
              fontSize={"24px"}
              w={"120px"}
              onClick={onClose}
              bgColor="win95.lightGray"
              color="black"
              border="2px solid"
              borderColor="win95.darkGray"
              _hover={{ bgColor: "win95.gray" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MintModal;
