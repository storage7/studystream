import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function VideoWatermark() {
  const { user } = useAuth();
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [visible, setVisible] = useState(true);

  const randomize = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setPosition({
        x: Math.random() * 70 + 5,
        y: Math.random() * 70 + 5,
      });
      setVisible(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') return;

    const intervalMs = (Math.random() * 4000) + 8000; // 8-12 seconds
    const interval = setInterval(randomize, intervalMs);
    return () => clearInterval(interval);
  }, [user, randomize]);

  if (!user || user.role === 'admin') return null;

  return (
    <div
      className="absolute z-20 pointer-events-none select-none transition-all duration-500 ease-in-out"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        opacity: visible ? 0.15 : 0,
      }}
    >
      <div className="text-white text-sm md:text-base font-semibold whitespace-nowrap transform -rotate-12">
        <div>{user.name}</div>
        <div className="text-xs md:text-sm opacity-80">{user.mobile}</div>
      </div>
    </div>
  );
}
