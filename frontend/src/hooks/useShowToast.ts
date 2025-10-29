import { ToastStatus, useGeneralStore } from "@/store";

export const useShowToast = () => {
  const handleAddToast = useGeneralStore((state) => state.addToast);
  const showToast = (status: ToastStatus, message: string, delay = 3000) => {
    handleAddToast({ status, message, delay });
  };
  return { showToast };
};
