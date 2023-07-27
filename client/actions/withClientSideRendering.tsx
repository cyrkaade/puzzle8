import React, { useEffect, useState } from 'react';

// Higher-Order Component that only renders on client-side
export function withClientSideRendering<P extends JSX.IntrinsicAttributes>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    if (!isMounted) {
      return null;
    }

    return <Component {...props} />;
  };
}
