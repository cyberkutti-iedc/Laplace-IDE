import { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  extendTheme,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
  Center
} from '@chakra-ui/react';
import MonacoEditor from '@monaco-editor/react';
import { invoke } from '@tauri-apps/api/tauri';
import { dialog, window as tauriWindow } from '@tauri-apps/api';
import MenuBar from './MenuBar';
import TabBar from './TabBar';
import SerialMonitor from './SerialMonitor';
import SplashScreen from './SplashScreen';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: true,
  },
  colors: {
    suggestionBackground: '#1E1E1E',
    suggestionText: '#D4D4D4',
    suggestionHighlight: '#569CD6',
    background: '#1E1E1E',
    text: '#D4D4D4',
    primary: '#007ACC',
    secondary: '#3C3C3C',
    accent: '#569CD6',
    error: '#F44747',
    warning: '#FF8800',
    info: '#007ACC',
    success: '#4CAF50',
  },
  styles: {
    global: {
      body: {
        bg: 'background',
        color: 'text',
      },
    },
  },
});

const App = () => {
  const [code, setCode] = useState('// Write your Rust code here\n');
  const [fontSize, setFontSize] = useState(14);
  const [filePath, setFilePath] = useState<string | null>(null);

  const [editorTabs, setEditorTabs] = useState<Array<{ path: string; content: string }>>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const toast = useToast();
  const { isOpen, onClose } = useDisclosure();
  const [pendingAction] = useState<'quit' | null>(null);
  const [, setConfirmOpen] = useState(false);
  const [elfFilePath] = useState<string | null>(null);
  const [selectedPort] = useState<string>('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [isLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false); // Close the splash screen after 20 seconds
    }, 20000); // 20 seconds

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const openFolder = async () => {
    try {
      const folderPath = await dialog.open({
        directory: true,
      });

      if (typeof folderPath === 'string') {
        toast({
          title: 'Folder Opened',
          description: `You opened the folder: ${folderPath}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'No Folder Selected',
          description: 'You did not select a folder.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Error Opening Folder',
          description: `There was an error opening the folder: ${error.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Unexpected Error',
          description: 'An unknown error occurred while opening the folder.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const openFile = async () => {
    const path = await dialog.open();
    if (typeof path === 'string') {
      const fileContent = await invoke<string>('open_file', { path });
      setEditorTabs((prev) => [...prev, { path, content: fileContent }]);
      setActiveTab(editorTabs.length);
    }
  };

  const saveFile = async () => {
    try {
      const activeFile = editorTabs[activeTab];
      if (activeFile.path) {
        await invoke('save_file', { path: activeFile.path, content: activeFile.content });
        toast({
          title: 'File Saved',
          description: 'The file has been saved successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        let path = await dialog.save({
          filters: [{ name: 'Rust File', extensions: ['rs'] }],
        });
        if (typeof path === 'string') {
          if (!path.endsWith('.rs')) {
            path += '.rs';
          }
          const updatedTabs = [...editorTabs];
          updatedTabs[activeTab].path = path;
          setEditorTabs(updatedTabs);
          setFilePath(path);
          await invoke('save_file', { path, content: activeFile.content });
          toast({
            title: 'File Saved',
            description: 'The file has been saved successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'There was an error saving the file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createNewFile = () => {
    setCode('// New Rust code here\n');
    setFilePath(null);
    setEditorTabs((prev) => [...prev, { path: '', content: code }]);
    setActiveTab(editorTabs.length);
  };

  const closeTab = (index: number) => {
    setEditorTabs((prevTabs) => {
      const newTabs = prevTabs.filter((_, i) => i !== index);
      if (index === activeTab && newTabs.length > 0) {
        setActiveTab(index === 0 ? 0 : index - 1);
      } else if (newTabs.length === 0) {
        setCode('// Write your Rust code here\n');
        setFilePath(null);
        setActiveTab(0);
      }
      return newTabs;
    });
  };

  const zoomIn = () => setFontSize((prev) => prev + 1);
  const zoomOut = () => setFontSize((prev) => prev - 1);

  const buildProject = async () => {
    try {
      const activeFile = editorTabs[activeTab];
      if (!activeFile || !activeFile.path.endsWith('main.rs')) {
        throw new Error('Please open the main.rs file to build the project');
      }

      const buildResult = await invoke<string>('build_project', { filePath: activeFile.path });
      console.log(buildResult);
      toast({
        title: "Build Started",
        description: "A terminal window has been opened to build the project.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Build failed:', error);
      toast({
        title: "Build Failed",
        description: `There was an error starting the build: ${error.message || error}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const runProject = async () => {
    try {
      const activeFile = editorTabs[activeTab];
      if (!activeFile || !activeFile.path.endsWith('main.rs')) {
        throw new Error('Please open the main.rs file to run the project');
      }

      const runResult = await invoke<string>('run_project', { filePath: activeFile.path });
      console.log(runResult);
      toast({
        title: "Run Started",
        description: "A terminal window has been opened to run the project.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Run failed:', error);
      toast({
        title: "Run Failed",
        description: `There was an error starting the project: ${error.message || error}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const flashToController = async () => {
    if (!elfFilePath || !selectedPort) {
      toast({
        title: "Missing Information",
        description: "Please select a valid port and ELF file before flashing.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsFlashing(true);
    setConfirmOpen(true);

    try {
      const result = await invoke<string>('flash_controller', { elfFilePath, port: selectedPort });
      toast({
        title: "Success",
        description: result,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to flash the controller: ${error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsFlashing(false);
      setConfirmOpen(false);
    }
  };

  const handleQuit = async () => {
    if (pendingAction === 'quit') {
      try {
        await invoke('exit');
      } catch (error) {
        console.error('Failed to invoke exit:', error);
        toast({
          title: 'Error',
          description: 'Failed to exit the application.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      try {
        await tauriWindow.appWindow.close();
      } catch (error) {
        console.error('Failed to close window:', error);
        toast({
          title: 'Error',
          description: 'Failed to close the application window.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
    onClose();
  };

  // Add keyboard event listener for shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      // Save shortcut: Ctrl + S or Command + S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveFile();
      }
      // New file shortcut: Ctrl + N or Command + N
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        createNewFile();
      }
      // Open file shortcut: Ctrl + O or Command + O
      if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
        event.preventDefault();
        openFile();
      }
      // Open folder shortcut: Ctrl + Shift + O
      if ((event.ctrlKey || event.metaKey) && event.key === 'O' && event.shiftKey) {
        event.preventDefault();
        openFolder();
      }
    
      // Zoom in shortcut: Ctrl + +
      if ((event.ctrlKey || event.metaKey) && event.key === '+') {
        event.preventDefault();
        zoomIn();
      }
      // Zoom out shortcut: Ctrl + -
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        zoomOut();
      }
      // Build project shortcut: Ctrl + Shift + B
      if ((event.ctrlKey || event.metaKey) && event.key === 'B' && event.shiftKey) {
        event.preventDefault();
        buildProject();
      }
      // Run project shortcut: Ctrl + Shift + R
      if ((event.ctrlKey || event.metaKey) && event.key === 'R' && event.shiftKey) {
        event.preventDefault();
        runProject();
      }
      // Flash project shortcut: Ctrl + Shift + F
      if ((event.ctrlKey || event.metaKey) && event.key === 'F' && event.shiftKey) {
        event.preventDefault();
        flashToController();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [saveFile, createNewFile, openFile, openFolder,  zoomIn, zoomOut, buildProject, runProject, flashToController]);


  if (isAppLoading) {
    return <SplashScreen />;
  }

  return (
    <ChakraProvider theme={theme}>
      <Box height="100vh" display="flex" flexDirection="column">
        {isLoading && (
          <Center height="100%" width="100%">
            <Spinner size="xl" />
          </Center>
        )}

        {isFlashing && (
          <Center height="100%" width="100%">
            <Spinner size="xl" />
          </Center>
        )}

        <MenuBar
          createNewFile={createNewFile}
          openFile={openFile}
          saveFile={saveFile}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          fitWindow={() => { setFontSize(16); }}
          buildProject={buildProject}
          runProject={runProject}
          flashToController={flashToController}
          openFolder={openFolder}
        />

        <Box flex={1} display="flex" flexDirection="row" overflow="hidden">
          <SerialMonitor />
          <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
            <TabBar
              tabs={editorTabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              closeTab={closeTab}
            />
            <div>
              {filePath ? `Current File: ${filePath}` : 'Keep Coding'}
            </div>
            <Box flex={1} backgroundColor="gray.800" overflow="hidden">
              <MonacoEditor
                width="100%"
                height="100%"
                language="rust"
                theme="vs-dark"
                value={editorTabs[activeTab]?.content ?? ''}
                options={{ fontSize }}
                onMount={() => {}}
                onChange={(value) => {
                  if (typeof value === 'string') {
                    setEditorTabs((prevTabs) => {
                      const newTabs = [...prevTabs];
                      newTabs[activeTab].content = value;
                      return newTabs;
                    });
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Quit</ModalHeader>
          <ModalBody>
            Are you sure you want to quit Niti IDE? 😔
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleQuit}>
              Yes, Quit
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
};

export default App;
