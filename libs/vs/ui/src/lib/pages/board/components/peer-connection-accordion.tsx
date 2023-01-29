import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  Input,
  Text,
} from '@chakra-ui/react';
import { FC, memo, useCallback, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useInitializePeerConnection } from '../hooks/use-initialize-peer-connection';
import { useSubscribePeerConnection } from '../hooks/use-subscribe-peer-connection';
import { dataConnectionState } from '../state/data-connection-state';
import { peerIdState } from '../state/peer-id-state';

export const PeerConnectionSetUpAccordion: FC<{ skywayApiKey: string }> = memo(
  ({ skywayApiKey }) => {
    const [peerId] = useRecoilState(peerIdState);
    const connection = useRecoilValue(dataConnectionState);
    const { connectRemote } = useInitializePeerConnection(skywayApiKey);
    const [remotePeerId, setRemotePeerId] = useState('');
    useSubscribePeerConnection();

    const connect = useCallback(() => {
      if (remotePeerId == null) {
        return;
      }
      connectRemote(remotePeerId);
    }, [connectRemote, remotePeerId]);

    return (
      <Accordion defaultIndex={[0]} allowToggle bg={'gray.50'}>
        <AccordionItem>
          <h2>
            <AccordionButton fontSize={'sm'}>
              <Box
                as="span"
                flex="1"
                textAlign={'left'}
                fontWeight={'semibold'}
                display={'flex'}
                alignItems={'center'}
                gap={1}
              >
                {connection == null ? '未接続' : '接続済み'}
                <Box
                  h={2}
                  w={2}
                  borderRadius={'full'}
                  bg={connection == null ? 'red.500' : 'green.500'}
                ></Box>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>
            <Box maxW={'96'}>
              <HStack>
                <Input
                  type="text"
                  size={'sm'}
                  bg={'white'}
                  onChange={(event) => {
                    setRemotePeerId(event.target.value);
                  }}
                ></Input>
                <Button onClick={connect} size={'sm'} colorScheme={'blue'}>
                  接続
                </Button>
              </HStack>
              <HStack mt={2} fontSize={'sm'}>
                <Text>peerId: </Text>
                <Text fontWeight={'semibold'}>{peerId}</Text>
              </HStack>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    );
  }
);
