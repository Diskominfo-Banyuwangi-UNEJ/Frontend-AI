import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

export default function VideoWithHLS({ src }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) {
      setError("URL CCTV tidak tersedia");
      return;
    }

    let hls;
    
    if (videoRef.current) {
      if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        videoRef.current.src = src;
        videoRef.current.addEventListener("error", (e) => {
          setError("Gagal memuat stream CCTV");
          console.error("Video error:", e);
        });
      } else if (Hls.isSupported()) {
        // HLS.js support for other browsers
        hls = new Hls({
          maxMaxBufferLength: 30,
          maxBufferSize: 6000000,
          maxBufferLength: 30,
        });
        
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setError(null);
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setError("Gagal memuat stream CCTV");
            console.error("HLS error:", data);
          }
        });
      } else {
        setError("Browser tidak mendukung pemutaran stream ini");
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div>
      {error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : (
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          playsInline
          style={{ width: "250px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
}