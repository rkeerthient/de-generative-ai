const SearchResults = ({ results }: any) => {
  return (
    <section className="flex flex-col gap-4 mb-8 h-screen centered-container">
      {results.map((result: any) => {
        return (
          <div
            key={result.index}
            className="border border-gray-300 px-8 py-4 rounded-lg  text-stone-900 flex scroll-mt-6 w-full"
            id={result.index}
          >
            <div>
              <p className="mb-2 font-light italic">
                <span className="font-semibold not-italic">Segment: </span>
                {result.highlightedFields?.s_snippet?.value}
              </p>
              <div className="flex gap-1">
                <p className="font-semibold">Source:</p>
                <a
                  className="hover:cursor-pointer hover:underline w-fit text-blue-600"
                  href={
                    result.rawData.landingPageUrl ||
                    result.rawData.c_primaryCTA.link ||
                    "Yext.com"
                  }
                >
                  <div>{result.rawData.name}</div>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default SearchResults;
