import { useState, useCallback, useRef, useEffect } from "react"

interface UseSpinnerAnimationProps {
  duration?: number
  onComplete?: (selectedIndex: number) => void
}

export const useSpinnerAnimation = ({
  duration = 3000,
  onComplete,
}: UseSpinnerAnimationProps) => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const targetIndexRef = useRef<number>(-1)

  const spin = useCallback(
    (segmentCount: number) => {
      if (isSpinning || segmentCount === 0) return

      setIsSpinning(true)
      
      // Generate random target index
      const finalTargetIndex = Math.floor(Math.random() * segmentCount)
      targetIndexRef.current = finalTargetIndex
      setSelectedIndex(finalTargetIndex)

      const segmentAngle = 360 / segmentCount
      
      // Add multiple full rotations (5-8 spins) for dramatic effect
      const minSpins = 5
      const maxSpins = 8
      const extraSpins = minSpins + Math.random() * (maxSpins - minSpins)
      const fullRotations = extraSpins * 360
      
      // Get current normalized rotation (0-360)
      const currentNormalized = ((rotation % 360) + 360) % 360
      
      // Calculate the angle of the target segment's CENTER
      // Segments start at top (0°) and go clockwise
      const targetSegmentStartAngle = finalTargetIndex * segmentAngle
      const targetSegmentCenterAngle = targetSegmentStartAngle + (segmentAngle / 2)
      
      // We need to rotate so the target segment center aligns with the pointer at top (0°)
      // The wheel needs to rotate counter-clockwise to bring segment to top
      let angleToRotate = -targetSegmentCenterAngle
      
      // Normalize to ensure we rotate in the shortest direction
      while (angleToRotate < -180) angleToRotate += 360
      while (angleToRotate > 180) angleToRotate -= 360
      
      // Calculate total rotation from current position
      const targetRotation = rotation - currentNormalized + fullRotations + angleToRotate
      
      const startRotation = rotation
      const totalRotation = targetRotation - startRotation

      const animate = (currentTime: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = currentTime
        }

        const elapsed = currentTime - startTimeRef.current
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth deceleration
        const easeOutCubic = (t: number): number => {
          return 1 - Math.pow(1 - t, 3)
        }

        const easedProgress = easeOutCubic(progress)
        const newRotation = startRotation + totalRotation * easedProgress

        setRotation(newRotation)

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate)
        } else {
          // Animation complete - set exact final rotation
          setRotation(targetRotation)
          setIsSpinning(false)
          startTimeRef.current = undefined
          
          // Verify which segment is actually at the top
          const finalNormalized = ((targetRotation % 360) + 360) % 360
          const segmentAtTop = Math.floor((360 - finalNormalized + (segmentAngle / 2)) / segmentAngle) % segmentCount
          
          // Use the verified segment index
          const verifiedIndex = segmentAtTop >= 0 ? segmentAtTop : targetIndexRef.current
          
          // Call onComplete callback with verified index
          if (onComplete) {
            setTimeout(() => {
              onComplete(verifiedIndex)
            }, 100)
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    },
    [rotation, isSpinning, duration, onComplete]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    rotation,
    isSpinning,
    selectedIndex,
    spin,
  }
}