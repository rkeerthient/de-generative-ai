import { useSearchState } from "@yext/search-headless-react";
import { StandardCard, UniversalResults } from "@yext/search-ui-react";
import { motion } from "framer-motion";
import FAQCard from "./cards/FAQCard";
import LocationsCard from "./cards/LocationsCard";
const GridSection3Col = ({ results, CardComponent, header }: any) => {
  if (!CardComponent) {
    return <div>Missing Card Component</div>;
  }
  return (
    <div>
      <div>{header}</div>
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-8 ">
        {results.map((r: any, index: number) => (
          <CardComponent key={index} result={r} />
        ))}
      </div>
    </div>
  );
};
const hiddenGrid = ({ results, CardComponent, header }: any) => {
  if (!CardComponent) {
    return <div>Missing Card Component</div>;
  }
  return (
    <div className="hidden">
      <div>{header}</div>
      <div className="grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-8 ">
        {results.map((r: any, index: number) => (
          <CardComponent key={index} result={r} />
        ))}
      </div>
    </div>
  );
};
const SearchResultsSection = () => {
  const lastSearch = useSearchState((state) => state.query.mostRecentSearch);

  return (
    <div
      className="mx-auto flex min-h-[75vh] w-full flex-col gap-6 "
      id="results"
    >
      <UniversalResults
        showAppliedFilters={true}
        customCssClasses={{
          universalResultsContainer: "w-full mx-auto my-6 ",
        }}
        verticalConfigMap={{
          help_articles: {
            CardComponent: FAQCard,
            viewAllButton: true,
            label: "Help Articles",
          },
          faqs: {
            CardComponent: FAQCard,
            viewAllButton: true,
            label: "Help Articles",
          },

          products: {
            CardComponent: StandardCard,
            SectionComponent: GridSection3Col,
            label: "Products",
            viewAllButton: true,
          },

          locations: {
            CardComponent: StandardCard,
            SectionComponent: hiddenGrid,
            viewAllButton: false,
          },
        }}
      />
    </div>
  );
};

export default SearchResultsSection;
