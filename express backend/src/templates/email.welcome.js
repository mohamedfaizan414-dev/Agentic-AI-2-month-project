
const welcomeEmail = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; background-color: #000000; padding: 20px 0; }
        
        /* The Card Effect */
        .main { 
            background: linear-gradient(145deg, #0f0f0f 0%, #050505 100%); 
            margin: 0 auto; 
            width: 100%; 
            max-width: 500px; 
            border: 1px solid #1a1a1a; 
            border-radius: 24px; 
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        
        /* Gold Accent Header */
        .top-glow { 
            height: 4px; 
            background: linear-gradient(90deg, transparent, #D4AF37, transparent); 
            width: 100%;
        }

        .header { padding: 50px 0 30px; text-align: center; }
        .logo-small { width: 42px; height: auto; opacity: 0.9; }
        
        /* Typography */
        .content { padding: 0 45px 50px; text-align: center; }
        .eyebrow { 
            color: #ffffff; 
            font-size: 11px; 
            font-weight: 800; 
            text-transform: uppercase; 
            letter-spacing: 5px; 
            margin-bottom: 15px; 
            display: block; 
        }
        h1 { font-size: 32px; font-weight: 200; color: #D4AF37; margin: 0 0 15px; letter-spacing: -0.5px; }
        p { font-size: 15px; color: #888888; line-height: 1.7; margin-bottom: 35px; }
        
        /* Premium Button */
        .cta-btn { 
            display: inline-block; 
            background: #D4AF37; 
            color: #000000; 
            text-decoration: none; 
            padding: 18px 45px; 
            font-size: 13px; 
            font-weight: 700; 
            border-radius: 50px; /* Pill shape is more modern */
            text-transform: uppercase; 
            letter-spacing: 2px;
            box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }
        
        /* Visual Feature List */
        .feature-box {
            margin-top: 45px;
            background: rgba(255,255,255,0.03);
            border-radius: 16px;
            padding: 25px;
            text-align: left;
        }
        .feature-row { display: table; width: 100%; margin-bottom: 15px; }
        .feature-icon { display: table-cell; width: 30px; color: #D4AF37; font-size: 18px; vertical-align: top; }
        .feature-text { display: table-cell; color: #dddddd; font-size: 13px; line-height: 1.4; vertical-align: top; }

        /* Footer */
        .footer { padding: 40px 20px; text-align: center; font-size: 10px; color: #444444; text-transform: uppercase; letter-spacing: 2px; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main">
            <tr><td class="top-glow"></td></tr>
            <tr>
                <td class="header">
                    <img src="../img/Logo.png" alt="Azentix" class="logo-small">
                </td>
            </tr>
            <tr>
                <td class="content">
                    <span class="eyebrow">The Destination Awaits</span>
                    <h1>Welcome to Azentix {name}</h1>
                    <p>You’ve unlocked a new standard of exploration. Where precision meets wanderlust, your AI-powered journey begins.</p>
                    
                    <a href="#" class="cta-btn">Start Exploring</a>
                    
                    <div class="feature-box">
                        <div class="feature-row">
                            <div class="feature-icon">🧭</div>
                            <div class="feature-text"><strong>Smart Navigation</strong><br>Optimized routes designed by travel intelligence.</div>
                        </div>
                        <div class="feature-row" style="margin-bottom: 0;">
                            <div class="feature-icon">✨</div>
                            <div class="feature-text"><strong>Curated Access</strong><br>Hidden gems filtered for your unique preferences.</div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; 2026 AZENTIX GLOBAL <br>
                    <span style="color: #222;">London • New York • Dubai • Kerala</span>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`

module.exports = welcomeEmail