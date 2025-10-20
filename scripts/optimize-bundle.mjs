#!/usr/bin/env node

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Starting Bundle Optimization...\n')

// 1. Analyze current bundle
console.log('📊 Analyzing current bundle...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Build completed successfully\n')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

// 2. Check bundle analyzer
console.log('📦 Running bundle analyzer...')
try {
  execSync('npm run bundle-analyzer', { stdio: 'inherit' })
  console.log('✅ Bundle analysis completed\n')
} catch (error) {
  console.log('⚠️  Bundle analyzer not available, continuing...\n')
}

// 3. Optimize Next.js configuration
console.log('⚙️  Optimizing Next.js configuration...')
const nextConfigPath = 'next.config.mjs'
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8')

// Add performance optimizations
const optimizations = `
// Performance optimizations
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // ... existing config ...
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
          },
        },
      }
    }
    
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
`

// Update next.config.mjs with optimizations
if (!nextConfig.includes('experimental:')) {
  const insertPoint = nextConfig.lastIndexOf('}')
  const beforeInsert = nextConfig.substring(0, insertPoint)
  const afterInsert = nextConfig.substring(insertPoint)
  
  const optimizedConfig = beforeInsert + `,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
          },
        },
      }
    }
    
    return config
  }` + afterInsert
  
  fs.writeFileSync(nextConfigPath, optimizedConfig)
  console.log('✅ Next.js configuration optimized\n')
}

