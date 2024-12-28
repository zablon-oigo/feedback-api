import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const siteUrl = ""; 

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-2xl font-bold">Welcome to Our Event</h1>
      <p className="mb-6 text-gray-600">Scan the QR code below to access the site.</p>
      
      <QRCodeCanvas
        value={siteUrl}
        size={200}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"H"}
      />
      <p className="mt-4 text-sm text-gray-500">Point your camera at the QR code to scan.</p>
    </div>
  );
}
