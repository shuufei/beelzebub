import { HamburgerIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import { FC, memo } from 'react';
import { useSetupBoard } from '../hooks/use-setup-board';
import { SelectDeckModalDialog } from './select-deck-modal-dialog';

export const BoardSetupMenu: FC = memo(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const setupBoard = useSetupBoard();

  const setup = () => {
    setupBoard();
    return;
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label="board menu"
          icon={<HamburgerIcon />}
          variant="outline"
        ></MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>デッキ選択</MenuItem>
          <MenuItem onClick={setup}>対戦セットアップ</MenuItem>
          <MenuItem>リセット</MenuItem>
        </MenuList>
      </Menu>
      <SelectDeckModalDialog isOpen={isOpen} onClose={onClose} />
    </>
  );
});
