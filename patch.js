const fs = require('fs');
const path = require('path');
const asar = require('@electron/asar');
const readline = require('readline');

async function findOrPromptPath() {
    let asarPath = process.argv[2];

    if (asarPath) {
        if (fs.existsSync(asarPath)) {
            return asarPath;
        } else {
            console.error(`\n❌ Error: File not found at: ${asarPath}`);
            process.exit(1);
        }
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("==================================================");
    console.log("  Antigravity Unofficial Korean Patch");
    console.log("==================================================");
    console.log("");
    console.log("Please enter the absolute path to your Antigravity 'app.asar' file.");
    console.log("");
    console.log("Example paths:");
    console.log("  [Windows] C:\\Users\\Username\\AppData\\Local\\Programs\\Antigravity\\resources\\app.asar");
    console.log("  [macOS]   /Applications/Antigravity.app/Contents/Resources/app.asar");
    console.log("  [Linux]   /opt/Antigravity/resources/app.asar");
    console.log("");

    return new Promise(resolve => {
        rl.question('> ', (answer) => {
            rl.close();
            resolve(answer.trim().replace(/^['"]|['"]$/g, ''));
        });
    });
}

async function runPatch() {
    const asarPath = await findOrPromptPath();

    if (!asarPath || !fs.existsSync(asarPath)) {
        console.error(`\n❌ Error: File not found at: ${asarPath || '(empty)'}`);
        console.error("Please make sure you entered the correct path to app.asar.");
        process.exit(1);
    }

    if (!asarPath.endsWith('app.asar')) {
        console.error(`\n❌ Error: The specified file is not 'app.asar': ${asarPath}`);
        console.error("Please provide the path to the 'app.asar' file.");
        process.exit(1);
    }

    const extractDir = path.join(__dirname, 'app-extracted');
    const backupPath = asarPath + '.bak';

    // Step 1: Backup
    console.log(`\n[1/4] Found app.asar at: ${asarPath}`);
    if (!fs.existsSync(backupPath)) {
        console.log(`      Creating backup at: ${backupPath}`);
        fs.copyFileSync(asarPath, backupPath);
    } else {
        console.log(`      Backup already exists at: ${backupPath}`);
    }

    // Step 2: Extract
    console.log(`[2/4] Extracting app.asar...`);
    if (fs.existsSync(extractDir)) {
        fs.rmSync(extractDir, { recursive: true, force: true });
    }
    try {
        asar.extractAll(asarPath, extractDir);
    } catch (err) {
        console.error(`\n❌ Error: Failed to extract app.asar`);
        console.error(err.message);
        process.exit(1);
    }

    // Verify preload.js exists
    const preloadPath = path.join(extractDir, 'dist', 'preload.js');
    if (!fs.existsSync(preloadPath)) {
        console.error(`\n❌ Error: 'dist/preload.js' not found inside app.asar.`);
        console.error("This does not appear to be an Antigravity app.asar file.");
        fs.rmSync(extractDir, { recursive: true, force: true });
        process.exit(1);
    }

    // Step 3: Inject translations
    console.log(`[3/4] Applying Korean translations...`);
    let preload = fs.readFileSync(preloadPath, 'utf8');

    if (preload.includes('EXTERNAL_T')) {
        console.log("      Already patched. Repacking without changes...");
    } else if (!preload.includes('const T = {')) {
        console.error(`\n❌ Error: This does not appear to be an Antigravity app.asar file.`);
        console.error("The expected translation hook was not found in preload.js.");
        fs.rmSync(extractDir, { recursive: true, force: true });
        process.exit(1);
    } else {
        const dict = require('./dictionary.json');
        const injectedT = 'const EXTERNAL_T = ' + JSON.stringify(dict, null, 4) + ';\n            const T = {\n                ...EXTERNAL_T,';

        preload = preload.replace(/const T = \{/, injectedT);

        const appendRegexLogic = `
                // ━━ Dynamic regex replacements for Customizations ━━
                const tokenMatch = trimmed.match(/^([\\d\\.]+)% of the customization budget is available\\.$/);
                if (tokenMatch) {
                    return \`사용자 지정 예산의 \${tokenMatch[1]}%를 사용할 수 있습니다.\`;
                }

                // Regex match for "Refreshes in X hours, Y minutes"`;
        preload = preload.replace(/\/\/ Regex match for "Refreshes in X hours, Y minutes"/, appendRegexLogic);

        fs.writeFileSync(preloadPath, preload);
        console.log("      Translations successfully injected.");
    }

    // Step 4: Repack
    console.log(`[4/4] Repacking app.asar...`);
    try {
        await asar.createPackage(extractDir, asarPath);
        fs.rmSync(extractDir, { recursive: true, force: true });
        console.log(`\n✅ Korean patch successfully applied!`);
        console.log(`Please restart the Antigravity application to see the changes.`);
    } catch (err) {
        console.error("\n❌ Error: Failed to repack app.asar:");
        console.error(err.message);
        console.error("Your original backup is at: " + backupPath);
        fs.rmSync(extractDir, { recursive: true, force: true });
        process.exit(1);
    }
}

runPatch();
