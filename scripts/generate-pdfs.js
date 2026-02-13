
import fs from 'fs';
import path from 'path';
import markdownIt from 'markdown-it';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GUIDES_DIR = path.join(__dirname, '../.ai');
const OUTPUT_DIR = path.join(__dirname, '../private/pdfs');
const LOGO_PATH = path.join(__dirname, '../src/client/static/logo.png');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Markdown parser setup
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Guide mapping (Filename -> Title/Output Name)
const guides = [
  { file: 'guide_dead_bedroom_revival.md', title: 'Dead Bedroom Revival Protocol', subtitle: 'Reigniting intimacy through connection & understanding.', output: 'dead-bedroom-revival.pdf' },
  { file: 'guide_emotional_affair_warning.md', title: 'Emotional Affair Warning Signs', subtitle: 'Analyzing subtle breaches of trust & recovery steps.', output: 'emotional-affair-warning.pdf' },
  { file: 'guide_mental_load_equalizer.md', title: 'Mental Load Equalizer', subtitle: 'Strategic framework for fair household management.', output: 'mental-load-equalizer.pdf' },
  { file: 'guide_narcissist_detection_manual.md', title: 'Narcissist Detection Manual', subtitle: 'Clinical markers of high-conflict personality types.', output: 'narcissist-detection-manual.pdf' },
  { file: 'guide_shoud_i_stay_or_should_i_go.md', title: 'Stay or Go Decision Matrix', subtitle: 'Objective assessment for critical relationship choices.', output: 'stay-or-go-matrix.pdf' }
];

