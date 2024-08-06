const SearchResults = ({ results }: any) => {
  return (
    <section className="flex flex-col gap-4 mb-8 centered-container">
      {results.map((result: any) =>
        result.source && result.source === "DOCUMENT_VERTICAL" ? (
          <div
            key={result.id}
            className="border border-gray-300 px-8 py-4 rounded-lg  text-stone-900 flex scroll-mt-6 w-full"
          >
            <div>
              <p className="mb-2 font-light italic">
                <span className="font-semibold not-italic">Segment: </span>
                {result.segment?.text}
              </p>

              <div className="flex gap-1">
                <p className="font-semibold">Source:</p>
                <a
                  className="hover:cursor-pointer hover:underline w-fit text-blue-600"
                  href={result.rawData.c_file.url}
                >
                  <div>{result.rawData.name}</div>
                </a>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold">Relevance Score:</p>
                <p className="font-light">{result.segment.score}</p>
              </div>
            </div>
          </div>
        ) : (
          <div
            key={result.rawData.id}
            className="border border-gray-300 px-8 py-4 rounded-lg  text-stone-900 flex scroll-mt-6 w-full"
          >
            <div>
              {result.s_snippet ? (
                <p className="mb-2 font-light italic">
                  <span className="font-semibold not-italic">Segment: </span>
                  {result.s_snippet}
                </p>
              ) : (
                result.highlightedFields.s_snippet && (
                  <p className="mb-2 font-light italic">
                    <span className="font-semibold not-italic">Segment: </span>
                    {result.highlightedFields?.s_snippet?.value}
                  </p>
                )
              )}
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
        )
      )}
    </section>
  );
};

export default SearchResults;
