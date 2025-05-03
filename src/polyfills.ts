// src/polyfills.ts

(window as any).global = window;

// Polyfill process and Buffer for browser
import * as process from 'process';
import { Buffer } from 'buffer';

(window as any).process = process;
(window as any).Buffer = Buffer;
