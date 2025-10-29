import { Box, Portal } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";

import { useGeneralStore } from "@/store";
import { Toast } from "../Toast";
import { useRef } from "react";

export const ToastProvider = ({ children }: { children: any }) => {
  const toasts = useGeneralStore((state) => state.toasts);
  const handleRemoveToast = useGeneralStore((state) => state.clearToasts);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    // <ToastContext.Provider value={vals}>
    <Box
      height={"100vh"}
      width={"100%"}
      pos={"relative"}
      ref={containerRef}
      // overflow={"hidden"}
    >
      {children}
      <Portal>
        <AnimatePresence>
          {toasts &&
            toasts.map((toast, idx) => {
              return (
                <Toast
                  key={idx}
                  cw={containerRef.current?.offsetWidth || 0}
                  data={toast}
                  onClose={() => handleRemoveToast()}
                />
              );
            })}
        </AnimatePresence>
      </Portal>
    </Box>
    // </ToastContext.Provider>
  );
};
// <Toast data={state.toast} onClose={() => handleRemoveToast()} />;
