import { CheckIcon } from '@heroicons/react/24/solid';

export default function ThreadStatus({ readed, newMessages }) {
  return (
    <div className="relative flex items-center justify-center w-4 h-4 shrink-0 text-green-500">
      {newMessages ? (
        <span className="flex items-center justify-center w-full h-full text-xs text-white rounded-full bg-red-600">
          {newMessages}
        </span>
      ) : null}
      {readed && !newMessages ? <CheckIcon className="w-full h-full" /> : null}
    </div>
  );
}
