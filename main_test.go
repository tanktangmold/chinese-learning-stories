package main

import "testing"

func TestListenPort(t *testing.T) {
	if got := listenPort("0.0.0.0:8080"); got != "8080" {
		t.Fatalf("got %q", got)
	}
	if got := listenPort("127.0.0.1:9090"); got != "9090" {
		t.Fatalf("got %q", got)
	}
	if got := listenPort("bad"); got != "8080" {
		t.Fatalf("got %q", got)
	}
}
