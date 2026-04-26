
const verifyEmail =`<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #0a0a0a; padding-bottom: 60px; }
        .main { background-color: #0a0a0a; margin: 0 auto; width: 100%; max-width: 500px; border-spacing: 0; color: #ffffff; }
        
        /* Small Logo Header */
        .header { padding: 40px 0 20px; text-align: center; }
        .logo-small { width: 45px; height: auto; filter: drop-shadow(0px 0px 5px rgba(212, 175, 55, 0.3)); }
        
        /* Content Section */
        .content { padding: 0 40px; text-align: center; }
        .brand-name { color: #D4AF37; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px; display: block; }
        h1 { font-size: 22px; font-weight: 300; margin: 0; letter-spacing: 0.5px; color: #f2f2f2; }
        .subtext { font-size: 14px; color: #888888; line-height: 1.6; margin-top: 15px; }
        
        /* The OTP Display */
        .otp-container { margin: 40px 0; }
        .otp-code { 
            font-size: 38px; 
            font-weight: 700; 
            color: #D4AF37; 
            letter-spacing: 12px; 
            padding-left: 12px; /* Centers the text properly with spacing */
        }
        .divider { height: 1px; width: 60px; background-color: #D4AF37; margin: 20px auto; opacity: 0.4; }
        
        /* Footer */
        .footer { padding: 40px; text-align: center; font-size: 11px; color: #444444; letter-spacing: 1px; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main">
            <tr>
                <td class="header">
                    <img src="../img/Logo.png" alt="A" class="logo-small">
                </td>
            </tr>
            <tr>
                <td class="content">
                    <span class="brand-name">Azentix</span>
                    <h1>Security Verification</h1>
                    <p class="subtext">Please use the following One-Time Password to verify your identity and continue your journey.</p>
                    
                    <div class="otp-container">
                        <div class="otp-code">{otp}</div>
                        <div class="divider"></div>
                    </div>
                    
                    <p class="subtext" style="font-size: 12px;">This code is valid for 10 minutes. <br>Our agents will never ask for this code over the phone.</p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    &copy; 2026 Azentix TRAVEL AI <br>
                    NAVIGATING THE EXTRAORDINARY
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`

module.exports = verifyEmail