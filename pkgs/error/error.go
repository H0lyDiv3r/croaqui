package customErr

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ErrorType string

const (
	ErrorTypeDBError     = "db_error"
	ErrorTypePlayerError = "player_error"
	ErrorTypeError       = "error"
)

type CustomError struct {
	Type    ErrorType `json:"type"`
	Message string    `json:"message"`
}

func New(typ ErrorType, message string) CustomError {
	return CustomError{Type: typ, Message: message}
}

func (e CustomError) Emit(ctx context.Context) {
	runtime.EventsEmit(ctx, "ERR", e)
}
