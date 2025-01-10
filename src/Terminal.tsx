import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Box, Input, Button, IconButton, useDisclosure, Collapse } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

// Terminal Component
const Terminal: React.FC = () => {
  const [command, setCommand] = useState<string>(''); // Command entered by the user
  const [output, setOutput] = useState<string[]>([]); // Output of the command
  const [isRunning, setIsRunning] = useState<boolean>(false); // Whether the command is running
  const [history, setHistory] = useState<string[]>([]); // Command history array
  const [historyIndex, setHistoryIndex] = useState<number>(-1); // Index to track the current position in the history
  const { isOpen, onToggle } = useDisclosure(); // Toggle visibility of the terminal

  // Handle running commands
  const runCommand = async () => {
    if (isRunning) return; // Prevent running multiple commands simultaneously
  
    setIsRunning(true); // Command is running
    try {
      // Call the Tauri backend to execute the command
      const result = await invoke('run_command', { command });
  
      // Add the command and output to the terminal
      setOutput((prev: string[]) => [
        ...prev,
        `$ ${command}`, // Display command
        result, // Display result
      ] as string[]); // Explicitly cast the result to string[] to match the expected type
      setHistory((prev) => [...prev, command]);
      setHistoryIndex(-1); // Reset history index to point to the latest command
    } catch (error: any) {
      setOutput((prev: string[]) => [
        ...prev,
        `$ ${command}`,
        `Error: ${error.message || error}`, // Display error message
      ] as string[]); // Explicitly cast the result to string[]
    }
    setCommand(''); // Clear the command input field
    setIsRunning(false); // Command finished running
  };
  

  // Handle key events (Enter, ArrowUp, ArrowDown)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(); // Run the command when Enter is pressed
    } else if (e.key === 'ArrowUp') {
      // Show the previous command from history when ArrowUp is pressed
      if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setCommand(history[history.length - 1 - historyIndex]); // Update input with previous command
      }
    } else if (e.key === 'ArrowDown') {
      // Show the next command from history when ArrowDown is pressed
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setCommand(history[history.length - 1 - historyIndex]); // Update input with next command
      } else if (historyIndex === 0) {
        setHistoryIndex(-1); // Reset if we're at the top of the history
        setCommand(''); // Clear the input field
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      padding="5px"
      backgroundColor="#1e1e1e"
      color="white"
      fontFamily="monospace"
    >
      {/* Hide/Show Button */}
      <IconButton
        aria-label="Toggle Terminal"
        icon={isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
        onClick={onToggle}
        colorScheme="teal"
        size="sm"
        alignSelf="flex-end"
        marginBottom="5px"
      />

      {/* Terminal Output with Collapse */}
      <Collapse in={isOpen}>
        <Box
          flex="1"
          overflowY="auto"
          backgroundColor="#121212"
          borderRadius="5px"
          padding="5px"
          maxHeight="80vh"
          whiteSpace="pre-wrap"
          fontSize="12px" // Small font size for terminal output
        >
          {output.map((line, index) => (
            <pre key={index}>{line}</pre>
          ))}
        </Box>

        {/* Command Input */}
        <Box display="flex" alignItems="center" marginTop="10px">
          <Box color="green">{"$"}</Box>
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown} // Capture keydown events
            backgroundColor="#333"
            color="white"
            border="none"
            placeholder="Type a command..."
            isDisabled={isRunning}
            flex="1"
            size="sm" // Small size for the input
            margin="0" // Remove margin to make it more compact
            fontSize="14px" // Smaller font size
          />
          <Button
            onClick={runCommand}
            isLoading={isRunning}
            colorScheme="teal"
            marginLeft="5px"
            size="sm" // Small size for the button
          >
            Run
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Terminal;
