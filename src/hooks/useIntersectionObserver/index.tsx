import { useEffect, useRef, useState } from 'react'

type UseIntersectionObserverProps = {
  onIntersect: () => void
  options?: IntersectionObserverInit
}

const useIntersectionObserver = ({
  onIntersect,
  options,
}: UseIntersectionObserverProps) => {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect()
        setInView(true)
      } else {
        setInView(false)
      }
    }, options)

    observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
      observer.disconnect()
    }
  }, [ref, onIntersect, options])

  return {
    ref,
    inView,
  }
}

export { useIntersectionObserver }
