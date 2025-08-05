import { Dispatch, SetStateAction, useCallback } from "react";
import { Notification } from "../../../types";

export const useAddNotification = (
  setNotifications: Dispatch<SetStateAction<Notification[]>>
) => {
  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  return { addNotification };
};
