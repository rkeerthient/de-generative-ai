import {
  HeadlessConfig as ChatHeadlessConfig,
  ChatHeadlessProvider,
  useChatActions,
  useChatState,
} from "@yext/chat-headless-react";
import { ChatInput, ChatPanel } from "@yext/chat-ui-react";
import {
  GetHeadConfig,
  GetPath,
  HeadConfig,
  TemplateProps,
  TemplateRenderProps,
} from "@yext/pages";
import {
  SearchHeadlessProvider,
  VerticalResults,
  provideHeadless,
  useSearchActions,
} from "@yext/search-headless-react";
import { SearchBar, onSearchFunc } from "@yext/search-ui-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BsArrowLeft, BsSend } from "react-icons/bs";
import AiAnswer from "../components/AiAnswer";
import { Button } from "../components/Button";
import { ChatModeContextProvider } from "../components/ChatModeContext";
import SearchResults from "../components/SearchResults";
import Footer from "../components/footer";
import Header from "../components/header";
import searchConfig from "../components/searchConfig";
import { useChatModeContext } from "../hooks";
import "../index.css";
import { cn } from "../utils/cn";

const chatConfig: ChatHeadlessConfig = {
  apiKey: import.meta.env.YEXT_PUBLIC_CHAT_APIKEY,
  botId: import.meta.env.YEXT_PUBLIC_CHAT_BOTID,
  analyticsConfig: {
    endpoint:
      import.meta.env.YEXT_PUBLIC_ACCOUNTTYPE === "PROD"
        ? "https://us.yextevents.com/accounts/me/events"
        : "https://sbx.us.yextevents.com/accounts/me/events",
    baseEventPayload: {
      internalUser: true,
    },
  },
};

export const getPath: GetPath<TemplateProps> = () => {
  return `index.html`;
};

export const getHeadConfig: GetHeadConfig<
  TemplateRenderProps
> = (): HeadConfig => {
  return {
    title: "Search & Chat",
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
  };
};

const searcher = provideHeadless(searchConfig);
const universalLimits = {
  help_articles: 8,
  products: 8,
  locations: 8,
};
function Inner() {
  const searchActions = useSearchActions();
  const chatActions = useChatActions();
  const [hasSearched, setHasSearched] = useState(false);
  const { chatMode, setChatMode } = useChatModeContext();
  const messages = useChatState((s) => s.conversation.messages);
  const [results, setResults] = useState<VerticalResults[]>([]);

  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;
    if (query) {
      setHasSearched(true);
      searchActions.setUniversalLimit(universalLimits);
      searchActions.executeUniversalQuery().then((res) => {
        res && setResults(res.verticalResults);
      });
      chatActions.restartConversation();
      chatActions.getNextMessage(query);
    }
    const queryParams = new URLSearchParams(window.location.search);

    if (query) {
      queryParams.set("query", query);
    } else {
      queryParams.delete("query");
    }
    history.pushState(null, "", "?" + queryParams.toString());
  };

  return (
    <>
      {!chatMode && (
        <div className="centered-container py-8">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Ask a question..."
            customCssClasses={{ searchBarContainer: "my-4" }}
          />
        </div>
      )}

      <section
        className={cn(
          "flex flex-col gap-10",
          !hasSearched && "hidden",
          chatMode && `absolute h-screen top-0`
        )}
      >
        {!chatMode && (
          <>
            <AiAnswer />
            <SearchResults
              results={
                results && results.flatMap((obj) => obj.results).slice(0, 9)
              }
            />
          </>
        )}

        <AnimatePresence>
          {chatMode && (
            <motion.div
              key="chat-panel"
              initial={{ y: "100vh" }}
              animate={{ y: 0 }}
              exit={{ y: "100vh" }}
              transition={{ duration: 0.3 }}
              className="flex w-full h-screen top-0 right-0 object-cover bg-white z-100"
            >
              <div className="w-full h-screen shrink-0 relative">
                <button
                  className="z-50 absolute top-0 left-8 mt-4 mr-4 text-[#0a3366] bg-white shadow rounded-full px-4 py-2"
                  onClick={() => {
                    setChatMode(false);
                  }}
                >
                  <BsArrowLeft className="inline-block w-4 h-4 mr-2 my-auto mx-auto text-[#0a3366]" />
                  Back to Search
                </button>
                <ChatPanel
                  showFeedbackButtons={true}
                  customCssClasses={{
                    inputContainer: "hidden",
                    messagesScrollContainer: "shadow-none my-0 w-full p-6 ",
                    messageBubbleCssClasses: {
                      bubble__user:
                        "bg-none text-sm max-w-3/4 bg-[#0a3366] p-4",
                      bubble__bot: "bg-none text-sm w-3/4 bg-[#e3eefc] p-4",
                    },
                    messagesContainer: `h-[80vh] overflow-scroll`,
                  }}
                />
                <motion.div
                  className="fixed bottom-0 left-0 flex w-full items-center justify-center gap-4 border-t bg-white px-4 py-8 drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <Button
                    onClick={() => {
                      chatActions.setMessages(messages.slice(0, 2));
                      setChatMode(false);
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                    }}
                  >
                    Reset
                  </Button>
                  <ChatInput
                    sendButtonIcon={<BsSend className="text-gray-900" />}
                    customCssClasses={{
                      container: " w-full lg:w-1/2 resize-none",
                      sendButton: "right-2 top-5",
                    }}
                    inputAutoFocus={true}
                  />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}

const GenerativeAI = ({ document }: TemplateProps) => {
  const { _site } = document;
  const { c_header, c_footer } = _site;

  return (
    <div className="h-screen">
      <SearchHeadlessProvider searcher={searcher}>
        <ChatHeadlessProvider config={chatConfig}>
          <ChatModeContextProvider>
            <Header header={c_header} />
            <AnimatePresence>
              <Inner />
            </AnimatePresence>
            <Footer footer={c_footer} />
          </ChatModeContextProvider>
        </ChatHeadlessProvider>
      </SearchHeadlessProvider>
    </div>
  );
};

export default GenerativeAI;
