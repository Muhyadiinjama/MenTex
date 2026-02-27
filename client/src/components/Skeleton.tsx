import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    circle?: boolean;
    className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, circle, className }) => {
    const style: React.CSSProperties = {
        width: width,
        height: height,
        borderRadius: circle ? '50%' : 'var(--radius-sm)',
    };

    return <div className={`skeleton-loader ${className || ''}`} style={style} />;
};

export default Skeleton;
