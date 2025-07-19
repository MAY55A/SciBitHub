import { Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full min-h-64 bg-muted/60 py-16 px-4 border-t">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                    <h4 className="font-bold mb-2">SciBitHub</h4>
                    <div className="font-retro">
                        <p>Empowering collaborative research.</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-2">Support</h4>
                    <ul className="space-y-1 font-retro">
                        <li><a href="#how-it-works">How It Works</a></li>
                        <li className="flex items-center gap-2">
                            <a href="https://github.com/MAY55A/SciBitHub/issues" target="_blank" rel="noreferrer">Report a Bug</a>
                            <Github className="w-4 h-4" />
                        </li>
                        <li className="flex items-center gap-2">
                            <a href="https://github.com/MAY55A/SciBitHub#readme" target="_blank" rel="noreferrer">Docs</a>
                            <Github className="w-4 h-4" />
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-2"><a href="/about">About</a></h4>
                    <ul className="space-y-1 font-retro">
                        <li><a href="/terms-of-service" target="_blank">Terms of Service</a></li>
                        <li><a href="/privacy" target="_blank">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs mt-6">
                Copyright © 2025 SciBitHub
                <p>
                    Made by{" "}
                    <a
                        href="https://may55a.github.io/Social-links-profile/"
                        target="_blank"
                        className="font-bold hover:underline text-green"
                        rel="noreferrer"
                    >
                        MAY55A
                    </a>
                </p>
            </div>

        </footer>
    );
}