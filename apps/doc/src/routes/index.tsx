import { createFileRoute } from '@tanstack/react-router'
import { QRCodeSVG } from 'qrcode.react'

function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Project Documentation</h1>
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl">
        {/* Main Project QR Code */}
        <div className="flex flex-col items-center space-y-4 w-1/3">
          <h2 className="text-xl font-semibold text-center">Main Project</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <QRCodeSVG
              value="https://devsync.rahnemacollage.ir/"
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 text-center break-all">
            https://devsync.rahnemacollage.ir/
          </p>
        </div>

        {/* Documentation QR Code */}
        <div className="flex flex-col items-center space-y-4 w-1/3">
          <h2 className="text-xl font-semibold text-center">Documentation</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <QRCodeSVG
              value="https://devsync.rahnemacollage.ir/doc"
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 text-center break-all">
            https://devsync.rahnemacollage.ir/doc
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Scan the QR codes above to quickly access the main project or documentation
        </p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: IndexPage,
})