// Brand-Match CSS for PDF
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  :root {
    /* Brand Colors from Main.css */
    --primary: #9d5ec2; /* hsl(280 40% 55%) Soft Purple converted to Hex for PDF safety */
    --primary-light: #bca0d3; 
    --secondary: #e5937a; /* hsl(15 65% 65%) Warm Peach */
    --accent: #d97b66; /* hsl(10 60% 60%) Terracotta */
    --text: #13222e;    /* hsl(200 50% 15%) Deep Navy */
    --text-light: #52667a; /* Muted navy/slate */
    --bg-light: #fdfaf6; /* hsl(35 30% 98%) Warm Cream Background */
    --border-light: #eaddd3; /* hsl(35 20% 85%) Taupe Border */
  }

  /* RESET & BASE */
  * { box-sizing: border-box; }

  body {
    font-family: 'Atkinson Hyperlegible', sans-serif;
    color: var(--text);
    line-height: 1.6;
    font-size: 12pt; /* Slightly larger for Hyperlegible */
    margin: 0;
    padding: 0;
    text-align: left; /* Hyperlegible works better left-aligned usually */
    -webkit-font-smoothing: antialiased;
    background: white;
  }

  /* PAGE LAYOUT */
  @page {
    size: A4;
    margin: 25mm 25mm 25mm 25mm;
    @bottom-center {
      content: counter(page);
      font-family: 'Atkinson Hyperlegible', sans-serif;
      font-size: 9pt;
      color: var(--text-light);
    }
  }

  /* UTILITY CLASSES */
  .page-break {
    page-break-before: always;
    break-before: page;
    display: block;
    height: 1px;
    margin: 2em 0;
  }

  /* COVER PAGE */
  .cover-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    page-break-after: always;
    break-after: page;
    background: var(--bg-light); /* Warm cream brand bg */
    border: 1px solid var(--border-light);
  }

  .cover-brand {
    font-family: 'Atkinson Hyperlegible', sans-serif;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-size: 10pt;
    color: var(--accent);
    margin-bottom: 40px;
    font-weight: 700;
  }

  .cover-logo {
    width: 120px;
    margin-bottom: 40px;
  }

  .cover-title {
    font-family: 'Atkinson Hyperlegible', sans-serif;
    font-size: 32pt;
    font-weight: 700;
    color: var(--primary);
    line-height: 1.1;
    margin: 0 0 25px 0;
    max-width: 80%;
  }

  .cover-subtitle {
    font-family: 'Atkinson Hyperlegible', sans-serif;
    font-style: italic;
    font-size: 16pt;
    color: var(--text-light);
    margin-bottom: 80px;
    max-width: 70%;
    line-height: 1.4;
  }

  /* HEADERS */
  h1, h2, h3, h4 {
    color: var(--primary);
    page-break-after: avoid;
    break-after: avoid;
    text-align: left;
  }

  h1 { 
    font-size: 24pt;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 30px;
    border-bottom: 4px solid var(--secondary); /* Peach accent underline */
    padding-bottom: 10px;
  }
  
  .subtitle {
    font-style: italic;
    font-size: 14pt;
    color: var(--text-light);
    margin-bottom: 40px;
  }

  h2 {
    font-size: 18pt;
    font-weight: 700;
    margin-top: 40px;
    margin-bottom: 20px;
    color: var(--text); /* Dark Navy for H2 */
    border-bottom: 2px solid var(--border-light);
    padding-bottom: 8px;
  }

  h3 {
    font-size: 14pt;
    font-weight: 700;
    margin-top: 30px;
    margin-bottom: 15px;
    color: var(--accent); /* Terracotta */
  }
  
  h4 {
    font-size: 12pt;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 8px;
    color: var(--secondary); /* Peach */
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* TEXT ELEMENTS */
  p {
    margin-bottom: 1.25em;
    orphans: 3;
    widows: 3;
  }

  strong {
    font-weight: 700;
    color: var(--primary); /* Purple emphasis */
  }

  ul, ol {
    margin: 1em 0 1.5em 0;
    padding-left: 2em;
  }

  li {
    margin-bottom: 0.5em;
    padding-left: 0.5em;
  }

  /* CUSTOM BOXES - BRANDED */
  
  /* "Important" / "Truth" Box */
  .highlight-box {
    background: #f8f4fb; /* Very light purple tint */
    border-left: 6px solid var(--primary);
    padding: 1.5em;
    margin: 2em 0;
    border-radius: 0 1rem 1rem 0; /* Brand radius */
    page-break-inside: avoid;
  }
  
  /* Quote / Example Box */
  .example-box {
    background: var(--bg-light); /* Warm cream */
    border-left: 6px solid var(--text-light);
    padding: 1.5em;
    margin: 1.5em 0;
    font-style: italic;
    color: var(--text-light);
    border-radius: 0 1rem 1rem 0;
    page-break-inside: avoid;
  }

  /* Self Check / Quiz Box */
  .self-check-box {
    background: #fff8f6; /* Light peach tint */
    border: 1px solid var(--border-light);
    border-left: 6px solid var(--secondary);
    padding: 1.5em;
    margin: 2em 0;
    border-radius: 1rem;
    page-break-inside: avoid;
  }

  /* Action Steps */
  .action-step {
    background: #fdfaf6;
    border: 2px solid var(--border-light);
    padding: 1.5em;
    margin: 2em 0;
    border-radius: 1rem;
    position: relative;
    page-break-inside: avoid;
  }
  
  .action-step h4 {
    margin-top: 0;
    color: var(--primary);
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin: 2em 0;
    page-break-inside: avoid;
  }
  
  .comparison-grid div {
    background: var(--bg-light);
    padding: 20px;
    border: 1px solid var(--border-light);
    border-radius: 1rem;
  }

  .section-divider {
    border-top: 2px dotted var(--border-light);
    margin: 3em auto;
    width: 60%;
  }
  
  .list-item-box {
    border-bottom: 1px solid var(--border-light);
    padding: 15px 0;
    page-break-inside: avoid;
  }
  
  .callout-final {
    text-align: center;
    font-size: 1.25em;
    margin: 3em 0;
    padding: 3em;
    background: var(--primary);
    color: white;
    border-radius: 1rem;
  }
  
  .callout-final strong {
    color: var(--secondary); /* Peach accent on purple bg */
    display: block;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 15px;
    font-size: 0.8em;
  }

  /* Links */
  a {
    color: var(--primary);
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;
    text-decoration-color: var(--secondary);
  }
`;

async function generatePDFs() {
  console.log('🚀 Starting "Book Quality" PDF generation...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    for (const guide of guides) {
      const inputPath = path.join(GUIDES_DIR, guide.file);
      const outputPath = path.join(OUTPUT_DIR, guide.output);

      console.log(`Processing: ${guide.title}...`);

      if (!fs.existsSync(inputPath)) {
        console.warn(`⚠️ File not found: ${inputPath}`);
        continue;
      }

      let markdown = fs.readFileSync(inputPath, 'utf-8');

      // Clean duplicate title from MD
      // markdown = markdown.replace(/^#\s+.+$/m, ''); 

      // Render Markdown
      const contentHtml = md.render(markdown);

      // Load Logo
      let logoBase64 = '';
      if (fs.existsSync(LOGO_PATH)) {
        const logoData = fs.readFileSync(LOGO_PATH);
        logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>${css}</style>
        </head>
        <body>
          
          <!-- Cover Page -->
          <div class="cover-page">
            <div class="cover-brand">CLINICAL RELATIONSHIP PROTOCOL</div>
            ${logoBase64 ? `<img src="${logoBase64}" class="cover-logo" />` : ''}
            <div class="cover-title">${guide.title}</div>
            <div class="cover-subtitle">${guide.subtitle}</div>
            
            <div style="position: absolute; bottom: 50px; font-family: 'Montserrat', sans-serif; font-size: 8pt; color: #64748b; text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid #e2e8f0; padding-top: 20px; width: 60%;">
              Private & Confidential Client Material<br>
              &copy; ${new Date().getFullYear()} UnderstandYourPartner.com
            </div>
          </div>

          <!-- Main Content -->
          <div class="content">
            ${contentHtml}
          </div>

        </body>
        </html>
      `;

      // Save HTML fallback
      const htmlOutputPath = outputPath.replace('.pdf', '.html');
      fs.writeFileSync(htmlOutputPath, html);
      console.log(`✅ Saved HTML: ${path.basename(htmlOutputPath)}`);

      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Wait for fonts to be ready
        await page.evaluateHandle('document.fonts.ready');

        await page.pdf({
          path: outputPath,
          format: 'A4',
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: '<div></div>',
          footerTemplate: `
            <div style="font-family: 'Montserrat', sans-serif; font-size: 7pt; color: #94a3b8; width: 100%; padding: 0 25mm 10mm 25mm; display: flex; justify-content: space-between;">
              <span>${guide.title}</span>
              <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
            </div>
          `,
          margin: {
            top: '25mm',
            bottom: '25mm',
            left: '25mm',
            right: '25mm'
          }
        });

        console.log(`✅ Generated PDF: ${guide.output}`);
        await page.close();
      } catch (pdfError) {
        console.error(`⚠️ PDF Generation failed. Use HTML fallback. Error:`, pdfError.message);
      }
    }
  } catch (error) {
    console.error('❌ Critical Error:', error);
  } finally {
    if (browser) await browser.close();
    console.log('✨ Process complete!');
  }
}

generatePDFs();
