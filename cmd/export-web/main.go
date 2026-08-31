package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"xiaoxue-zhongwen/learn"
)

func main() {
	outDir := "static/data"
	if len(os.Args) > 1 {
		outDir = os.Args[1]
	}
	if err := os.MkdirAll(outDir, 0o755); err != nil {
		fatal(err)
	}
	course := learn.LoadCourse()
	games := make([]learn.Game, 0, 30)
	for day := 1; day <= 30; day++ {
		game, err := learn.BuildGame(day)
		if err != nil {
			fatal(err)
		}
		games = append(games, game)
	}
	mustWrite(filepath.Join(outDir, "course.json"), course)
	mustWrite(filepath.Join(outDir, "games.json"), games)
	mustWrite(filepath.Join(outDir, "voices.json"), learn.Voices)
}

func mustWrite(path string, payload any) {
	data, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		fatal(err)
	}
	data = append(data, '\n')
	if err := os.WriteFile(path, data, 0o644); err != nil {
		fatal(err)
	}
}

func fatal(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}