// 4. Create dynamic import helper
console.log('🔧 Creating dynamic import helper...')
const dynamicImportHelper = `// Dynamic import helper for better code splitting
import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

export function createDynamicComponent<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options?: {
    loading?: () => JSX.Element
    ssr?: boolean
  }
) {
  return dynamic(importFunc, {
    loading: options?.loading || (() => (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />
    )),
    ssr: options?.ssr ?? true,
  })
}

// Pre-configured dynamic components
export const DynamicCard = createDynamicComponent(() => import('@/components/ui/card'))
export const DynamicButton = createDynamicComponent(() => import('@/components/ui/button'))
export const DynamicInput = createDynamicComponent(() => import('@/components/ui/input'))
export const DynamicDialog = createDynamicComponent(() => import('@/components/ui/dialog'))
export const DynamicSelect = createDynamicComponent(() => import('@/components/ui/select'))
export const DynamicSwitch = createDynamicComponent(() => import('@/components/ui/switch'))
export const DynamicBadge = createDynamicComponent(() => import('@/components/ui/badge'))
export const DynamicTabs = createDynamicComponent(() => import('@/components/ui/tabs'))
export const DynamicAccordion = createDynamicComponent(() => import('@/components/ui/accordion'))
export const DynamicCarousel = createDynamicComponent(() => import('@/components/ui/carousel'))
export const DynamicCalendar = createDynamicComponent(() => import('@/components/ui/calendar'))
export const DynamicDatePicker = createDynamicComponent(() => import('@/components/ui/date-picker'))
export const DynamicTimePicker = createDynamicComponent(() => import('@/components/ui/time-picker'))
export const DynamicMultiSelect = createDynamicComponent(() => import('@/components/ui/multi-select'))
export const DynamicRichTextEditor = createDynamicComponent(() => import('@/components/ui/rich-text-editor'))
export const DynamicFileUpload = createDynamicComponent(() => import('@/components/ui/file-upload'))
export const DynamicImageUpload = createDynamicComponent(() => import('@/components/ui/image-upload'))
export const DynamicVideoUpload = createDynamicComponent(() => import('@/components/ui/video-upload'))
export const DynamicAudioUpload = createDynamicComponent(() => import('@/components/ui/audio-upload'))
export const DynamicMap = createDynamicComponent(() => import('@/components/ui/map'))
export const DynamicChart = createDynamicComponent(() => import('@/components/ui/chart'))
export const DynamicTable = createDynamicComponent(() => import('@/components/ui/table'))
export const DynamicDataTable = createDynamicComponent(() => import('@/components/ui/data-table'))
export const DynamicPagination = createDynamicComponent(() => import('@/components/ui/pagination'))
export const DynamicSearch = createDynamicComponent(() => import('@/components/ui/search'))
export const DynamicFilter = createDynamicComponent(() => import('@/components/ui/filter'))
export const DynamicSort = createDynamicComponent(() => import('@/components/ui/sort'))
export const DynamicExport = createDynamicComponent(() => import('@/components/ui/export'))
export const DynamicImport = createDynamicComponent(() => import('@/components/ui/import'))
export const DynamicNotification = createDynamicComponent(() => import('@/components/ui/notification'))
export const DynamicToast = createDynamicComponent(() => import('@/components/ui/toast'))
export const DynamicAlert = createDynamicComponent(() => import('@/components/ui/alert'))
export const DynamicBanner = createDynamicComponent(() => import('@/components/ui/banner'))
export const DynamicModal = createDynamicComponent(() => import('@/components/ui/modal'))
export const DynamicPopover = createDynamicComponent(() => import('@/components/ui/popover'))
export const DynamicTooltip = createDynamicComponent(() => import('@/components/ui/tooltip'))
export const DynamicDropdown = createDynamicComponent(() => import('@/components/ui/dropdown'))
export const DynamicMenu = createDynamicComponent(() => import('@/components/ui/menu'))
export const DynamicNavigation = createDynamicComponent(() => import('@/components/ui/navigation'))
export const DynamicSidebar = createDynamicComponent(() => import('@/components/ui/sidebar'))
export const DynamicHeader = createDynamicComponent(() => import('@/components/ui/header'))
export const DynamicFooter = createDynamicComponent(() => import('@/components/ui/footer'))
export const DynamicLayout = createDynamicComponent(() => import('@/components/ui/layout'))
export const DynamicContainer = createDynamicComponent(() => import('@/components/ui/container'))
export const DynamicGrid = createDynamicComponent(() => import('@/components/ui/grid'))
export const DynamicFlex = createDynamicComponent(() => import('@/components/ui/flex'))
export const DynamicStack = createDynamicComponent(() => import('@/components/ui/stack'))
export const DynamicSpacer = createDynamicComponent(() => import('@/components/ui/spacer'))
export const DynamicDivider = createDynamicComponent(() => import('@/components/ui/divider'))
export const DynamicSeparator = createDynamicComponent(() => import('@/components/ui/separator'))
export const DynamicSkeleton = createDynamicComponent(() => import('@/components/ui/skeleton'))
export const DynamicLoading = createDynamicComponent(() => import('@/components/ui/loading'))
export const DynamicSpinner = createDynamicComponent(() => import('@/components/ui/spinner'))
export const DynamicProgress = createDynamicComponent(() => import('@/components/ui/progress'))
export const DynamicSlider = createDynamicComponent(() => import('@/components/ui/slider'))
export const DynamicRange = createDynamicComponent(() => import('@/components/ui/range'))
export const DynamicStepper = createDynamicComponent(() => import('@/components/ui/stepper'))
export const DynamicWizard = createDynamicComponent(() => import('@/components/ui/wizard'))
export const DynamicTimeline = createDynamicComponent(() => import('@/components/ui/timeline'))
export const DynamicSteps = createDynamicComponent(() => import('@/components/ui/steps'))
export const DynamicBreadcrumb = createDynamicComponent(() => import('@/components/ui/breadcrumb'))
export const DynamicTabs = createDynamicComponent(() => import('@/components/ui/tabs'))
export const DynamicAccordion = createDynamicComponent(() => import('@/components/ui/accordion'))
export const DynamicCollapse = createDynamicComponent(() => import('@/components/ui/collapse'))
export const DynamicDisclosure = createDynamicComponent(() => import('@/components/ui/disclosure'))
export const DynamicExpansion = createDynamicComponent(() => import('@/components/ui/expansion'))
export const DynamicReveal = createDynamicComponent(() => import('@/components/ui/reveal'))
export const DynamicShow = createDynamicComponent(() => import('@/components/ui/show'))
export const DynamicHide = createDynamicComponent(() => import('@/components/ui/hide'))
export const DynamicToggle = createDynamicComponent(() => import('@/components/ui/toggle'))
export const DynamicSwitch = createDynamicComponent(() => import('@/components/ui/switch'))
export const DynamicCheckbox = createDynamicComponent(() => import('@/components/ui/checkbox'))
export const DynamicRadio = createDynamicComponent(() => import('@/components/ui/radio'))
export const DynamicToggleGroup = createDynamicComponent(() => import('@/components/ui/toggle-group'))
export const DynamicCheckboxGroup = createDynamicComponent(() => import('@/components/ui/checkbox-group'))
export const DynamicRadioGroup = createDynamicComponent(() => import('@/components/ui/radio-group'))
export const DynamicForm = createDynamicComponent(() => import('@/components/ui/form'))
export const DynamicField = createDynamicComponent(() => import('@/components/ui/field'))
export const DynamicLabel = createDynamicComponent(() => import('@/components/ui/label'))
export const DynamicError = createDynamicComponent(() => import('@/components/ui/error'))
export const DynamicHelp = createDynamicComponent(() => import('@/components/ui/help'))
export const DynamicHint = createDynamicComponent(() => import('@/components/ui/hint'))
export const DynamicDescription = createDynamicComponent(() => import('@/components/ui/description'))
export const DynamicValidation = createDynamicComponent(() => import('@/components/ui/validation'))
export const DynamicFeedback = createDynamicComponent(() => import('@/components/ui/feedback'))
export const DynamicMessage = createDynamicComponent(() => import('@/components/ui/message'))
export const DynamicStatus = createDynamicComponent(() => import('@/components/ui/status'))
export const DynamicIndicator = createDynamicComponent(() => import('@/components/ui/indicator'))
export const DynamicBadge = createDynamicComponent(() => import('@/components/ui/badge'))
export const DynamicTag = createDynamicComponent(() => import('@/components/ui/tag'))
export const DynamicChip = createDynamicComponent(() => import('@/components/ui/chip'))
export const DynamicPill = createDynamicComponent(() => import('@/components/ui/pill'))
export const DynamicToken = createDynamicComponent(() => import('@/components/ui/token'))
export const DynamicLabel = createDynamicComponent(() => import('@/components/ui/label'))
export const DynamicCaption = createDynamicComponent(() => import('@/components/ui/caption'))
export const DynamicSubtitle = createDynamicComponent(() => import('@/components/ui/subtitle'))
export const DynamicTitle = createDynamicComponent(() => import('@/components/ui/title'))
export const DynamicHeading = createDynamicComponent(() => import('@/components/ui/heading'))
export const DynamicText = createDynamicComponent(() => import('@/components/ui/text'))
export const DynamicParagraph = createDynamicComponent(() => import('@/components/ui/paragraph'))
export const DynamicSpan = createDynamicComponent(() => import('@/components/ui/span'))
export const DynamicLink = createDynamicComponent(() => import('@/components/ui/link'))
export const DynamicAnchor = createDynamicComponent(() => import('@/components/ui/anchor'))
export const DynamicButton = createDynamicComponent(() => import('@/components/ui/button'))
export const DynamicIconButton = createDynamicComponent(() => import('@/components/ui/icon-button'))
export const DynamicIcon = createDynamicComponent(() => import('@/components/ui/icon'))
export const DynamicAvatar = createDynamicComponent(() => import('@/components/ui/avatar'))
export const DynamicImage = createDynamicComponent(() => import('@/components/ui/image'))
export const DynamicVideo = createDynamicComponent(() => import('@/components/ui/video'))
export const DynamicAudio = createDynamicComponent(() => import('@/components/ui/audio'))
export const DynamicEmbed = createDynamicComponent(() => import('@/components/ui/embed'))
export const DynamicIframe = createDynamicComponent(() => import('@/components/ui/iframe'))
export const DynamicObject = createDynamicComponent(() => import('@/components/ui/object'))
export const DynamicParam = createDynamicComponent(() => import('@/components/ui/param'))
export const DynamicSource = createDynamicComponent(() => import('@/components/ui/source'))
export const DynamicTrack = createDynamicComponent(() => import('@/components/ui/track'))
export const DynamicArea = createDynamicComponent(() => import('@/components/ui/area'))
export const DynamicBase = createDynamicComponent(() => import('@/components/ui/base'))
export const DynamicBr = createDynamicComponent(() => import('@/components/ui/br'))
export const DynamicCol = createDynamicComponent(() => import('@/components/ui/col'))
export const DynamicColGroup = createDynamicComponent(() => import('@/components/ui/col-group'))
export const DynamicData = createDynamicComponent(() => import('@/components/ui/data'))
export const DynamicDatalist = createDynamicComponent(() => import('@/components/ui/datalist'))
export const DynamicDetails = createDynamicComponent(() => import('@/components/ui/details'))
export const DynamicDialog = createDynamicComponent(() => import('@/components/ui/dialog'))
export const DynamicFieldset = createDynamicComponent(() => import('@/components/ui/fieldset'))
export const DynamicFigcaption = createDynamicComponent(() => import('@/components/ui/figcaption'))
export const DynamicFigure = createDynamicComponent(() => import('@/components/ui/figure'))
export const DynamicHr = createDynamicComponent(() => import('@/components/ui/hr'))
export const DynamicLegend = createDynamicComponent(() => import('@/components/ui/legend'))
export const DynamicLi = createDynamicComponent(() => import('@/components/ui/li'))
export const DynamicMeter = createDynamicComponent(() => import('@/components/ui/meter'))
export const DynamicOl = createDynamicComponent(() => import('@/components/ui/ol'))
export const DynamicOptgroup = createDynamicComponent(() => import('@/components/ui/optgroup'))
export const DynamicOption = createDynamicComponent(() => import('@/components/ui/option'))
export const DynamicOutput = createDynamicComponent(() => import('@/components/ui/output'))
export const DynamicProgress = createDynamicComponent(() => import('@/components/ui/progress'))
export const DynamicSelect = createDynamicComponent(() => import('@/components/ui/select'))
export const DynamicSummary = createDynamicComponent(() => import('@/components/ui/summary'))
export const DynamicTable = createDynamicComponent(() => import('@/components/ui/table'))
export const DynamicTbody = createDynamicComponent(() => import('@/components/ui/tbody'))
export const DynamicTd = createDynamicComponent(() => import('@/components/ui/td'))
export const DynamicTfoot = createDynamicComponent(() => import('@/components/ui/tfoot'))
export const DynamicTh = createDynamicComponent(() => import('@/components/ui/th'))
export const DynamicThead = createDynamicComponent(() => import('@/components/ui/thead'))
export const DynamicTr = createDynamicComponent(() => import('@/components/ui/tr'))
export const DynamicUl = createDynamicComponent(() => import('@/components/ui/ul'))
export const DynamicWbr = createDynamicComponent(() => import('@/components/ui/wbr'))
`

