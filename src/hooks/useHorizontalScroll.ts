import { useState, useRef, useCallback, useEffect } from 'react';

export function useHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const hasVerticalScroll = scrollHeight > clientHeight;
    setCanScrollLeft(hasVerticalScroll && scrollTop > 0);
    setCanScrollRight(hasVerticalScroll && scrollTop + clientHeight < scrollHeight - 20);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial check
    checkScrollability();

    // Check on scroll
    const handleScroll = () => {
      requestAnimationFrame(checkScrollability);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Check on resize
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(checkScrollability);
    });
    resizeObserver.observe(container);

    // Check on content changes
    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(checkScrollability);
    });
    mutationObserver.observe(container, { 
      childList: true, 
      subtree: true, 
      attributes: true 
    });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [checkScrollability]);

  const scrollTo = useCallback((direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = Math.min(container.clientHeight * 0.8, 300);
    const targetScroll = container.scrollTop + (direction === 'left' ? -scrollAmount : scrollAmount);

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });

    // Recheck scrollability after animation
    setTimeout(checkScrollability, 500);
  }, [checkScrollability]);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scrollTo,
    checkScrollability
  };
}