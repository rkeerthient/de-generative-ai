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
import FollowUpButton from "../FollowUpButton";
import { useSearchState } from "@yext/search-headless-react";
import { sanitizeCitations } from "../../utils/sanitizeCitations";

interface MessageCardProps {
  message: Message;
  idx: number;
  initial?: boolean;
}

const MessageCard = ({ message, idx }: MessageCardProps) => {
  const _results = useSearchState((state) => state.universal.verticals)?.map(
    (item) => {
      return item.results;
    }
  );

  const answerCitationSplit = sanitizeCitations(message.text);
  const cleanAnswer = answerCitationSplit && answerCitationSplit[0];
  const citationsArray =
    answerCitationSplit && JSON.parse(answerCitationSplit[1]);
  const sourcesArray =
    citationsArray &&
    citationsArray.map((i: any) => {
      const source = _results
        ?.flat()
        .find((result) => result.rawData.uid === i);
      return source;
    });
  console.log(JSON.stringify(sourcesArray));

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

        <ReactMarkdown className="prose-sm w-full list-disc text-left mb-4">
          {cleanAnswer}
        </ReactMarkdown>
        <SourcesHP sources={sourcesArray} />
        <FollowUpButton />
      </div>
    </li>
  );
};

export default MessageCard;
export const SourcesHP = ({ sources }: any) => {
  const uniqueSources = sources.reduce((accumulator: any, current: any) => {
    if (!accumulator.find((item: any) => item?.id == current?.id)) {
      accumulator.push(current);
    }
    return accumulator;
  }, []);
  return (
    <section className="flex gap-2 flex-wrap mb-4">
      {uniqueSources.map((source: any, i: any) => {
        return (
          <a
            key={i}
            href={
              source?.rawData?.c_file?.url ||
              source?.rawData?.landingPageUrl ||
              source?.rawData?.c_primaryCTA?.link
            }
            target="_blank"
            rel="noreferrer"
          >
            <div
              key={i}
              className="bg-white rounded-md p-2 w-48 flex gap-2 hover:bg-[#0a3366] hover:text-white hover:cursor-pointer text-[#0a3366] transition ease-linear h-full"
            >
              <p className="text-sm text-semibold line-clamp-4">
                {source?.rawData.name}
              </p>
            </div>
          </a>
        );
      })}
    </section>
  );
};
