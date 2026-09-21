"use client";
import React, { useRef, useState } from 'react';

export const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate rotation (max 10 degrees for a subtle feel)
    const xRotation = ((mouseY - height / 2) / height) * -10;
    const yRotation = ((mouseX - width / 2) / width) * 10;

    setRotate({ x: xRotation, y: yRotation });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 }); // Reset position
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: rotate.x === 0 ? 'all 0.5s ease-out' : 'none',
      }}
      className="will-change-transform"
    >
      {children}
    </div>
  );
};