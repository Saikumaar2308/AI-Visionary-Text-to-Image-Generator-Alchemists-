import React, { useState, useEffect } from 'react';
import styled from "styled-components";

const API_TOKEN = "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";

 const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: flex-start;
    width:90%;
   background-repeat: no-repeat;
   background-size: cover;
   background-position: center;
   height: 100vh;
   padding: 2rem;
   box-sizing: border-box;
   color: white;
 `;

 const Sidebar = styled.div`
   background-color: #2a2a40;
   padding: 1rem;
   border-radius: 8px;
   width: 20%;
   margin-right: 2rem;
   height: 100%;
   overflow-y: auto;
 `;

 const MainContent = styled.div`
    background-image: url('./../Uploads/AI_BG.webp'); 
   background-repeat: no-repeat;
   background-size: cover;
   background-position: left center;
   background-attachment: fixed;
   margin: 0;
 `;
const Title = styled.h1`
  color: #19A7CE;
`;

const GenForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #10A37F;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0E7B60;
  }
`;

const Loading = styled.div`
  margin-top: 1rem;
`;

const ChatHistory = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ChatMessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #444;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
`;

const ChatMessageContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UserQuery = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #FFEB3B;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #FF6B6B;
  font-size: 1.5rem;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const ResultImage = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const Footer = styled.footer`
  margin-top: 1rem;
  font-size: 12px;
  color: #777;
`;

const ImageGenerationForm = () => {
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [output, setOutput] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [cancel, setCancel] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setOutput(null); // Clear previous output
    setError(null);  //Clear previous error

    const uniqueIdentifier = Date.now(); // Generate a unique identifier (timestamp)
    const userQuery = inputValue;

    //console.log("Sending request with input:", `${query}-${uniqueIdentifier}`);
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({ inputs: `${inputValue}-${uniqueIdentifier}` }), // Append the unique identifier to the input value
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const outputURL = URL.createObjectURL(blob);

      console.log("Image URL:", outputURL);

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { query: userQuery, output: outputURL }
      ]);
      setOutput(outputURL);
      setLoading(false);
      setInputValue(''); // Clear input after submission
    } catch (error) {
      console.error("Failed to generate image:", error);
      setError("Failed to generate image. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (output) {
        URL.revokeObjectURL(output);
      }
    };
  }, [output]);

  const clearChatMessage = (index) => {
    setChatHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const editChatMessage = (index) => {
    setInputValue(chatHistory[index].query);
  //  clearChatMessage(index);
  };

  const closeOutput = () => {
    setOutput(null);
  };

  const regenerateOutput = async (query) => {
    setLoading(true);
    setOutput(null); // Clear previous output
    setError(null);  //Clear previous error

    const uniqueIdentifier = Date.now();  //Generate a unique identifier (timestamp)
    console.log("Sending request with input:", `${query}-${uniqueIdentifier}`);

    try {
      const response = await fetch(
        "https:api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
          body: JSON.stringify({ inputs: `${query}-${uniqueIdentifier}` }), // Append the unique identifier to the input value
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const blob = await response.blob();
      const outputURL = URL.createObjectURL(blob);

      console.log("Image URL:", outputURL);

      setOutput(outputURL);
      setLoading(false);
    } catch (error) {
      console.error("Failed to generate image:", error);
      setError("Failed to generate image. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container>
      <Sidebar>
        <Title>Chat History</Title>
        <ChatHistory>
          {chatHistory.map((message, index) => (
            <ChatMessageContainer key={index} onClick={() => regenerateOutput(message.query)}>
              <ChatMessageContent>
                <UserQuery>{message.query}</UserQuery>
              </ChatMessageContent>
              <EditButton onClick={(e) => { e.stopPropagation(); editChatMessage(index); }}>✎</EditButton>
              <ClearButton onClick={(e) => { e.stopPropagation(); clearChatMessage(index); }}>&times;</ClearButton>
            </ChatMessageContainer>
          ))}
        </ChatHistory>
      </Sidebar>
      <MainContent>
        <Title>Visionary Text-to-Image Generator</Title>
        <GenForm onSubmit={handleSubmit}>
          <Input
            type="text"
            name="input"
            placeholder="Enter text here..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </GenForm>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading && <Loading>Loading...</Loading>}
        {output && (
          <ResultImage>
            
            <Image src={output} alt="Generated art" />
            <CloseButton onClick={closeOutput}>X</CloseButton>
          </ResultImage>
        )}
        <Footer>By AI Alchemists</Footer>
      </MainContent>
    </Container>
  );
};

export default ImageGenerationForm;