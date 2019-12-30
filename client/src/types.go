package main

import (
	"time"
  "github.com/shopspring/decimal"
)

type Side = string

const (
	Buy Side = "buy"
	Sell Side = "sell"
)

type FWTRequest struct {
  BotID     string  `json:"bot_id"`
	OrderID   string        `json:"order_id"`
	Timestamp time.Time     `json:"timestamp"`
	Interval  time.Duration `json:"interval"`
	Timeout   time.Duration `json:"timeout"`
	Side      Side          `json:"side"`
	Amount    decimal.Decimal      `json:"amount"`
}

type FWT struct {
	FWTRequest
	Price  decimal.Decimal `json:"price"`
	Filled decimal.Decimal `json:"filled"`
}

type FWTFailure struct {
	OrderID    string    `json:"order_id"`
	Error string `json:"error"`
}

type PlaceOrder struct {
  BotID   string  `json:"bot_id"`
	OrderID string  `json:"order_id"`
	Amount  decimal.Decimal `json:"amount"`
	Price   decimal.Decimal `json:"price"`
	Side    Side    `json:"side"`
}

type CancelOrder struct {
  BotID   string  `json:"bot_id"`
	OrderID string  `json:"order_id"`
}

type OrderPlaced struct {
	OrderID string `json:"order_id"`
}

type OrderFilled struct {
	OrderID           string  `json:"order_id"`
	FilledAmount decimal.Decimal `json:"filledAmount"`
}

type OrderCanceled struct {
	OrderID string `json:"order_id"`
}

type OrderComplete struct {
	OrderID string `json:"order_id"`
}

type Refloat struct {
	Price decimal.Decimal `json:"price"`
}
