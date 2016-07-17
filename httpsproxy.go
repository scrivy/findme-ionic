package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func main() {
	//	localLiveReloadUrl, _ := url.Parse("http://127.0.0.1:35729/")
	//	localLiveReloadProxy := httputil.NewSingleHostReverseProxy(localLiveReloadUrl)
	//	http.Handle("/livereload.js", localLiveReloadProxy)

	localProxyUrl, _ := url.Parse("http://127.0.0.1:8100/")
	localProxy := httputil.NewSingleHostReverseProxy(localProxyUrl)
	http.Handle("/", localProxy)

	log.Println("Serving on localhost:8080")
	log.Fatal(http.ListenAndServeTLS(":8080", "server.crt", "server.key", nil))
}
