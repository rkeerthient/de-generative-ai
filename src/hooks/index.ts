import { useContext } from "react";
import {
  ChatModeContext,
  type ChatModeContextType,
} from "../components/ChatModeContext";

export const useChatModeContext = (): ChatModeContextType => {
  const context = useContext(ChatModeContext);
  if (!context) {
    throw new Error(
      "useChatModeContext must be used within a ChatModeContextProvider"
    );
  }
  return context;
};
