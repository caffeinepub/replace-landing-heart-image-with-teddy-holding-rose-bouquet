import { Heart } from 'lucide-react';

interface HeartBurstProps {
    x: number;
    y: number;
}

export default function HeartBurst({ x, y }: HeartBurstProps) {
    // Generate 8 hearts in a radial pattern
    const hearts = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 8,
        delay: i * 0.05,
        size: 16 + Math.random() * 12
    }));

    return (
        <div 
            className="absolute pointer-events-none"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="absolute burst-heart"
                    style={{
                        animationDelay: `${heart.delay}s`,
                        '--burst-angle': `${heart.angle}deg`,
                        width: `${heart.size}px`,
                        height: `${heart.size}px`
                    } as React.CSSProperties}
                >
                    <Heart
                        className="w-full h-full fill-primary text-primary"
                        style={{
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
