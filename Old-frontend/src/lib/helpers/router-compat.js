// Compatibility layer for react-router-dom -> Next.js migration
import { useRouter as useNextRouter } from "next/router";
import NextLink from "next/link";
import { useCallback, useEffect } from "react";

// Link component wrapper
export function Link({ to, children, ...props }) {
  return (
    <NextLink href={to} {...props}>
      {children}
    </NextLink>
  );
}

// useNavigate hook wrapper
export function useNavigate() {
  const router = useNextRouter();

  return useCallback(
    (path, options = {}) => {
      if (options.replace) {
        router.replace(path);
      } else {
        router.push(path);
      }
    },
    [router],
  );
}

// useLocation hook wrapper
export function useLocation() {
  const router = useNextRouter();

  return {
    pathname: router.pathname,
    search: router.asPath.includes("?")
      ? router.asPath.substring(router.asPath.indexOf("?"))
      : "",
    hash: router.asPath.includes("#")
      ? router.asPath.substring(router.asPath.indexOf("#"))
      : "",
    state: router.query.state || {},
  };
}

// useParams hook wrapper
export function useParams() {
  const router = useNextRouter();
  return router.query;
}

// Navigate component wrapper
export function Navigate({ to, replace = false }) {
  const router = useNextRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
}
