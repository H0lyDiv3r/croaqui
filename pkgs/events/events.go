package events

const (
	StreamRoomKeyGenerated = "stream:room-key:generated"
	StreamRoomCreated      = "stream:room:created"
	StreamRoomJoined       = "stream:room:joined"
	StreamPeerConnected    = "stream:peer:connected"
	StreamPeerDisconnected = "stream:peer:disconnected"
	StreamStatusChanged    = "stream:status:changed"
	StreamError            = "stream:error"
)
