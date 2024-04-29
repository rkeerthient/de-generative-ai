import { CardProps } from "@yext/search-ui-react";
import React from "react";
import { MdDirections } from "react-icons/md";

const LocationsCard = ({ result }: CardProps<any>): JSX.Element => {
  return (
    <div className="flex flex-row border p-4">
      <div className="flex w-full flex-col gap-y-2 py-6">
        <a
          target="_blank"
          className="font-medium text-slate-800 hover:underline"
          href={result.rawData.c_deployedURL ?? "/"}
        >
          {result.rawData.name}
        </a>
        <div className="text-sm text-slate-800">
          {result.rawData.address.line1}
        </div>
        <div className="text-sm text-slate-800">
          {result.rawData.address.city}, {result.rawData.address.region}{" "}
          {result.rawData.address.postalCode}
        </div>
      </div>
      <a
        target="_blank"
        href={`https://www.google.com/maps/dir/?api=1&destination=${result.rawData.yextDisplayCoordinate.latitude},${result.rawData.yextDisplayCoordinate.longitude}`}
        className="mx-auto my-auto flex flex-col gap-y-2"
      >
        <div className="mx-auto rounded-full border border-blue-800/50 p-1">
          <MdDirections className="h-7 w-7 text-blue-900" />
        </div>
        <div className="text-sm text-blue-900">Directions</div>
      </a>
    </div>
  );
};

export default LocationsCard;
