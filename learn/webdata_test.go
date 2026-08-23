package learn_test

import (
	"encoding/json"
	"os"
	"testing"

	"xiaoxue-zhongwen/learn"
)

func TestStaticWebDataMatchesCourse(t *testing.T) {
	raw, err := os.ReadFile("../static/data/course.json")
	if err != nil {
		t.Fatalf("export static data with go run ./cmd/export-web: %v", err)
	}
	var exported learn.Course
	if err := json.Unmarshal(raw, &exported); err != nil {
		t.Fatal(err)
	}
	live := learn.LoadCourse()
	if exported.ID != live.ID || len(exported.Days) != len(live.Days) {
		t.Fatalf("exported course %s/%d live %s/%d", exported.ID, len(exported.Days), live.ID, len(live.Days))
	}
	for i, day := range live.Days {
		got := exported.Days[i]
		if got.Day != day.Day || got.Title.ZH != day.Title.ZH || len(got.Lines) != len(day.Lines) {
			t.Fatalf("day %d mismatch", day.Day)
		}
		if got.Lines[0].Sentence.ZH != day.Lines[0].Sentence.ZH {
			t.Fatalf("day %d first sentence mismatch", day.Day)
		}
	}

	gamesRaw, err := os.ReadFile("../static/data/games.json")
	if err != nil {
		t.Fatal(err)
	}
	var games []learn.Game
	if err := json.Unmarshal(gamesRaw, &games); err != nil {
		t.Fatal(err)
	}
	if len(games) != 30 {
		t.Fatalf("games = %d", len(games))
	}
	for day := 1; day <= 30; day++ {
		want, err := learn.BuildGame(day)
		if err != nil {
			t.Fatal(err)
		}
		if games[day-1].Kind != want.Kind || len(games[day-1].Items) != len(want.Items) {
			t.Fatalf("game day %d mismatch kind=%s items=%d", day, games[day-1].Kind, len(games[day-1].Items))
		}
	}
}
