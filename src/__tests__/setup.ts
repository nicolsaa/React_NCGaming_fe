// Minimal setup file for Vitest configuration
// Polyfills for Node-like test environment

// Provide lightweight TextEncoder/TextDecoder polyfills if not present
;(globalThis as any).TextEncoder = (globalThis as any).TextEncoder || class {
  encode(str: string): Uint8Array {
    // Simple ASCII encoder; non-ASCII chars are replaced with '?'
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code < 0x80) bytes.push(code);
      else bytes.push(0x3f); // '?'
    }
    return new Uint8Array(bytes);
  }
};

;(globalThis as any).TextDecoder = (globalThis as any).TextDecoder || class {
  decode(input: Uint8Array): string {
    let out = '';
    for (let i = 0; i < input.length; i++) {
      const b = input[i];
      out += b < 128 ? String.fromCharCode(b) : '?';
    }
    return out;
  }
};

// Mock localStorage for tests
(globalThis as any).localStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
  clear: () => {},
};

export {};
