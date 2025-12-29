interface LogoProps {
  className?: string;
  height?: number;
}

export function Logo({ className = '', height = 60 }: LogoProps) {
  
  const width = height * 1.21;

  return (
    <svg
      width={width}
      height={height}
      viewBox="30 40 200 180"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Muchina Malomba Logo"
    >
      
      <g>
        
        <rect x="40" y="90" width="20" height="120" rx="7" fill="#1E1E1E"/>
        <rect x="72" y="50" width="20" height="160" rx="7" fill="#E86A1C"/>
        <rect x="104" y="100" width="20" height="110" rx="7" fill="#1E1E1E"/>

        <rect x="150" y="95" width="20" height="115" rx="7" fill="#1E1E1E"/>
        <rect x="182" y="60" width="20" height="150" rx="7" fill="#E86A1C"/>
        <rect x="214" y="110" width="20" height="100" rx="7" fill="#1E1E1E"/>
      </g>
    </svg>
  );
}

