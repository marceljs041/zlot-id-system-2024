import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/');
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
