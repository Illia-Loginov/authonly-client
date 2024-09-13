import { useEffect, useRef } from 'react';

interface IntersectionTriggerProps {
  onVisible?: () => void;
  onHidden?: () => void;
}

const IntersectionTrigger = ({
  onVisible,
  onHidden
}: IntersectionTriggerProps) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && onVisible) {
        onVisible();
      } else if (!entries[0].isIntersecting && onHidden) {
        onHidden();
      }
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return <div ref={elementRef}></div>;
};

export default IntersectionTrigger;
