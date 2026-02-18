import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

(async () => {
    console.log('Starting UX Audit Simulation v3.0 (Robust Selectors)...');
    const browser = await puppeteer.launch({
        headless: "new", // Use new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some environments
    });
    const page = await browser.newPage();

    // Set viewport for consistent screenshots
    await page.setViewport({ width: 1280, height: 800 });

    const SCREENSHOT_DIR = './audit_screenshots';
    if (!fs.existsSync(SCREENSHOT_DIR)) {
        fs.mkdirSync(SCREENSHOT_DIR);
    }

    try {
        // 1. Landing Page
        console.log('Navigating to Landing Page...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${SCREENSHOT_DIR}/01_landing_page.png` });
        console.log('Captured Landing Page.');

        // 2. Click CTA
        console.log('Clicking CTA...');
        const cta = await page.$('a[href="/test"]');
        if (cta) {
            await cta.click();
        } else {
            console.error('CTA not found!');
            throw new Error('CTA not found');
        }

        // 3. Wizard Flow
        console.log('Entering Wizard...');
        await page.waitForSelector('h2', { timeout: 10000 });
        await page.screenshot({ path: `${SCREENSHOT_DIR}/02_wizard_step1.png` });

        const clickOption = async (textIncludes) => {
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                const text = await page.evaluate(el => el.textContent, btn);
                if (text.toLowerCase().includes(textIncludes.toLowerCase())) {
                    await btn.click();
                    return;
                }
            }
            throw new Error(`Option "${textIncludes}" not found`);
        };

        const clickNext = async () => {
            // Wait for button to be potentially enabled/visible
            await new Promise(r => setTimeout(r, 500));
            const buttons = await page.$$('button');
            for (const btn of buttons) {
                const text = await page.evaluate(el => el.textContent, btn);
                if (text.includes('Continue') || text.includes('Start Assessment')) {
                    await btn.click();
                    return;
                }
            }
            throw new Error('Next/Continue button not found');
        };

        // Step 1: Relationship Status
        await clickOption('Stable but stuck');
        await new Promise(r => setTimeout(r, 1000)); // Animation wait
        await clickNext();
        console.log('Completed Step 1');

        // Step 2: History
        await page.waitForSelector('label', { timeout: 10000 });
        await clickOption('2-5yr');
        await clickNext();
        console.log('Completed Step 2');

        // Step 3: Conflict
        await page.waitForSelector('select', { timeout: 10000 });
        const conflictSelects = await page.$$('select');
        if (conflictSelects.length >= 3) {
            await conflictSelects[0].select('weekly');
            await new Promise(r => setTimeout(r, 200));
            await conflictSelects[1].select('withdraws');
            await new Promise(r => setTimeout(r, 200));
            await conflictSelects[2].select('sometimes');
        } else {
            console.error('Step 3: Found ' + conflictSelects.length + ' selects, expected >= 3');
            const content = await page.content();
            console.log('Page content dump (partial):', content.substring(0, 500));
            throw new Error('Step 3 Failed: Selects missing');
        }
        await clickNext();
        console.log('Completed Step 3');

        // Step 4: Demographics
        await page.waitForSelector('label', { timeout: 10000 });
        await clickOption('Male'); // User Gender
        await new Promise(r => setTimeout(r, 300));
        await clickOption('Female'); // Partner Gender
        await new Promise(r => setTimeout(r, 300));

        // Re-query for selects because demographics page structure might differ or re-render
        const demoSelects = await page.$$('select');
        if (demoSelects.length >= 2) {
            await demoSelects[0].select('25-34');
            await new Promise(r => setTimeout(r, 200));
            await demoSelects[1].select('25-34');
            await new Promise(r => setTimeout(r, 200));
        } else {
            console.error('Step 4: Found ' + demoSelects.length + ' selects, expected >= 2');
            throw new Error('Step 4 Failed: Selects missing');
        }
        await clickNext();
        console.log('Completed Step 4');

        // Step 5: Fear (Wait for specific text)
        console.log('Waiting for Step 5...');
        await page.waitForFunction(
            () => document.body.innerText.includes('One last difficult question'),
            { timeout: 20000 }
        );
        await clickOption('That I\'m not happy');
        await clickNext(); // "Start Assessment"
        console.log('Completed Step 5');

        // 4. Assessment (32 questions)
        console.log('Starting Main Assessment...');

        // Wait for Question Header (e.g., "1/32") to ensure quiz loaded
        await page.waitForFunction(
            () => document.body.innerText.includes('1/'),
            { timeout: 20000 }
        );

        for (let i = 0; i < 32; i++) {
            try {
                await page.waitForSelector('button', { timeout: 5000 });
                const buttons = await page.$$('button');
                if (buttons.length >= 5) {
                    // Click middle option (neutral)
                    // Need to ensure we aren't clicking back/next buttons if they exist separately
                    // But the test page structure usually has 5 option buttons + nav buttons
                    // Let's assume the first 5 buttons in the container are the options
                    await buttons[2].click();
                } else {
                    console.log('Unexpected button count, clicking first available...');
                    if (buttons.length > 0) await buttons[0].click();
                }
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                console.log(`Question ${i + 1} interaction failed/skipped: ${e.message}`);
            }
        }
        console.log('Assessment Completed.');

        // 5. Processing / Email Gate
        await new Promise(r => setTimeout(r, 6000));

        const url = page.url();
        console.log(`Current URL: ${url}`);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/03_post_assessment.png` });

        if (url.includes('test')) {
            const emailInput = await page.$('input[type="email"]');
            if (emailInput) {
                console.log('Email Gate detected. Filling email...');
                await emailInput.type('audit_v3@example.com');
                const submitBtn = await page.$('button[type="submit"]');
                if (submitBtn) await submitBtn.click();
                await new Promise(r => setTimeout(r, 6000));
            }
        }

        // 6. Results Page
        try {
            await page.waitForSelector('h1', { timeout: 30000 });
            console.log('Reached Results Page!');
            await page.screenshot({ path: `${SCREENSHOT_DIR}/04_results_page.png` });
        } catch (e) {
            console.log('Did not detect H1 on final page, taking screenshot anyway...');
            await page.screenshot({ path: `${SCREENSHOT_DIR}/04_final_state.png` });
        }

        console.log('Audit Trace Completed Successfully.');
    } catch (error) {
        console.error('Audit Failed:', error);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/error_snapshot.png` });
    } finally {
        await browser.close();
    }
})();
