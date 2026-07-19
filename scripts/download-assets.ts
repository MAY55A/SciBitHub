import dotenv from "dotenv"
import fs from "fs/promises";
import path from "path";
import JSZip from "jszip";


// load .env.development.local
dotenv.config({ path: path.join(process.cwd(), ".env.development.local") })

const {
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_RELEASE_TAG
} = process.env;

const OUTPUT_DIR = path.join(process.cwd(), ".storage-assets");


async function downloadReleaseZip() {

    const releaseUrl =
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/tags/${GITHUB_RELEASE_TAG}`;

    const releaseResponse =
        await fetch(releaseUrl);

    if (!releaseResponse.ok) {
        throw new Error(
            "Could not fetch GitHub release"
        );
    }

    const release =
        await releaseResponse.json();

    const asset =
        release.assets.find(
            (asset: any) =>
                asset.name.endsWith(".zip")
        );

    if (!asset) {
        throw new Error(
            "No zip file found in release"
        );
    }

    console.log(
        `Downloading ${asset.name}`
    );

    const response =
        await fetch(
            asset.browser_download_url
        );

    return Buffer.from(
        await response.arrayBuffer()
    );
}


async function extractZip(
    buffer: Buffer
) {

    const zip = await JSZip.loadAsync(buffer);

    // use a temp dir for extraction
    const TEMP_DIR = OUTPUT_DIR + "_temp"

    await fs.rm(TEMP_DIR, { recursive: true, force: true })
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
    await fs.mkdir(TEMP_DIR, { recursive: true })

    for (const filename of Object.keys(zip.files)) {
        const file = zip.files[filename]
        const outputPath = path.join(TEMP_DIR, filename)

        if (file.dir) {
            await fs.mkdir(outputPath, { recursive: true })
        } else {
            await fs.mkdir(path.dirname(outputPath), { recursive: true })
            const content = await file.async("nodebuffer")
            await fs.writeFile(outputPath, content)
        }
    }

    // find the single extracted folder and rename it to OUTPUT_DIR
    const entries = await fs.readdir(TEMP_DIR)
    const rootFolder = path.join(TEMP_DIR, entries[0])
    await fs.rename(rootFolder, OUTPUT_DIR)

    // remove temp dir
    await fs.rm(TEMP_DIR, { recursive: true, force: true })

    console.log(`Extracted assets to ${OUTPUT_DIR}`)
}


async function main() {

    const zip =
        await downloadReleaseZip();

    await extractZip(zip);
}


main();