import { useState, useRef, MouseEvent, TouchEvent } from 'react';
import ValentineLayout from './components/ValentineLayout';
import CelebrationHearts from './components/CelebrationHearts';
import HeartBurst from './components/HeartBurst';
import { Heart } from 'lucide-react';

type ViewState = 'question' | 'accepted' | 'declined';

interface BurstEffect {
    id: number;
    x: number;
    y: number;
}

function App() {
    const [viewState, setViewState] = useState<ViewState>('question');
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [bursts, setBursts] = useState<BurstEffect[]>([]);
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleYes = (e: MouseEvent<HTMLButtonElement>) => {
        // Trigger burst effect at click position
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newBurst: BurstEffect = {
            id: Date.now(),
            x,
            y
        };
        
        setBursts(prev => [...prev, newBurst]);
        
        // Clean up burst after animation completes
        setTimeout(() => {
            setBursts(prev => prev.filter(b => b.id !== newBurst.id));
        }, 1000);
        
        setViewState('accepted');
    };

    const moveNoButton = () => {
        if (!containerRef.current || !noButtonRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const button = noButtonRef.current.getBoundingClientRect();
        
        // Calculate safe bounds (keep button within container)
        const maxX = container.width - button.width - 20;
        const maxY = container.height - button.height - 20;
        
        // Generate random position
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        setNoButtonPosition({ x: newX, y: newY });
    };

    const handleNoHover = () => {
        moveNoButton();
    };

    const handleNoTouch = (e: TouchEvent<HTMLButtonElement>) => {
        e.preventDefault();
        moveNoButton();
    };

    const handleBack = () => {
        setViewState('question');
        setNoButtonPosition({ x: 0, y: 0 });
    };

    return (
        <div className="min-h-screen valentine-bg flex items-center justify-center p-4">
            <ValentineLayout>
                {viewState === 'question' && (
                    <>
                        <CelebrationHearts />
                        <div className="fade-in text-center space-y-8 relative z-10">
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/assets/generated/valentine-heart-illustration.dim_512x512.png"
                                    alt="Heart"
                                    className="w-48 h-48 pulse-heart"
                                />
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tight">
                                    Yash will you be my valentine?
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    I've been thinking about this for a while and I can't imagine celebrating Valentine's with anyone else but you. I was waiting for you to ask me the question but it's okay maybe next time. Dheere dheere sikha dungi sab. This is my first Valentine's toh mai bahut excited hu. You better not spoil it, varna bahut maarungi. Baaki anyways I love you and you know it❤️
                                </p>
                            </div>
                            <div 
                                ref={containerRef}
                                className="relative pt-6 min-h-[200px] overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button
                                        onClick={handleYes}
                                        className="group relative px-12 py-5 text-xl font-semibold text-primary-foreground bg-primary rounded-full shadow-romantic hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 min-w-[200px] z-20"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <Heart className="w-6 h-6 fill-current" />
                                            Yes, I'd love to!
                                        </span>
                                        {bursts.map(burst => (
                                            <HeartBurst key={burst.id} x={burst.x} y={burst.y} />
                                        ))}
                                    </button>
                                    <button
                                        ref={noButtonRef}
                                        onMouseEnter={handleNoHover}
                                        onTouchStart={handleNoTouch}
                                        className="absolute px-12 py-5 text-xl font-semibold text-muted-foreground bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 min-w-[200px] z-10"
                                        style={{
                                            transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                                            left: noButtonPosition.x === 0 ? '50%' : '0',
                                            top: noButtonPosition.x === 0 ? '0' : '0',
                                            marginLeft: noButtonPosition.x === 0 ? '120px' : '0',
                                        }}
                                    >
                                        Not yet...
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {viewState === 'accepted' && (
                    <>
                        <CelebrationHearts />
                        <div className="fade-in text-center space-y-8 relative z-10">
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/assets/generated/valentine-heart-illustration.dim_512x512.png"
                                    alt="Heart"
                                    className="w-56 h-56 pulse-heart"
                                />
                            </div>
                            <div className="space-y-6">
                                <h1 className="text-6xl md:text-7xl font-bold text-primary tracking-tight">
                                    Yay! 🎉
                                </h1>
                                <p className="text-2xl md:text-3xl text-foreground font-semibold">
                                    You just made me the happiest person alive!
                                </p>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                    I can't wait to spend this Valentine's Day with you. Get ready for something special! 💕
                                </p>
                            </div>
                            <div className="pt-8 flex flex-wrap gap-4 justify-center text-4xl">
                                <span className="animate-bounce">❤️</span>
                                <span className="animate-bounce delay-100">💖</span>
                                <span className="animate-bounce delay-200">💕</span>
                                <span className="animate-bounce delay-300">💗</span>
                                <span className="animate-bounce delay-100">💝</span>
                            </div>
                        </div>
                    </>
                )}

                {viewState === 'declined' && (
                    <div className="fade-in text-center space-y-8">
                        <div className="flex justify-center mb-6">
                            <img
                                src="/assets/generated/valentine-heart-illustration.dim_512x512.png"
                                alt="Heart"
                                className="w-48 h-48 opacity-70"
                            />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold text-muted-foreground tracking-tight">
                                No worries! 💙
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                I completely understand. There's no pressure at all. 
                                I'm just happy to have you in my life, and that's what matters most.
                            </p>
                            <p className="text-lg text-muted-foreground/80 italic">
                                Take all the time you need. I'll be here. 🌟
                            </p>
                        </div>
                        <div className="pt-6">
                            <button
                                onClick={handleBack}
                                className="px-10 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full shadow-romantic hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                                Maybe reconsider? 💭
                            </button>
                        </div>
                    </div>
                )}
            </ValentineLayout>

            <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground/60">
                <p>
                    © 2026. Built with <Heart className="inline w-4 h-4 fill-current text-primary" /> using{' '}
                    <a
                        href="https://caffeine.ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors underline"
                    >
                        caffeine.ai
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;
