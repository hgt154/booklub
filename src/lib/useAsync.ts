import { useEffect, useState } from 'react';

function sameDeps(a: unknown[], b: unknown[]) {
  return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<{ data: T | null; error: Error | null; loading: boolean }>({
    data: null,
    error: null,
    loading: true,
  });

  // deps змінились — позначаємо loading ще під час рендера, а не в ефекті
  // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  const [prevDeps, setPrevDeps] = useState(deps);
  if (!sameDeps(prevDeps, deps)) {
    setPrevDeps(deps);
    setState((s) => ({ ...s, loading: true }));
  }

  useEffect(() => {
    let cancelled = false;

    fn()
      .then((d) => {
        if (!cancelled) setState({ data: d, error: null, loading: false });
      })
      .catch((e) => {
        if (!cancelled) setState((s) => ({ ...s, error: e, loading: false }));
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
