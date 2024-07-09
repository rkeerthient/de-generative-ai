import { FaMagic } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import {
  Message,
  useChatActions,
  useChatState,
} from "@yext/chat-headless-react";
import { cn } from "../../utils/cn";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/20/solid";
import { useCallback, useState } from "react";
import { useChatModeContext } from "../../hooks";

interface MessageCardProps {
  message: Message;
  idx: number;
  initial?: boolean;
}

const MessageCard = ({ message, idx }: MessageCardProps) => {
  const { setShowToast } = useChatModeContext();
  const [selectedThumb, setSelectedThumb] = useState("");
  const chatActions = useChatActions();

  const conversationId = useChatState(
    (state) => state.conversation.conversationId
  );
  const onReport = useCallback(
    async (actionType: string) => {
      setSelectedThumb(actionType);
      await chatActions
        .report({
          action: actionType === "THUMBS_UP" ? "THUMBS_UP" : "THUMBS_DOWN",
          chat: {
            responseId: message.responseId,
            conversationId: conversationId,
          },
        })
        .then(() => {
          setShowToast(true);
        });
    },
    [chatActions]
  );

  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-2xl p-4 transition-all ",
        message.source === "USER" ? "w-fit self-end bg-gray-100" : "bg-sky-100"
      )}
      key={idx}
    >
      <div className="centered-container">
        {message.source === "BOT" && (
          <div className="flex justify-between">
            <div className="flex">
              <FaMagic className="my-auto mr-2 inline-block h-4 w-4" />
              <h3 className="my-0">AI Answer</h3>
            </div>
            {message.source === "BOT" && (
              <div className="flex gap-2">
                <HandThumbUpIcon
                  className={`h-4 w-4 ${
                    selectedThumb !== "THUMBS_UP"
                      ? "cursor-pointer text-gray-500 "
                      : "pointer-events-none cursor-not-allowed text-black"
                  }`}
                  onClick={() =>
                    selectedThumb !== "THUMBS_UP" && onReport("THUMBS_UP")
                  }
                />

                <HandThumbDownIcon
                  className={`h-4 w-4 ${
                    selectedThumb !== "THUMBS_DOWN"
                      ? "cursor-pointer text-gray-500 "
                      : "pointer-events-none cursor-not-allowed text-black"
                  }`}
                  onClick={() =>
                    selectedThumb !== "THUMBS_DOWN" && onReport("THUMBS_DOWN")
                  }
                />
              </div>
            )}
          </div>
        )}

        <ReactMarkdown className="prose-sm w-full list-disc text-left">
          {message.text}
        </ReactMarkdown>
      </div>
    </li>
  );
};

export default MessageCard;
