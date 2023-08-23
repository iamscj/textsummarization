import React, { useState } from 'react';
import { Box, Heading, Textarea, Button, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

const Predict = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handlePredictClick = async () => {
        // Set the loading state to true before making the API request
        setIsLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/predict', {
                params: {
                    input_text: inputText // Pass the inputText as a query parameter
                }
            });
            setOutputText(response.data.output_text);
        }
        catch (e) {
            console.log(e);
        }
        setIsLoading(false);
    };
    // console.log(inputText)
    return (
        <Box p={4} bgGradient="linear(to bottom, #000000, #222222)" minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
            <VStack spacing={4} align="center" w="100%" maxW="400px" fontFamily="Caveat, cursive">
                <Heading as="h1" size="xl" color="white" fontFamily="inherit">
                    Text Summarization
                </Heading>
                <Textarea
                    placeholder="Enter text here..."
                    value={inputText}
                    onChange={handleInputChange}
                    rows={12}
                    borderRadius="md"
                    color="black"
                    bg="white"
                    _placeholder={{ color: 'gray.400' }}
                />
                <Button colorScheme="blue" onClick={handlePredictClick} isLoading={isLoading}>
                    {isLoading ? 'Loading...' : 'Get Summarized Output'}
                </Button>
                <Text color="white">{outputText}</Text>
            </VStack>
        </Box>
    );
};

export default Predict;
