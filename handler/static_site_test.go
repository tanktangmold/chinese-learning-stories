package handler

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestStaticSiteHasHomepageAndCourseData(t *testing.T) {
	root := filepath.Join("..", "static")
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir(root)))
	server := httptest.NewServer(mux)
	t.Cleanup(server.Close)

	home, err := http.Get(server.URL + "/")
	if err != nil {
		t.Fatal(err)
	}
	defer home.Body.Close()
	if home.StatusCode != http.StatusOK {
		t.Fatalf("home status %d", home.StatusCode)
	}
	body, err := io.ReadAll(home.Body)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(body), "小小中文") {
		t.Fatal("homepage missing title")
	}

	for _, name := range []string{"index.html", "app.js", "styles.css", "sw.js", "apple-touch-icon.png", "data/course.json", "data/games.json"} {
		if _, err := os.Stat(filepath.Join(root, name)); err != nil {
			t.Fatalf("%s: %v", name, err)
		}
	}

	course, err := http.Get(server.URL + "/data/course.json")
	if err != nil {
		t.Fatal(err)
	}
	defer course.Body.Close()
	if course.StatusCode != http.StatusOK {
		t.Fatalf("course status %d", course.StatusCode)
	}
}
