import re
with open('src/modules/wallet/components/QRScanner.tsx') as f:
    text = f.read()
text = text.replace('import { useState, useRef, useEffect, useCallback } from "react";', 'import { useState } from "react";')
text = text.replace('  const canvasRef = useRef<HTMLCanvasElement>(null);\n', '')
text = text.replace('  const streamRef = useRef<MediaStream | null>(null);\n', '')
text = text.replace('  const rafRef = useRef<number>(0);\n', '')
text = re.sub(r'  const stopCamera = useCallback.*?}, ;\n\n', '', text, flags=re.DOTALL)
text = re.sub(r'  useEffect.*?}, mode, onScan, stopCamera;\n\n', '', text, flags=re.DOTALL)
text = re.sub(r'      \{mode === "camera" && .*?)', '', text, flags=re.DOTALL)
with open('src/modules/wallet/components/QRScanner.tsx', 'w') as f:
    f.write(text)
print('Done')
