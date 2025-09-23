import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - WeddingLK",
  description: "Terms of Service for WeddingLK platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using WeddingLK, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-gray-700 leading-relaxed">
              Permission is granted to temporarily download one copy of WeddingLK for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials on WeddingLK are provided on an 'as is' basis. WeddingLK makes no warranties, expressed or implied.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall WeddingLK or its suppliers be liable for any damages arising out of the use or inability to use the materials on WeddingLK.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-700 leading-relaxed">
              The materials appearing on WeddingLK could include technical, typographical, or photographic errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
            <p className="text-gray-700 leading-relaxed">
              WeddingLK has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-gray-700 leading-relaxed">
              WeddingLK may revise these terms of service for its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}