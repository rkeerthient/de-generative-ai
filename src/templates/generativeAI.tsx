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
import { useEffect, useState } from "react";
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

function Inner() {
  const searchActions = useSearchActions();
  const chatActions = useChatActions();
  const [hasSearched, setHasSearched] = useState(false);
  const { chatMode, setChatMode } = useChatModeContext();
  const messages = useChatState((s) => s.conversation.messages);
  const [results, setResults] = useState<VerticalResults[]>([]);
  const isLoading =
    useChatState((state) => state.conversation.isLoading) || false;

  const handleSearch: onSearchFunc = (searchEventData) => {
    const { query } = searchEventData;
    const queryParams = new URLSearchParams(window.location.search);

    if (query) {
      runSearch(query);
      queryParams.set("query", query);
    } else {
      queryParams.delete("query");
    }

    history.pushState(null, "", "?" + queryParams.toString());
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const query = queryParams.get("query");

    if (query) {
      runSearch(query);
    }
  }, []);

  const runSearch = (query: string) => {
    setHasSearched(true);
    searchActions.setQuery(query);
    searchActions.executeUniversalQuery().then((res) => {
      res && setResults(res.verticalResults);
      chatActions.restartConversation();
      chatActions.getNextMessage(query);
    });
  };

  useEffect(() => {
    const context = chatMode
      ? {}
      : {
          userId: "1234",
          businessId: "3472542",
        };
    chatActions.setContext(context);
  }, [chatMode]);

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
            {results.length <= 1 ? (
              <div
                className="flex items-center justify-center h-[60vh]"
                role="status"
              >
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <SearchResults
                results={
                  results && results.flatMap((obj) => obj.results).slice(0, 9)
                }
              />
            )}
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
                        "prose-sm bg-none text-sm max-w-3/4 bg-[#0a3366] p-4",
                      bubble__bot:
                        "prose-sm bg-none text-sm w-3/4 bg-[#e3eefc] p-4",
                    },
                    messagesContainer: `h-[80vh] overflow-scroll`,
                  }}
                />
                <motion.div
                  className={`fixed bottom-0 left-0 flex w-full items-center justify-center gap-4 border-t bg-white px-4 py-8 drop-shadow-lg ${isLoading && `!opacity-50 pointer-events-none`}`}
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
                    sendButtonIcon={
                      isLoading ? (
                        <div className="!-mt-[0.75em] inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-[#0a3366]">
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                            Loading...
                          </span>
                        </div>
                      ) : (
                        <BsSend className="text-gray-900" />
                      )
                    }
                    customCssClasses={{
                      container: `w-full lg:w-1/2 resize-none`,
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
