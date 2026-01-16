#!/usr/bin/env bun
import { writeFileSync } from 'fs';

const result = await Bun.build({
	entrypoints: ['bookmarklet.ts'],
	minify: true,
});

if (!result.success) {
	console.error('Build failed:');
	for (const log of result.logs) {
		console.error(log);
	}
	process.exit(1);
}

const code = await result.outputs[0].text();
const bookmarklet = 'javascript:' + code.trim();

writeFileSync('0000 GitHub PR Slack Clipboard Bookmarklet', bookmarklet);
console.log('Built bookmarklet:', bookmarklet.length, 'bytes');
