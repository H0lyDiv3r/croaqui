import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getNeutral } from "@/utils";

const DialogOverlay: any = Dialog.Backdrop;
const DialogContent: any = Dialog.Content;
const DialogPositioner: any = Dialog.Positioner;

export const StreamModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [tab, setTab] = useState<string>("host");

  // Host state
  const [hostKey, setHostKey] = useState("");
  const [clientAnswerKey, setClientAnswerKey] = useState("");

  // Join state
  const [targetHostKey, setTargetHostKey] = useState("");
  const [clientAnswerGenerated, setClientAnswerGenerated] = useState("");

  // Refs for easy selection
  const hostKeyRef = useRef<HTMLTextAreaElement>(null);
  const clientAnswerKeyRef = useRef<HTMLTextAreaElement>(null);
  const targetHostKeyRef = useRef<HTMLTextAreaElement>(null);
  const clientGeneratedRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLTextAreaElement>(null);

  // Status logs
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(`[Stream UI] ${msg}`);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  useEffect(() => {
    let cancelState: any;
    let cancelLog: any;

    try {
      const runtimeEventsOn = (window as any)?.runtime?.EventsOn;
      if (runtimeEventsOn) {
        cancelState = runtimeEventsOn("stream:state", (state: string) => {
          addLog(`ICE Connection State: ${state}`);
        });
        cancelLog = runtimeEventsOn("stream:log", (msg: string) => {
          addLog(`ICE: ${msg}`);
        });
      }
    } catch (e) {
      console.warn("Could not bind Wails stream events", e);
    }

    return () => {
      if (typeof cancelState === "function") cancelState();
      if (typeof cancelLog === "function") cancelLog();
    };
  }, []);

  const getStreamAPI = () => {
    return (window as any)?.go?.stream?.Stream;
  };

  // Robust clipboard copy (Wails runtime -> navigator.clipboard -> fallback)
  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    try {
      if ((window as any)?.runtime?.ClipboardSetText) {
        await (window as any).runtime.ClipboardSetText(text);
        addLog(`Copied ${label} to clipboard!`);
        return;
      }
    } catch (e) {
      console.warn("Wails clipboard failed, trying fallback", e);
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        addLog(`Copied ${label} to clipboard!`);
        return;
      }
    } catch (e) {
      console.warn("navigator.clipboard failed, using execCommand", e);
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      addLog(`Copied ${label} to clipboard!`);
    } catch (err) {
      addLog(`Failed to copy ${label}: ${err}`);
    }
  };

  // Robust clipboard paste (Wails runtime -> navigator.clipboard)
  const pasteFromClipboard = async (setter: (v: string) => void, label: string) => {
    try {
      if ((window as any)?.runtime?.ClipboardGetText) {
        const text = await (window as any).runtime.ClipboardGetText();
        if (text) {
          setter(text);
          addLog(`Pasted ${label} from clipboard!`);
          return;
        }
      }
    } catch (e) {
      console.warn("Wails clipboard read failed", e);
    }

    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setter(text);
          addLog(`Pasted ${label} from clipboard!`);
          return;
        }
      }
    } catch (e) {
      console.warn("navigator.clipboard read failed", e);
    }

    addLog(`Could not read clipboard automatically. Please paste using right click or type.`);
  };

  // Keyboard helper to guarantee Ctrl+A / Cmd+A works inside textarea
  const handleSelectAll = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      e.stopPropagation();
      e.currentTarget.select();
    }
  };

  // Host action: 1. Create Peer & Offer
  const handleStartHost = async () => {
    try {
      const api = getStreamAPI();
      if (!api) {
        addLog("Error: Stream API not found on window.go.stream.Stream");
        return;
      }
      addLog("Host: Creating peer (isHost = true)...");
      const key = await api.CreatePeer(true);
      setHostKey(key);
      addLog(`Host: Created offer session key: ${key.substring(0, 30)}...`);
      console.log("[Stream UI] Host full offer key:", key);
    } catch (err: any) {
      console.error("[Stream UI] Host CreatePeer error:", err);
      addLog(`Host Error: ${err?.message || err}`);
    }
  };

  // Host action: 2. Connect client answer
  const handleHostConnectClient = async () => {
    try {
      const api = getStreamAPI();
      if (!api) {
        addLog("Error: Stream API not found");
        return;
      }
      if (!clientAnswerKey.trim()) {
        addLog("Host Error: Please paste client answer key first");
        return;
      }
      addLog("Host: Connecting with client answer key...");
      console.log("[Stream UI] Host connecting with client key:", clientAnswerKey);
      await api.ConnectPeer(clientAnswerKey.trim(), true);
      addLog("Host: ConnectPeer (Dial) initiated successfully!");
    } catch (err: any) {
      console.error("[Stream UI] Host ConnectPeer error:", err);
      addLog(`Host Connect Error: ${err?.message || err}`);
    }
  };

  // Client action: Join and respond with answer
  const handleJoin = async () => {
    try {
      const api = getStreamAPI();
      if (!api) {
        addLog("Error: Stream API not found on window.go.stream.Stream");
        return;
      }
      if (!targetHostKey.trim()) {
        addLog("Client Error: Please paste host key first");
        return;
      }

      addLog("Client: Initializing peer (CreatePeer false)...");
      await api.CreatePeer(false);
      addLog("Client: Peer initialized. Connecting to host offer...");

      console.log("[Stream UI] Client connecting with host offer:", targetHostKey);
      const session = await api.ConnectPeer(targetHostKey.trim(), false);
      addLog("Client: ConnectPeer (Accept) initiated in background!");
      console.log("[Stream UI] Client session credentials:", session);

      // Encode session to share back to host
      let answer = "";
      if (api.EncodeSession) {
        answer = await api.EncodeSession(session);
      } else {
        answer = btoa(JSON.stringify(session));
      }

      setClientAnswerGenerated(answer);
      addLog(`Client: Generated answer key: ${answer.substring(0, 30)}...`);
      console.log("[Stream UI] Client full answer key:", answer);
      addLog("Client: Send this answer key to the Host to complete the handshake!");
    } catch (err: any) {
      console.error("[Stream UI] Client Join error:", err);
      addLog(`Client Error: ${err?.message || err}`);
    }
  };

  const textareaStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "75px",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    background: "rgba(0, 0, 0, 0.35)",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: "12px",
    resize: "vertical",
    userSelect: "text",
    WebkitUserSelect: "text",
    outline: "none",
  };

  return (
    <Dialog.Root open={open}>
      <Portal>
        <DialogOverlay bg={"rgba(0,0,0,0.6)"} />
        <DialogPositioner
          onClick={(e: any) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <DialogContent
            onClick={(e: any) => e.stopPropagation()}
            w={"600px"}
            maxW={"90vw"}
            p={6}
            borderRadius={"lg"}
            bg={getNeutral("light", 800)}
            color={getNeutral("light", 200)}
            _dark={{
              bg: getNeutral("dark", 800),
              color: getNeutral("dark", 200),
            }}
            boxShadow={"xl"}
          >
            <HStack justify={"space-between"} mb={4}>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                P2P Stream Connection Test
              </Text>
              <Button size={"xs"} variant={"ghost"} onClick={() => setOpen(false)}>
                ✕
              </Button>
            </HStack>

            <HStack mb={4} gap={3}>
              <Button
                size={"sm"}
                colorPalette={tab === "host" ? "blue" : "gray"}
                variant={tab === "host" ? "solid" : "outline"}
                onClick={() => setTab("host")}
              >
                Host Mode
              </Button>
              <Button
                size={"sm"}
                colorPalette={tab === "join" ? "blue" : "gray"}
                variant={tab === "join" ? "solid" : "outline"}
                onClick={() => setTab("join")}
              >
                Join Mode
              </Button>
            </HStack>

            {tab === "host" && (
              <VStack align={"stretch"} gap={3}>
                <Button size={"sm"} colorPalette={"green"} onClick={handleStartHost}>
                  1. Start Hosting (Create Offer)
                </Button>

                {hostKey && (
                  <Box>
                    <HStack justify={"space-between"} mb={1}>
                      <Text fontSize={"xs"} fontWeight={"semibold"}>
                        Host Offer Key:
                      </Text>
                      <HStack gap={1}>
                        <Button
                          size={"xs"}
                          variant={"outline"}
                          onClick={() => hostKeyRef.current?.select()}
                        >
                          Select All
                        </Button>
                        <Button
                          size={"xs"}
                          colorPalette={"blue"}
                          onClick={() => copyToClipboard(hostKey, "Host Key")}
                        >
                          Copy Key
                        </Button>
                      </HStack>
                    </HStack>
                    <textarea
                      ref={hostKeyRef}
                      style={textareaStyle}
                      value={hostKey}
                      readOnly
                      onKeyDown={handleSelectAll}
                      onClick={() => hostKeyRef.current?.select()}
                    />
                  </Box>
                )}

                <Box mt={2}>
                  <HStack justify={"space-between"} mb={1}>
                    <Text fontSize={"xs"} fontWeight={"semibold"}>
                      2. Paste Client Answer Key:
                    </Text>
                    <HStack gap={1}>
                      <Button
                        size={"xs"}
                        variant={"outline"}
                        onClick={() =>
                          pasteFromClipboard(setClientAnswerKey, "Client Answer Key")
                        }
                      >
                        Paste from Clipboard
                      </Button>
                      {clientAnswerKey && (
                        <Button
                          size={"xs"}
                          variant={"ghost"}
                          onClick={() => setClientAnswerKey("")}
                        >
                          Clear
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                  <textarea
                    ref={clientAnswerKeyRef}
                    style={textareaStyle}
                    placeholder="Paste client answer key here..."
                    value={clientAnswerKey}
                    onChange={(e) => setClientAnswerKey(e.target.value)}
                    onKeyDown={handleSelectAll}
                  />
                  <Button
                    size={"sm"}
                    colorPalette={"blue"}
                    mt={2}
                    onClick={handleHostConnectClient}
                  >
                    Connect Client
                  </Button>
                </Box>
              </VStack>
            )}

            {tab === "join" && (
              <VStack align={"stretch"} gap={3}>
                <Box>
                  <HStack justify={"space-between"} mb={1}>
                    <Text fontSize={"xs"} fontWeight={"semibold"}>
                      1. Host Offer Key:
                    </Text>
                    <HStack gap={1}>
                      <Button
                        size={"xs"}
                        variant={"outline"}
                        onClick={() =>
                          pasteFromClipboard(setTargetHostKey, "Host Offer Key")
                        }
                      >
                        Paste from Clipboard
                      </Button>
                      {targetHostKey && (
                        <Button
                          size={"xs"}
                          variant={"ghost"}
                          onClick={() => setTargetHostKey("")}
                        >
                          Clear
                        </Button>
                      )}
                    </HStack>
                  </HStack>
                  <textarea
                    ref={targetHostKeyRef}
                    style={textareaStyle}
                    placeholder="Paste host offer key here..."
                    value={targetHostKey}
                    onChange={(e) => setTargetHostKey(e.target.value)}
                    onKeyDown={handleSelectAll}
                  />
                  <Button
                    size={"sm"}
                    colorPalette={"blue"}
                    mt={2}
                    onClick={handleJoin}
                  >
                    Join & Generate Answer
                  </Button>
                </Box>

                {clientAnswerGenerated && (
                  <Box mt={2}>
                    <HStack justify={"space-between"} mb={1}>
                      <Text fontSize={"xs"} fontWeight={"semibold"}>
                        2. Your Answer Key (send back to Host):
                      </Text>
                      <HStack gap={1}>
                        <Button
                          size={"xs"}
                          variant={"outline"}
                          onClick={() => clientGeneratedRef.current?.select()}
                        >
                          Select All
                        </Button>
                        <Button
                          size={"xs"}
                          colorPalette={"blue"}
                          onClick={() =>
                            copyToClipboard(clientAnswerGenerated, "Answer Key")
                          }
                        >
                          Copy Key
                        </Button>
                      </HStack>
                    </HStack>
                    <textarea
                      ref={clientGeneratedRef}
                      style={textareaStyle}
                      value={clientAnswerGenerated}
                      readOnly
                      onKeyDown={handleSelectAll}
                      onClick={() => clientGeneratedRef.current?.select()}
                    />
                  </Box>
                )}
              </VStack>
            )}

            {/* Live activity log */}
            <Box mt={4} pt={3} borderTop={"1px solid"} borderColor={"gray.700"}>
              <HStack justify={"space-between"} mb={2}>
                <Text fontSize={"xs"} fontWeight={"bold"} color={"gray.300"}>
                  Activity & Console Logs:
                </Text>
                <HStack gap={1}>
                  <Button
                    size={"xs"}
                    colorPalette={"blue"}
                    onClick={() => copyToClipboard(logs.join("\n"), "Logs")}
                  >
                    Copy All Logs
                  </Button>
                  <Button
                    size={"xs"}
                    variant={"outline"}
                    onClick={() => logRef.current?.select()}
                  >
                    Select All
                  </Button>
                  <Button size={"xs"} variant={"ghost"} onClick={() => setLogs([])}>
                    Clear
                  </Button>
                </HStack>
              </HStack>
              <textarea
                ref={logRef}
                style={{
                  ...textareaStyle,
                  minHeight: "120px",
                  maxHeight: "160px",
                  whiteSpace: "pre",
                  overflowY: "auto",
                }}
                value={
                  logs.length === 0
                    ? "No logs yet. Click an action above."
                    : logs.join("\n")
                }
                readOnly
                onKeyDown={handleSelectAll}
                onClick={() => logRef.current?.select()}
              />
            </Box>
          </DialogContent>
        </DialogPositioner>
      </Portal>
    </Dialog.Root>
  );
};
