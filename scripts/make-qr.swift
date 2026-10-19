// Generates the App Store QR code used as a CSS mask (style.css: .qr-mask uses
// /invite/qr-app-link.svg with `mask: url(...) center / contain`).
//
//   swift scripts/make-qr.swift <url> <out.svg>     write, then decode-check the file
//   swift scripts/make-qr.swift --verify <file.svg>  decode an existing file only
//
// The SVG keeps the original file's structure: a 329×329 viewBox, a group
// translated by (-35, -35) and filled white (the mask shape), rounded finder
// rings as even-odd <path>s, round finder eyes, and one round <rect> per dark
// module. The QR matrix comes from CoreImage's CIQRCodeGenerator (correction
// level M); the check renders the written SVG with AppKit and decodes it with
// CIDetector.

import AppKit
import CoreImage
import CoreImage.CIFilterBuiltins
import Foundation

func fail(_ message: String) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(1)
}

func qrMatrix(for text: String) -> [[Bool]] {
    let filter = CIFilter.qrCodeGenerator()
    filter.message = Data(text.utf8)
    filter.correctionLevel = "M"
    guard let output = filter.outputImage else { fail("CIQRCodeGenerator produced no image") }
    let context = CIContext(options: [.useSoftwareRenderer: true])
    guard let cg = context.createCGImage(output, from: output.extent) else { fail("Could not render QR image") }
    let w = cg.width, h = cg.height
    var pixels = [UInt8](repeating: 0, count: w * h)
    let gray = CGColorSpaceCreateDeviceGray()
    guard let ctx = CGContext(data: &pixels, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w,
                              space: gray, bitmapInfo: CGImageAlphaInfo.none.rawValue) else { fail("No bitmap context") }
    ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
    // Trim the generator's quiet zone: the matrix is the bounding box of dark modules.
    var minX = w, minY = h, maxX = -1, maxY = -1
    for y in 0..<h { for x in 0..<w where pixels[y * w + x] < 128 {
        minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y)
    } }
    let n = maxX - minX + 1
    guard n > 0, n == maxY - minY + 1, (n - 17) % 4 == 0 else { fail("Unexpected QR geometry \(n)") }
    return (0..<n).map { r in (0..<n).map { c in pixels[(minY + r) * w + (minX + c)] < 128 } }
}

func fmt(_ v: Double) -> String {
    var s = String(format: "%.7f", v)
    while s.hasSuffix("0") { s.removeLast() }
    if s.hasSuffix(".") { s.removeLast() }
    return s
}

func roundedRect(_ x: Double, _ y: Double, _ size: Double, _ r: Double) -> String {
    let x2 = x + size, y2 = y + size
    return "M\(fmt(x + r)),\(fmt(y)) L\(fmt(x2 - r)),\(fmt(y)) A\(fmt(r)),\(fmt(r)) 0 0 1 \(fmt(x2)),\(fmt(y + r)) "
        + "L\(fmt(x2)),\(fmt(y2 - r)) A\(fmt(r)),\(fmt(r)) 0 0 1 \(fmt(x2 - r)),\(fmt(y2)) "
        + "L\(fmt(x + r)),\(fmt(y2)) A\(fmt(r)),\(fmt(r)) 0 0 1 \(fmt(x)),\(fmt(y2 - r)) "
        + "L\(fmt(x)),\(fmt(y + r)) A\(fmt(r)),\(fmt(r)) 0 0 1 \(fmt(x + r)),\(fmt(y)) Z"
}

