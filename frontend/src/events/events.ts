export const Events = {
  StreamRoomKeyGenerated: "stream:room-key:generated",
  StreamRoomCreated: "stream:room:created",
  StreamRoomJoined: "stream:room:joined",
  StreamPeerConnected: "stream:peer:connected",
  StreamPeerDisconnected: "stream:peer:disconnected",
  StreamStatusChanged: "stream:status:changed",
  StreamError: "stream:error",
} as const;

export type EventName = typeof Events[keyof typeof Events];
