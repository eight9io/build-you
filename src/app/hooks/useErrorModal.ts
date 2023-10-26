import React, { useState } from "react";

export const useErrorModal = () => {
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [erroModalTitle, setErrorModalTitle] = useState<string>("");
  const [errorModalDescription, setErrorModalDescription] =
    useState<string>("");

  const openErrorModal = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    setErrorModalTitle(title);
    setErrorModalDescription(description);
    setIsErrorModalOpen(true);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  return {
    isErrorModalOpen,
    erroModalTitle,
    errorModalDescription,
    openErrorModal,
    closeErrorModal,
  };
};
