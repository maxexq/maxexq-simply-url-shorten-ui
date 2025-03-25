import { onMount, createSignal } from "solid-js";

const API_URL = "http://localhost:8080/shorten";

export default function UrlShortener() {
  const [url, setUrl] = createSignal("");
  const [shortUrl, setShortUrl] = createSignal("");
  const [error, setError] = createSignal("");

  const shortenUrl = async () => {
    setError("");
    setShortUrl("");

    if (!url()) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ url: url() }),
      });

      const data = await response.json();
      if (data.short_url) {
        setShortUrl(data.short_url);
      } else {
        setError(data.error || "Failed to shorten URL");
      }
    } catch (err) {
      setError("An error occurred while shortening the URL");
    }
  };

  return (
    <div class="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 class="text-lg font-semibold mb-2">URL Shortener</h2>
      <input
        type="text"
        placeholder="Enter URL..."
        value={url()}
        onInput={(e) => setUrl(e.target.value)}
        class="w-full p-2 border rounded"
      />
      <button
        onClick={shortenUrl}
        class="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        Shorten
      </button>
      {shortUrl() && (
        <div class="mt-2 p-2 bg-green-100 text-green-800 rounded">
          Short URL:{" "}
          <a href={shortUrl()} target="_blank" class="underline">
            {shortUrl()}
          </a>
        </div>
      )}
      {error() && (
        <div class="mt-2 p-2 bg-red-100 text-red-800 rounded">{error()}</div>
      )}
    </div>
  );
}
