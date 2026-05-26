import { ItemCard } from "@/components/ItemCard";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Product {
  title: string;
  imgUrl: string;
}

interface EndpointResult {
  endpoint: string;
  status: "success" | "error" | "pending";
  message: string;
}

interface PlateDownloaderProps {
  onImageSelected?: (file: File) => void;
}

const ENDPOINTS = [
  {
    label: "stamping-plates collection",
    url: (_code: string) =>
      `https://maniology.com/collections/nail-stamping-plates/products.json?limit=250`,
    extract: (data: any, code: string): any[] =>
      (data?.products ?? []).filter(
        (p: any) =>
          p.handle?.toLowerCase().includes(code.toLowerCase()) ||
          p.title?.toLowerCase().includes(code.toLowerCase()),
      ),
  },
];

function extractImage(match: any): string | null {
  let imgUrl: string =
    match?.featured_image ||
    match?.image?.src ||
    match?.images?.[0]?.src ||
    match?.image ||
    null;
  if (!imgUrl) return null;
  if (imgUrl.startsWith("//")) imgUrl = "https:" + imgUrl;
  return imgUrl.split("?")[0];
}

export default function ManologyDownloader() {
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<EndpointResult[]>([]);

  async function search(): Promise<void> {
    if (!userInput.trim()) return;
    setLoading(true);
    setProducts([]);
    setResults(
      ENDPOINTS.map((e) => ({
        endpoint: e.label,
        status: "pending",
        message: "checking…",
      })),
    );

    const updatedResults: EndpointResult[] = [];
    const seen = new Set<string>();
    const allProducts: Product[] = [];

    for (let i = 0; i < ENDPOINTS.length; i++) {
      const ep = ENDPOINTS[i];
      try {
        const res = await fetch(ep.url(userInput));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const matches: any[] = ep.extract(data, userInput);
        if (!matches.length) throw new Error("not found");

        const newOnes: Product[] = [];
        for (const match of matches) {
          const imgUrl = extractImage(match);
          if (!imgUrl || seen.has(imgUrl)) continue;
          seen.add(imgUrl);
          newOnes.push({
            title: match.title ?? userInput.toUpperCase(),
            imgUrl,
          });
        }

        if (!newOnes.length) throw new Error("no new images");

        allProducts.push(...newOnes);
        setProducts([...allProducts]);
        updatedResults.push({
          endpoint: ep.label,
          status: "success",
          message: `${newOnes.length} image${newOnes.length > 1 ? "s" : ""} found`,
        });
      } catch (e) {
        updatedResults.push({
          endpoint: ep.label,
          status: "error",
          message: e instanceof Error ? e.message : "failed",
        });
      }
      setResults([...updatedResults]);
    }

    setLoading(false);
  }

  async function download(product: Product): Promise<void> {
    try {
      const res = await fetch(product.imgUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${userInput.toUpperCase()}.jpg`;
      a.click();
    } catch {
      window.open(product.imgUrl, "_blank");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "1.5rem" }}>
      <Label style={{ marginBottom: "20px" }} className={undefined}>
        Manology plate look up
      </Label>
      <div>Type in the textbox a plate code:</div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Plate code, e.g. M663"
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={search}
          disabled={loading}
          style={{ padding: "8px 16px", borderRadius: 8 }}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {results.length > 0 && (
        <div
          style={{
            marginBottom: "1.5rem",
            border: "1px solid #ddd",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          {results.map((r) => (
            <div
              key={r.endpoint}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 14px",
                borderBottom: "1px solid #eee",
                fontSize: 13,
              }}
            >
              <code style={{ fontSize: 12, color: "#555" }}>{r.endpoint}</code>
              <span
                style={{
                  color:
                    r.status === "success"
                      ? "green"
                      : r.status === "error"
                        ? "red"
                        : "#aaa",
                  fontWeight: 500,
                }}
              >
                {r.status === "pending"
                  ? "⏳"
                  : r.status === "success"
                    ? "✅"
                    : "❌"}{" "}
                {r.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {products.map((product, i) => (
            <div>
              <div
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.imgUrl}
                  alt={product.title}
                  style={{ width: "100%", display: "block" }}
                />
                <div
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      {product.title}
                    </p>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>
                      {userInput.toUpperCase()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => download(product)}
                      style={{ padding: "8px 16px", borderRadius: 8 }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
