/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const SendMailContext = createContext();

export const useSendMail = () => {
  const context = useContext(SendMailContext);
  if (!context) {
    throw new Error("useSendMail must be used within SendMailProvider");
  }
  return context;
};

export const SendMailProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);

  const openModal = (member) => {
    setRecipient(member);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRecipient(null);
  };

  return (
    <SendMailContext.Provider
      value={{ isOpen, openModal, closeModal, recipient }}
    >
      {children}
    </SendMailContext.Provider>
  );
};
