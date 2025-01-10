import React, { useEffect, useState } from 'react';
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
  
  
  useColorMode,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import sun and moon icons
import { invoke } from '@tauri-apps/api/tauri';

interface MenuBarProps {
  createNewFile: () => void;
  openFile: () => void;
  saveFile: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitWindow: () => void;
  buildProject: () => void;
  flashToController: () => void;
  runProject: () => void;
  openFolder: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  createNewFile,
  openFile,
  saveFile,
  zoomIn,
  zoomOut,
  fitWindow,
  buildProject,
  runProject,
  openFolder,
}) => {

  const { isOpen: isAboutUsOpen, onOpen: onOpenAboutUs, onClose: onCloseAboutUs } = useDisclosure();
  const { isOpen: isExitModalOpen, onOpen: onOpenExitModal, onClose: onCloseExitModal } = useDisclosure();
  const { isOpen: isBoardInfoOpen, onOpen: onOpenBoardInfo, onClose: onCloseBoardInfo } = useDisclosure();

  const { toggleColorMode, colorMode } = useColorMode(); // Hook for theme toggle

  const [githubUrl, setGithubUrl] = useState<string>('');
  const aboutUs = `We are a group of students from the 2025 batch of Electronics and Communication Engineering (ECE) at SNMIMT. Our goal is to develop a Rust-based framework specifically designed for embedded systems. This framework is officially supported and paired with our lightweight, easy-to-use IDE called Laplace IDE. For more information, visit our website.`;
  const [boardDetails, setBoardDetails] = useState<string>('');

  const handleShowBoardInfo = async () => {
    try {
      const details = await invoke<string>('get_board_info');
      setBoardDetails(details);
      onOpenBoardInfo();
    } catch (error) {
      console.error('Error fetching board info:', error);
    }
  };

  useEffect(() => {
    // Fetch GitHub URL on component mount
    invoke<string>('get_github_url')
      .then((url) => setGithubUrl(url))
      .catch((err) => console.error('Error fetching GitHub URL:', err));
  }, []);

  const handleExit = () => {
    window.close();
  };

  // Dynamic colors for light and dark modes
  const bgColor = useColorModeValue('#f7f7f7', '#2d2d2d');
  const menuBgColor = useColorModeValue('#fff', '#2d2d2d');
  const hoverBgColor = useColorModeValue('#007acc', '#007acc');
  const textColor = useColorModeValue('black', 'white');

  return (
    <>
      <HStack
        spacing={2}
        padding={1}
        backgroundColor={bgColor} // Menu bar background color
        boxShadow="md"
        height="40px" // Smaller height for a more minimalistic appearance
      >
        {/* File Menu */}
        <Menu>
          <MenuButton as={Button} variant="ghost" size="sm" colorScheme="blue" _hover={{ backgroundColor: hoverBgColor }}>
            File
          </MenuButton>
          <MenuList backgroundColor={menuBgColor} color={textColor} border="none">
            <MenuItem onClick={createNewFile} _hover={{ backgroundColor: hoverBgColor }}>
              New File (Ctrl+N)
            </MenuItem>
            <MenuItem onClick={openFile} _hover={{ backgroundColor: hoverBgColor }}>
              Open File (Ctrl+O)
            </MenuItem>
            <MenuItem onClick={saveFile} _hover={{ backgroundColor: hoverBgColor }}>
              Save File (Ctrl+S)
            </MenuItem>
            <MenuItem onClick={onOpenExitModal} _hover={{ backgroundColor: hoverBgColor }}>
              Exit (Ctrl+Q)
            </MenuItem>
            <MenuItem onClick={openFolder} _hover={{ backgroundColor: hoverBgColor }}>
              Open Folder (Ctrl+Shift+O)
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Other Menus (View, Help, Run) */}
        <Menu>
          <MenuButton as={Button} variant="ghost" size="sm" colorScheme="blue" _hover={{ backgroundColor: hoverBgColor }}>
            View
          </MenuButton>
          <MenuList backgroundColor={menuBgColor} color={textColor} border="none">
            <MenuItem onClick={zoomIn} _hover={{ backgroundColor: hoverBgColor }}>
              Zoom In (Ctrl+Plus)
            </MenuItem>
            <MenuItem onClick={zoomOut} _hover={{ backgroundColor: hoverBgColor }}>
              Zoom Out (Ctrl+Minus)
            </MenuItem>
            <MenuItem onClick={fitWindow} _hover={{ backgroundColor: hoverBgColor }}>
              Fit Window (Ctrl+F)
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Help Menu */}
        <Menu>
          <MenuButton as={Button} variant="ghost" size="sm" colorScheme="blue" _hover={{ backgroundColor: hoverBgColor }}>
            Help
          </MenuButton>
          <MenuList backgroundColor={menuBgColor} color={textColor} border="none">
            <MenuItem onClick={() => window.open(githubUrl)} _hover={{ backgroundColor: hoverBgColor }}>
              GitHub Source Code
            </MenuItem>
            <MenuItem onClick={onOpenAboutUs} _hover={{ backgroundColor: hoverBgColor }}>
              About Us
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Run Menu */}
        <Menu>
          <MenuButton as={Button} variant="ghost" size="sm" colorScheme="blue" _hover={{ backgroundColor: hoverBgColor }}>
            Run
          </MenuButton>
          <MenuList backgroundColor={menuBgColor} color={textColor} border="none">
            <MenuItem onClick={buildProject} _hover={{ backgroundColor: hoverBgColor }}>
              Build (Ctrl+B)
            </MenuItem>
            <MenuItem onClick={runProject} _hover={{ backgroundColor: hoverBgColor }}>
              Run (Ctrl+R)
            </MenuItem>
            <MenuItem onClick={handleShowBoardInfo} _hover={{ backgroundColor: hoverBgColor }}>
              Show Board Info
            </MenuItem>
          </MenuList>
        </Menu>

        {/* Theme Toggle Button with Sun and Moon Icons */}
        <IconButton
          icon={colorMode === 'light' ? <FaMoon /> : <FaSun />} // Sun for light mode, Moon for dark mode
          aria-label="Toggle theme"
          size="sm"
          variant="ghost"
          onClick={toggleColorMode} // Toggle theme
          colorScheme={colorMode === 'light' ? 'blue' : 'orange'} // Button color based on the mode
        />
      </HStack>

      {/* Modals (Exit, About Us, Board Info) */}

      {/* Exit Modal */}
      <Modal isOpen={isExitModalOpen} onClose={onCloseExitModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Exit Application</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to exit the application?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onCloseExitModal}>Cancel</Button>
            <Button colorScheme="red" ml={3} onClick={handleExit}>Exit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* About Us Modal */}
      <Modal isOpen={isAboutUsOpen} onClose={onCloseAboutUs}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>About Us</ModalHeader>
          <ModalBody>
            <Text>{aboutUs}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onCloseAboutUs}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Board Info Modal */}
      <Modal isOpen={isBoardInfoOpen} onClose={onCloseBoardInfo}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Board Information</ModalHeader>
          <ModalBody>
            <Text>{boardDetails}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onCloseBoardInfo}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MenuBar;
