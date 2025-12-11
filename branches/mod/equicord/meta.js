import { rm } from "fs/promises";
import { createWriteStream, mkdirSync } from "fs";
import { join } from "path";
import { Writable } from "stream";

export const name = "Vencord (but actually)";
export const description = "Injects your Vencord fork";
export const incompatibilities = ["betterdiscord", "vencord", "moonlight"];

export async function setup(target, log) {
	const releaseUrl = "https://github.com/suprdratts/Vencord/releases/download/latest/";

	mkdirSync(join(target, "equicord-desktop"), { recursive: true });

	for (const f of ["equibopMain.js", "equibopPreload.js", "renderer.js", "renderer.css"]) {
		log(`Downloading ${f}...`);

		const p = join(target, "equicord-desktop", f);
		await rm(p, { force: true });

		const req = await fetch(releaseUrl + f);
		await req.body.pipeTo(Writable.toWeb(createWriteStream(p)));
	}

	log("Done!");
}