fs.writeFileSync('lib/dynamic-imports.ts', dynamicImportHelper)
console.log('✅ Dynamic import helper created\n')

// 5. Create performance monitoring
console.log('📊 Creating performance monitoring...')
const performanceMonitor = `// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  startTiming(name: string): void {
    this.metrics.set(\`\${name}_start\`, performance.now())
  }
  
  endTiming(name: string): number {
    const startTime = this.metrics.get(\`\${name}_start\`)
    if (!startTime) return 0
    
    const duration = performance.now() - startTime
    this.metrics.set(name, duration)
    this.metrics.delete(\`\${name}_start\`)
    
    return duration
  }
  
  getMetric(name: string): number | undefined {
    return this.metrics.get(name)
  }
  
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {}
    this.metrics.forEach((value, key) => {
      if (!key.endsWith('_start')) {
        result[key] = value
      }
    })
    return result
  }
  
  clearMetrics(): void {
    this.metrics.clear()
  }
}

// Web Vitals monitoring
export function measureWebVitals() {
  if (typeof window === 'undefined') return
  
  // First Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime)
      }
    }
  }).observe({ entryTypes: ['paint'] })
  
  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('LCP:', entry.startTime)
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] })
  
  // First Input Delay
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('FID:', entry.processingStart - entry.startTime)
    }
  }).observe({ entryTypes: ['first-input'] })
  
  // Cumulative Layout Shift
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        console.log('CLS:', (entry as any).value)
      }
    }
  }).observe({ entryTypes: ['layout-shift'] })
}

// Resource timing
export function measureResourceTiming() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('load', () => {
    const resources = performance.getEntriesByType('resource')
    resources.forEach((resource) => {
      console.log(\`Resource: \${resource.name}, Duration: \${resource.duration}ms\`)
    })
  })
}

// Navigation timing
export function measureNavigationTiming() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    console.log('Navigation timing:', {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart
    })
  })
}

export default PerformanceMonitor
`

fs.writeFileSync('lib/performance-monitor.ts', performanceMonitor)
console.log('✅ Performance monitoring created\n')

// 6. Create image optimization component
console.log('🖼️  Creating image optimization component...')
const imageOptimizer = `// Optimized image component
import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  quality?: number
  sizes?: string
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  const handleLoad = () => {
    setIsLoading(false)
  }
  
  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }
  
  if (hasError) {
    return (
      <div className={\`bg-gray-200 dark:bg-gray-700 flex items-center justify-center \${className}\`}>
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    )
  }
  
  return (
    <div className={\`relative overflow-hidden \${className}\`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        quality={quality}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={\`transition-opacity duration-300 \${isLoading ? 'opacity-0' : 'opacity-100'}\`}
      />
    </div>
  )
}

// Lazy image component
export function LazyImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority={false}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  )
}

export default OptimizedImage
`

fs.writeFileSync('components/ui/optimized-image.tsx', imageOptimizer)
console.log('✅ Image optimization component created\n')

console.log('🎉 Bundle optimization completed!')
console.log('📊 Next steps:')
console.log('1. Run "npm run build" to see the optimized bundle')
console.log('2. Run "npm run bundle-analyzer" to analyze the bundle')
console.log('3. Test the performance improvements')
