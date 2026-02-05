import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeart {
    id: number;
    left: number;
    delay: number;
    size: number;
}

export default function CelebrationHearts() {
    const [hearts, setHearts] = useState<FloatingHeart[]>([]);

    useEffect(() => {
        // Generate initial hearts
        const initialHearts: FloatingHeart[] = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            size: 20 + Math.random() * 30
        }));
        setHearts(initialHearts);

        // Add new hearts periodically
        const interval = setInterval(() => {
            setHearts((prev) => {
                const newHeart: FloatingHeart = {
                    id: Date.now(),
                    left: Math.random() * 100,
                    delay: 0,
                    size: 20 + Math.random() * 30
                };
                return [...prev.slice(-19), newHeart];
            });
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute bottom-0 float-heart"
                    style={{
                        left: `${heart.left}%`,
                        animationDelay: `${heart.delay}s`,
                        width: `${heart.size}px`,
                        height: `${heart.size}px`
                    }}
                >
                    <Heart
                        className="w-full h-full fill-primary text-primary opacity-80"
                        style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
