import { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import { useToast, type _Toast } from "../contexts";
import type { FC } from "react";

const Toast: FC<_Toast> = ({ id, type, message }) => {
  const [isShowing, setIsShowing] = useState(true);
  const { removeToast } = useToast();

  const renderIcon = (type: string) => {
    if (type === "success")
      return (
        <CheckCircleIcon className="h-6 w-6 text-green-600 lg:h-8 lg:w-8" />
      );
    if (type === "error")
      return <XCircleIcon className="h-6 w-6 text-red-600 lg:h-8 lg:w-8" />;
    if (type === "info")
      return (
        <ExclamationCircleIcon className="h-6 w-6 text-blue-600 lg:h-8 lg:w-8" />
      );
  };

  return (
    <Transition
      as="button"
      show={isShowing}
      appear={true}
      enter="transition transform"
      enterFrom="translate-y-full scale-90 opacity-0"
      enterTo="translate-y-0 scale-100 opacity-100"
      leave="transition transform"
      leaveFrom="translate-y-0 scale-100 opacity-100"
      leaveTo="translate-y-full scale-90 opacity-0"
      onClick={() => {
        setIsShowing(false);
        removeToast(id);
      }}
      afterEnter={() => {
        setTimeout(() => {
          setIsShowing(false);
          removeToast(id);
        }, 5000);
      }}
      className={`flex w-full items-center space-x-1 rounded-lg border border-gray-200 bg-white p-2 text-left text-xs text-gray-900 shadow-md lg:space-x-2 lg:p-4 lg:text-sm`}
    >
      <span>{renderIcon(type)}</span>
      <span>{message}</span>
    </Transition>
  );
};

export default Toast;
