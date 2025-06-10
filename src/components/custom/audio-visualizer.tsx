"use client";

import { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";


export function AudioVisualizer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationFrameId = useRef<number | null>(null);

    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    // Use proxied URL to avoid CORS
    useEffect(() => {
        let objectUrl: string;

        async function fetchAndCache() {
            const response = await fetch(`/api/proxy-audio?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error("Audio fetch failed");
            const blob = await response.blob();
            objectUrl = URL.createObjectURL(blob);
            setBlobUrl(objectUrl);
        }

        fetchAndCache().catch(console.error);

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [url]);

    // Setup AudioContext and Analyser
    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }, []);

    // Update currentTime as audio plays
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const timeUpdateHandler = () => {
            setCurrentTime(audio.currentTime);
        };

        const durationChangeHandler = () => {
            setDuration(audio.duration);
        };

        audio.addEventListener("timeupdate", timeUpdateHandler);
        audio.addEventListener("durationchange", durationChangeHandler);

        return () => {
            audio.removeEventListener("timeupdate", timeUpdateHandler);
            audio.removeEventListener("durationchange", durationChangeHandler);
        };
    }, []);

    const togglePlayPause = async () => {
        const audio = audioRef.current;
        const audioCtx = audioContextRef.current;
        if (!audio || !audioCtx || !blobUrl) return;

        if (!audio.src) {
            audio.src = blobUrl;
            audio.load();
        }

        if (audioCtx.state === "suspended") {
            await audioCtx.resume();
        }

        if (!sourceRef.current) {
            const source = audioCtx.createMediaElementSource(audio);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 128;

            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            sourceRef.current = source;
            analyserRef.current = analyser;
        }

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                console.error("Play failed:", err);
            }
        }
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const time = Number(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const vol = Number(e.target.value);
        audio.volume = vol;
        setVolume(vol);
    };

    // Audio visualizer drawing
    const visualizeAudio = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const analyser = analyserRef.current;
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);

        const renderFrame = () => {
            analyser.getByteFrequencyData(frequencyData);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = 6;
            const gap = 3;
            let x = 0;

            // Gradient fill for bars
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(1, "hsl(76, 71%, 53%)");
            gradient.addColorStop(0, "hsl(5, 100%, 69%)");
            ctx.fillStyle = gradient;

            for (let i = 0; i < frequencyData.length; i++) {
                const barHeight = frequencyData[i] / 2;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + gap;
            }

            animationFrameId.current = requestAnimationFrame(renderFrame);
        };

        renderFrame();
    };

    // Start visualizer when playing
    useEffect(() => {
        if (isPlaying) {
            visualizeAudio();
        } else if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
            // Clear canvas when paused
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
    }, [isPlaying]);

    // Format seconds to mm:ss
    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div className="flex flex-col space-y-4 max-w-xl mx-auto p-4 bg-muted rounded-lg border border-primary/70 font-retro">
            <audio ref={audioRef} preload="metadata" />
            <canvas ref={canvasRef} width={480} height={120} className="rounded bg-background border border-primary/70" />

            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    onClick={togglePlayPause}
                    disabled={!blobUrl}
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </Button>

                <div className="flex items-center space-x-2 w-full">
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeekChange}
                        step={0.1}
                        className="w-full accent-green/30 bg-muted"
                        aria-label="Seek audio"
                    />

                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <label htmlFor="volume" className="select-none">
                        Volume:
                    </label>
                    <input
                        id="volume"
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-24 accent-green/30 bg-muted"
                        aria-label="Volume control"
                    />
                </div>
                <span className="text-right">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
        </div>
    );
}
