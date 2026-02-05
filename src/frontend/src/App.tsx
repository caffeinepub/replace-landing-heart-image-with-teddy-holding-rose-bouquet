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
    const [isNoButtonEvasive, setIsNoButtonEvasive] = useState(false);
    const [bursts, setBursts] = useState<BurstEffect[]>([]);
    const noButtonRef = useRef<HTMLButtonElement>(null);
    const yesButtonRef = useRef<HTMLButtonElement>(null);
    const arenaRef = useRef<HTMLDivElement>(null);
    const previousPositionRef = useRef({ x: 0, y: 0 });
    const lastMoveTimeRef = useRef(0);

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

    const checkOverlap = (noX: number, noY: number, noWidth: number, noHeight: number): boolean => {
        if (!yesButtonRef.current || !arenaRef.current) return false;

        const yesRect = yesButtonRef.current.getBoundingClientRect();
        const arenaRect = arenaRef.current.getBoundingClientRect();

        // Convert Yes button position to arena-relative coordinates
        const yesX = yesRect.left - arenaRect.left;
        const yesY = yesRect.top - arenaRect.top;
        const yesWidth = yesRect.width;
        const yesHeight = yesRect.height;

        // Add safety margin
        const margin = 20;

        // Check if rectangles overlap (with margin)
        return !(
            noX + noWidth + margin < yesX ||
            noX > yesX + yesWidth + margin ||
            noY + noHeight + margin < yesY ||
            noY > yesY + yesHeight + margin
        );
    };

    const findSafePosition = (): { x: number; y: number } => {
        if (!arenaRef.current || !noButtonRef.current) {
            return { x: 0, y: 0 };
        }

        const arena = arenaRef.current.getBoundingClientRect();
        const button = noButtonRef.current.getBoundingClientRect();
        
        const buttonWidth = button.width;
        const buttonHeight = button.height;
        
        // Define arena bounds with padding
        const padding = 20;
        const maxX = arena.width - buttonWidth - padding;
        const maxY = arena.height - buttonHeight - padding;
        
        // Try to find a non-overlapping position (max 10 attempts)
        for (let i = 0; i < 10; i++) {
            const newX = padding + Math.random() * (maxX - padding);
            const newY = padding + Math.random() * (maxY - padding);
            
            if (!checkOverlap(newX, newY, buttonWidth, buttonHeight)) {
                return { x: newX, y: newY };
            }
        }
        
        // Fallback: return a position far from Yes button
        return { x: maxX, y: maxY };
    };

    const moveNoButton = () => {
        if (!arenaRef.current || !noButtonRef.current) return;

        // Throttle movement (cooldown of 400ms)
        const now = Date.now();
        if (now - lastMoveTimeRef.current < 400) return;
        lastMoveTimeRef.current = now;

        const newPosition = findSafePosition();
        
        // Update state and ref
        previousPositionRef.current = newPosition;
        setNoButtonPosition(newPosition);
    };

    const handleArenaMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isNoButtonEvasive || !noButtonRef.current || !arenaRef.current) return;

        const arenaRect = arenaRef.current.getBoundingClientRect();
        const buttonRect = noButtonRef.current.getBoundingClientRect();

        // Get mouse position relative to arena
        const mouseX = e.clientX - arenaRect.left;
        const mouseY = e.clientY - arenaRect.top;

        // Get button center position
        const buttonCenterX = buttonRect.left - arenaRect.left + buttonRect.width / 2;
        const buttonCenterY = buttonRect.top - arenaRect.top + buttonRect.height / 2;

        // Calculate distance from mouse to button center
        const dx = mouseX - buttonCenterX;
        const dy = mouseY - buttonCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Proximity threshold (trigger dodge when mouse is within 150px)
        const proximityThreshold = 150;

        if (distance < proximityThreshold) {
            moveNoButton();
        }
    };

    const handleNoTouch = (e: TouchEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!isNoButtonEvasive && noButtonRef.current && arenaRef.current) {
            // Calculate initial absolute position from current DOM position
            const buttonRect = noButtonRef.current.getBoundingClientRect();
            const arenaRect = arenaRef.current.getBoundingClientRect();
            
            const initialX = buttonRect.left - arenaRect.left;
            const initialY = buttonRect.top - arenaRect.top;
            
            previousPositionRef.current = { x: initialX, y: initialY };
            setNoButtonPosition({ x: initialX, y: initialY });
            setIsNoButtonEvasive(true);
            
            // Move after a brief moment to allow position to be set
            setTimeout(() => moveNoButton(), 50);
        } else {
            moveNoButton();
        }
    };

    const activateEvasiveMode = () => {
        if (!isNoButtonEvasive && noButtonRef.current && arenaRef.current) {
            // Calculate initial absolute position from current DOM position
            const buttonRect = noButtonRef.current.getBoundingClientRect();
            const arenaRect = arenaRef.current.getBoundingClientRect();
            
            const initialX = buttonRect.left - arenaRect.left;
            const initialY = buttonRect.top - arenaRect.top;
            
            previousPositionRef.current = { x: initialX, y: initialY };
            setNoButtonPosition({ x: initialX, y: initialY });
            setIsNoButtonEvasive(true);
        }
    };

    const handleBack = () => {
        setViewState('question');
        setNoButtonPosition({ x: 0, y: 0 });
        setIsNoButtonEvasive(false);
        previousPositionRef.current = { x: 0, y: 0 };
        lastMoveTimeRef.current = 0;
    };

    return (
        <div className="min-h-screen valentine-bg flex items-center justify-center p-4">
            <ValentineLayout>
                {viewState === 'question' && (
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
                        
                        {/* Button arena - bounded region for evasive movement */}
                        <div 
                            ref={arenaRef}
                            onMouseMove={handleArenaMouseMove}
                            className="relative pt-6 mx-auto"
                            style={{
                                width: '100%',
                                maxWidth: '600px',
                                minHeight: '300px',
                                padding: '40px'
                            }}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                {/* Yes button - stays in normal flow */}
                                <button
                                    ref={yesButtonRef}
                                    onClick={handleYes}
                                    className="group relative px-12 py-5 text-xl font-semibold text-primary-foreground bg-primary rounded-full shadow-romantic hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 min-w-[200px] z-20"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <Heart className="w-6 h-6 fill-current" />
                                        Haanji obviously
                                    </span>
                                    {bursts.map(burst => (
                                        <HeartBurst key={burst.id} x={burst.x} y={burst.y} />
                                    ))}
                                </button>
                                
                                {/* No button - becomes absolute when evasive */}
                                {!isNoButtonEvasive ? (
                                    <button
                                        ref={noButtonRef}
                                        onMouseEnter={activateEvasiveMode}
                                        onTouchStart={handleNoTouch}
                                        className="px-12 py-5 text-xl font-semibold text-muted-foreground bg-secondary rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200 min-w-[200px] z-10"
                                    >
                                        Nahi yaar
                                    </button>
                                ) : (
                                    <button
                                        ref={noButtonRef}
                                        onTouchStart={handleNoTouch}
                                        className="absolute px-12 py-5 text-xl font-semibold text-muted-foreground bg-secondary rounded-full min-w-[200px] z-30 evasive-button"
                                        style={{
                                            transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                                            left: '0',
                                            top: '0',
                                        }}
                                    >
                                        Nahi yaar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
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
