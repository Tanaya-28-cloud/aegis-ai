# Creates simple placeholder icons for the extension
# Run: python extension/create_icons.py

import struct
import zlib
import os

def create_png(size, color=(0, 255, 157)):
    """Create a simple solid color PNG."""
    def png_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)

    signature = b'\x89PNG\r\n\x1a\n'
    ihdr_data = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    ihdr = png_chunk(b'IHDR', ihdr_data)

    raw_data = b''
    for y in range(size):
        raw_data += b'\x00'
        for x in range(size):
            # Draw a shield shape
            cx, cy = size // 2, size // 2
            dx, dy = x - cx, y - cy
            dist = (dx*dx + dy*dy) ** 0.5
            inner = size * 0.35

            if dist < inner:
                # Inner: bright green
                raw_data += bytes(color)
            elif dist < size * 0.45:
                # Border: dark
                raw_data += bytes((2, 11, 11))
            else:
                # Transparent background (dark)
                raw_data += bytes((2, 11, 11))

    compressed = zlib.compress(raw_data)
    idat = png_chunk(b'IDAT', compressed)
    iend = png_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend

os.makedirs('extension/icons', exist_ok=True)

for size in [16, 48, 128]:
    png_data = create_png(size)
    path = f'extension/icons/icon{size}.png'
    with open(path, 'wb') as f:
        f.write(png_data)
    print(f'Created {path}')

print('Icons created successfully!')