import { useState } from 'react';
import {
  MapPinIcon,
  UserPlusIcon,
  HeartIcon,
  NoSymbolIcon,
  InformationCircleIcon,
  PhotoIcon,
  DocumentIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { GIRL_1_IMAGE } from "../utils/images";

export default function Profile() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="relative">
      {/* Show this button when profile is hidden */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Profile
        </button>
      )}

      {isVisible && (
        <div className="hidden lg:block w-full max-w-xs overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between h-24 p-6">
            <h2 className="text-xl font-bold">Profile Details</h2>
            <button
              className="flex items-center justify-center"
              type="button"
              aria-label="Close"
              onClick={() => setIsVisible(false)}
            >
              <XMarkIcon className="w-6 h-6 text-gray-400" />
            </button>
          </div>
          <div className="flex flex-col p-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-3">
              <img
                className="w-full h-full object-cover"
                width="128"
                height="128"
                src={GIRL_1_IMAGE}
                alt="Profile photo"
              />
            </div>
            <div className="flex flex-col items-center mb-3">
              <h3 className="text-lg font-bold mb-1">Catherine Richardson</h3>
              <p className="flex items-center gap-1 text-gray-400">
                <MapPinIcon className="w-4 h-4" />
                <span className="text-sm">San Francisco, CA</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-gray-400"
                aria-label="Add"
              >
                <UserPlusIcon className="w-6 h-6" />
              </button>
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden text-white bg-red-500"
                aria-label="Like"
              >
                <HeartIcon className="w-6 h-6" />
              </button>
              <button
                className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden text-white bg-fuchsia-500"
                aria-label="Block"
              >
                <NoSymbolIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <h3 className="flex items-center justify-between font-medium">
              <span>User Information</span>
              <InformationCircleIcon className="w-5 h-5 text-gray-400" />
            </h3>
            <p className="flex flex-col">
              <span className="text-sm text-gray-400">Phone</span>
              <span>+01-222-364522</span>
            </p>
            <p className="flex flex-col">
              <span className="text-sm text-gray-400">Email</span>
              <span>catherine.richardson@gmail.com</span>
            </p>
            <p className="flex flex-col">
              <span className="text-sm text-gray-400">Address</span>
              <span>1134 Ridder Park Road, San Fransisco, CA 94851</span>
            </p>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <h3 className="flex items-center justify-between font-medium">
              <span>Last Media</span>
              <PhotoIcon className="w-5 h-5 text-gray-400" />
            </h3>
            <div className="grid grid-cols-3 gap-1">
              {[0, 1, 2].map((index) => {
                return (
                  <img
                    key={index}
                    className="w-full"
                    width="88"
                    height="88"
                    src="https://via.placeholder.com/88/88"
                    alt="Media"
                  />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <h3 className="flex items-center justify-between font-medium">
              <span>Document</span>
              <DocumentIcon className="w-5 h-5 text-gray-400" />
            </h3>

            {[0, 1, 2].map((index) => {
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full overflow-hidden bg-nav text-white">
                    <DocumentIcon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="block truncate">
                      Effects-of-global-warming.docs
                    </span>
                    <span className="text-gray-400 text-xs">
                      {"72.2KB" + " " + "DOCS"}
                    </span>
                  </div>
                  <button className="block shrink-0" aria-label="Document settings">
                    <EllipsisVerticalIcon className="w-6 h-6" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
