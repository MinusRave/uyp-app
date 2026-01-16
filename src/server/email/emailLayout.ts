
export const wrapHtml = (content: string, title: string = "UnderstandYourPartner"): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* Base Resets */
        body { margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        
        /* Typography & Colors */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            background-color: #FAF8F5; /* Warm Cream Background */
            color: #122639; /* Deep Navy Text */
            line-height: 1.6;
        }

        /* Layout */
        .wrapper { width: 100%; table-layout: fixed; background-color: #FAF8F5; padding-bottom: 40px; }
        .main-table { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .content-cell { padding: 40px 40px 20px 40px; }
        
        /* Elements */
        h1, h2, h3 { color: #122639; margin-top: 0; margin-bottom: 20px; font-weight: 700; }
        p { margin: 0 0 20px 0; font-size: 16px; color: #334155; }
        strong { color: #122639; font-weight: 600; }
        ul { padding-left: 20px; margin-bottom: 24px; }
        li { margin-bottom: 10px; color: #334155; }
        
        /* Links & Buttons */
        a { color: #8B55A5; text-decoration: underline; font-weight: 500; }
        .button { 
            background-color: #8B55A5; /* Soft Purple Brand Color */
            color: #ffffff !important; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            display: inline-block; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 10px 0 30px 0; 
            box-shadow: 0 4px 14px 0 rgba(139, 85, 165, 0.39);
            text-align: center;
        }
        .button:hover { background-color: #7A4996; }

        /* Header & Footer */
        .header { background-color: #ffffff; padding: 30px 40px 10px 40px; text-align: left; }
        .header-logo { font-size: 20px; font-weight: 800; color: #8B55A5; letter-spacing: -0.5px; text-decoration: none; }
        .footer { background-color: #FAF8F5; padding: 30px; text-align: center; font-size: 12px; color: #64748B; }
        .footer a { color: #64748B; text-decoration: underline; }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .content-cell { padding: 30px 20px; }
            .header { padding: 20px 20px 0 20px; }
            .button { width: 100%; box-sizing: border-box; }
        }
    </style>
</head>
<body>
    <table class="wrapper" role="presentation">
        <tr>
            <td>
                <table class="main-table" align="center" role="presentation">
                    <!-- Header -->
                    <tr>
                        <td class="header">
                            <a href="${process.env.WASP_WEB_CLIENT_URL}" class="header-logo">
                                UnderstandYourPartner
                            </a>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td class="content-cell">
                            ${content.replace(/class="[^"]*"/g, "") /* Clean existing classes */}
                        </td>
                    </tr>
                </table>
                
                <!-- Footer -->
                <table align="center" role="presentation" style="max-width: 600px; width: 100%; margin: 0 auto;">
                    <tr>
                        <td class="footer">
                            <p style="font-size: 12px; margin-bottom: 10px;">
                                © ${new Date().getFullYear()} UnderstandYourPartner. All rights reserved.
                            </p>
                            <p style="font-size: 12px; margin-bottom: 0;">
                                <a href="{{unsubscribe_url}}">Unsubscribe</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
