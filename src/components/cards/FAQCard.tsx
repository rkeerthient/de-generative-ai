import { useState } from "react"; 
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { CardProps } from "@yext/search-ui-react";
import ReactMarkdown from "react-markdown";

const FAQCard = ({ result }: CardProps<any>): JSX.Element => {
  const { name, bodyV2 } = result.rawData;
  const [isActive, setIsActive] = useState(false);

  return (
    <div className=" w-full  px-4 py-4 ">
      <div className=" font-light">
        <div onClick={() => setIsActive(!isActive)}>
          <div className="   hover:cursor-pointer  ">
            <span className="font-medium">{name}</span>
            <div style={{ float: "right" }}>
              {isActive ? (
                <ChevronUpIcon className="w-7 text-[#083b3a]" />
              ) : (
                <ChevronDownIcon className="w-7 text-[#083b3a]" />
              )}
            </div>
          </div>
        </div>
        {isActive && (
          <div className="mt-3">
            <ReactMarkdown className="prose-sm w-full list-disc text-left">
              {bodyV2.markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQCard;
