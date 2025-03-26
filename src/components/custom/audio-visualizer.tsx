import { useRef, useEffect } from "react";

export function AudioVisualizer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }, []);

    const handleAudioPlay = () => {
        const audioElement = audioRef.current;
        const audioCtx = audioContextRef.current;
        if (!audioElement || !audioCtx) return;

        if (!sourceRef.current) {
            const source = audioCtx.createMediaElementSource(audioElement);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            sourceRef.current = source;
            analyserRef.current = analyser;
        }

        audioElement.play();
        visualizeAudio();
    };

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
            const barWidth = 5;
            let startX = 0;

            for (let i = 0; i < frequencyData.length; i++) {
                startX = i * 8;
                const barHeight = -frequencyData[i];

                const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                gradient.addColorStop(0.2, "#ff0000"); // Red
                gradient.addColorStop(0.5, "#00ff00"); // Green
                gradient.addColorStop(1.0, "#0000ff"); // Blue

                ctx.fillStyle = gradient;
                ctx.fillRect(startX, canvas.height, barWidth, barHeight);
            }

            requestAnimationFrame(renderFrame);
        };

        renderFrame();
    };

    return (
        <div className="flex space-x-2">
            <div className="flex items-center space-x-1">
                <div>
                    <audio ref={audioRef} src={url} />
                    <button onClick={handleAudioPlay}>
                        <svg
                            className="h-w-14 w-14 cursor-pointer text-white transition-all hover:text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>
                <canvas ref={canvasRef} width={500} height={200} />
            </div>
        </div>
    );
}