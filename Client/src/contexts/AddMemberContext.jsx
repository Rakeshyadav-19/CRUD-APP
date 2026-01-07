/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const AddMemberContext = createContext();

export const useAddMember = () => {
  const context = useContext(AddMemberContext);
  if (!context) {
    throw new Error("useAddMember must be used within AddMemberProvider");
  }
  return context;
};

export const AddMemberProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [teamId, setTeamId] = useState(null);
  const [editMember, setEditMember] = useState(null);

  const openModal = (id) => {
    setTeamId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTeamId(null);
  };

  const openEditModal = (member) => {
    setEditMember(member);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditMember(null);
  };

  return (
    <AddMemberContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        teamId,
        openEditModal,
        closeEditModal,
        isEditOpen,
        editMember,
      }}
    >
      {children}
    </AddMemberContext.Provider>
  );
};
