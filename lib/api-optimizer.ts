// API response compression and optimization
import { NextRequest, NextResponse } from 'next/server'
import { gzip, brotliCompress } from 'zlib'
import { promisify } from 'util'

const gzipAsync = promisify(gzip)
const brotliAsync = promisify(brotliCompress)

export class ResponseOptimizer {
  static async compressResponse(data: any, request: NextRequest): Promise<NextResponse> {
    const jsonString = JSON.stringify(data)
    const acceptEncoding = request.headers.get('accept-encoding') || ''
    
    let compressedData: Buffer
    let encoding: string
    
    if (acceptEncoding.includes('br')) {
      compressedData = await brotliAsync(Buffer.from(jsonString))
      encoding = 'br'
    } else if (acceptEncoding.includes('gzip')) {
      compressedData = await gzipAsync(Buffer.from(jsonString))
      encoding = 'gzip'
    } else {
      return NextResponse.json(data)
    }
    
    const response = new NextResponse(compressedData)
    response.headers.set('Content-Encoding', encoding)
    response.headers.set('Content-Type', 'application/json')
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
    
    return response
  }
  
  static addCacheHeaders(response: NextResponse, ttl: number = 300): NextResponse {
    response.headers.set('Cache-Control', `public, max-age=${ttl}, s-maxage=${ttl}`)
    response.headers.set('ETag', `"${Date.now()}"`)
    response.headers.set('Vary', 'Accept-Encoding')
    
    return response
  }
}

export default ResponseOptimizer