func svg(for matrix: [[Bool]]) -> String {
    let n = matrix.count
    // Same canvas as the original: content spans 35.4263321…363.119904 in group space.
    let origin = 35.4263321
    let module = (363.119904 - origin) / Double(n)
    let dot = module * 0.9
    let inset = (module - dot) / 2
    let finders = [(0, 0), (0, n - 7), (n - 7, 0)]
    func inFinder(_ r: Int, _ c: Int) -> Bool {
        finders.contains { r >= $0.0 && r < $0.0 + 7 && c >= $0.1 && c < $0.1 + 7 }
    }
    var lines: [String] = []
    lines.append(#"<?xml version="1.0" encoding="UTF-8"?>"#)
    lines.append(#"<svg width="329px" height="329px" viewBox="0 0 329 329" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">"#)
    lines.append("    <title>Group</title>")
    lines.append(#"    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">"#)
    lines.append(##"        <g id="Group" fill="#FFFFFF" transform="translate(-35, -35)">"##)
    for r in 0..<n { for c in 0..<n where matrix[r][c] && !inFinder(r, c) {
        let x = origin + Double(c) * module + inset, y = origin + Double(r) * module + inset
        lines.append(#"            <rect id="Rectangle" fill-rule="nonzero" x="\#(fmt(x))" y="\#(fmt(y))" width="\#(fmt(dot))" height="\#(fmt(dot))" rx="\#(fmt(dot / 2))"></rect>"#)
    } }
    for (fr, fc) in finders {
        let x = origin + Double(fc) * module, y = origin + Double(fr) * module
        let ring = roundedRect(x, y, module * 7, module * 1.4) + " " + roundedRect(x + module, y + module, module * 5, module)
        lines.append(#"            <path d="\#(ring)" id="Shape"></path>"#)
        let eye = module * 3
        lines.append(#"            <rect id="Rectangle" fill-rule="nonzero" x="\#(fmt(x + module * 2))" y="\#(fmt(y + module * 2))" width="\#(fmt(eye))" height="\#(fmt(eye))" rx="\#(fmt(eye / 2))"></rect>"#)
    }
    lines.append("        </g>")
    lines.append("    </g>")
    lines.append("</svg>")
    return lines.joined(separator: "\n") + "\n"
}

// Renders the SVG as the mask would show it (white shape on a dark card),
// inverts it to dark-on-light and decodes it.
func decode(svgAt url: URL) -> String? {
    guard let image = NSImage(contentsOf: url) else { fail("AppKit could not load \(url.path)") }
    let side = 900, pad = 90
    guard let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: side, pixelsHigh: side, bitsPerSample: 8,
                                     samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                                     colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0) else { fail("No bitmap") }
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    NSColor.black.setFill()
    NSRect(x: 0, y: 0, width: side, height: side).fill()
    image.draw(in: NSRect(x: pad, y: pad, width: side - 2 * pad, height: side - 2 * pad))
    NSGraphicsContext.restoreGraphicsState()
    guard let cg = rep.cgImage else { fail("No CGImage") }
    let inverted = CIImage(cgImage: cg).applyingFilter("CIColorInvert")
    let detector = CIDetector(ofType: CIDetectorTypeQRCode, context: nil, options: [CIDetectorAccuracy: CIDetectorAccuracyHigh])
    let features = detector?.features(in: inverted) ?? []
    return features.compactMap { ($0 as? CIQRCodeFeature)?.messageString }.first
}

let args = Array(CommandLine.arguments.dropFirst())
if args.count == 2, args[0] == "--verify" {
    let url = URL(fileURLWithPath: args[1])
    guard let message = decode(svgAt: url) else { fail("No QR code decoded from \(url.path)") }
    print("Decoded \(url.lastPathComponent): \(message)")
    exit(0)
}
guard args.count == 2 else { fail("usage: swift scripts/make-qr.swift <url> <out.svg> | --verify <file.svg>") }
let text = args[0], outURL = URL(fileURLWithPath: args[1])
let matrix = qrMatrix(for: text)
do { try svg(for: matrix).write(to: outURL, atomically: true, encoding: .utf8) } catch { fail("Write failed: \(error)") }
print("Wrote \(outURL.path): \(matrix.count)×\(matrix.count) modules (version \((matrix.count - 17) / 4)), level M")
guard let decoded = decode(svgAt: outURL) else { fail("Verification failed: nothing decoded") }
guard decoded == text else { fail("Verification failed: decoded \(decoded)") }
print("Verified by CIDetector: \(decoded)")
