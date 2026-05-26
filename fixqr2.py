with open('src/modules/wallet/components/QRScanner.tsx') as f:
    text = f.read()

# 1. Fix import
text = text.replace(
    'import { useState, useRef, useEffect, useCallback } from "react";',
    'import { useState } from "react";'
)

# 2. Delete stopCamera
start = text.find('  const stopCamera = useCallback')
if start != -1:
    end = text.find('  }, []);', start)
    if end != -1:
        end = text.find('\n\n', end) + 2
        text = text[:start] + text[end:]

# 3. Delete useEffect
start = text.find('  useEffect(() => {')
if start != -1:
    end = text.find('  }, [mode, onScan, stopCamera]);', start)
    if end != -1:
        end = text.find('\n\n', end) + 2
        text = text[:start] + text[end:]

# 4. Delete camera render block
start = text.find('      {mode === "camera" && (')
if start != -1:
    end = text.find('\n      )}', start)
    if end != -1:
        end = text.find('\n', end) + 1
        text = text[:start] + text[end:]

# 5. Delete camera button from tabs
start = text.find('        <button onClick={() => setMode("camera")')
if start != -1:
    end = text.find('</button>', start) + 9
    if end != -1:
        text = text[:start] + text[end:]

# 6. Delete refs
for ref in ['  const canvasRef', '  const streamRef', '  const rafRef']:
    start = text.find(ref)
    if start != -1:
        end = text.find(';\n', start) + 2
        text = text[:start] + text[end:]

with open('src/modules/wallet/components/QRScanner.tsx', 'w') as f:
    f.write(text)
print('Done')
