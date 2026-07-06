package com.appraisal.appraisal.service;

import com.appraisal.appraisal.entity.enums.NotificationType;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Removed @Async — sending synchronously so we can see errors clearly.
 * Once emails are confirmed working we can add @Async back.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    // Base URL of the deployed frontend, used to build the "View in
    // Appraisal System" button in emails. Defaults to local dev so the
    // template still renders correctly if the property isn't set.
    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public void sendNotificationEmail(
            String toEmail,
            String toName,
            String title,
            String message,
            NotificationType type
    ) {
        log.info("=== EMAIL ATTEMPT: from={} to={} subject={}", fromAddress, toEmail, title);

        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");

            helper.setFrom(fromAddress, "Appraisal System");
            helper.setTo(toEmail);
            helper.setSubject(title);
            helper.setText(buildHtml(toName, title, message, type), true);

            mailSender.send(mime);
            log.info("=== EMAIL SUCCESS: to={} subject={}", toEmail, title);

        } catch (Exception e) {
            log.error("=== EMAIL FAILED: to={} subject={} error={}", toEmail, title, e.getMessage(), e);
        }
    }

    private String accentColor(NotificationType type) {
        return switch (type) {
            case SUCCESS   -> "#16a34a";
            case WARNING   -> "#d97706";
            case APPRAISAL -> "#7c3aed";
            case REVIEW    -> "#2563eb";
            case GOAL      -> "#0891b2";
            default        -> "#4f46e5";
        };
    }

    private String accentTint(NotificationType type) {
        return switch (type) {
            case SUCCESS   -> "#f0fdf4";
            case WARNING   -> "#fffbeb";
            case APPRAISAL -> "#f5f3ff";
            case REVIEW    -> "#eff6ff";
            case GOAL      -> "#ecfeff";
            default        -> "#eef2ff";
        };
    }

    private String typeLabel(NotificationType type) {
        return switch (type) {
            case SUCCESS   -> "Success";
            case WARNING   -> "Warning";
            case APPRAISAL -> "Appraisal Update";
            case REVIEW    -> "Review Update";
            case GOAL      -> "Goal Update";
            default        -> "Notification";
        };
    }

    // A simple glyph per category — keeps the header from being just a wall
    // of text and gives the eye something to anchor on, without depending
    // on external image hosting (which many mail clients block by default).
    private String typeGlyph(NotificationType type) {
        return switch (type) {
            case SUCCESS   -> "&#10003;"; // check mark
            case WARNING   -> "!";
            case APPRAISAL -> "&#9733;";  // star
            case REVIEW    -> "&#128196;"; // page
            case GOAL      -> "&#127919;"; // target
            default        -> "&#9679;";  // dot
        };
    }

    private String firstName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "there";
        String trimmed = fullName.trim();
        int spaceIdx = trimmed.indexOf(' ');
        return spaceIdx > 0 ? trimmed.substring(0, spaceIdx) : trimmed;
    }

    private String buildHtml(String toName, String title, String message, NotificationType type) {
        String accent = accentColor(type);
        String tint = accentTint(type);
        String label = typeLabel(type);
        String glyph = typeGlyph(type);
        String greetingName = firstName(toName);
        String year = String.valueOf(java.time.Year.now().getValue());

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8"/>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                  <meta name="color-scheme" content="light"/>
                  <meta name="supported-color-schemes" content="light"/>
                  <title>%s</title>
                  <!--[if mso]>
                  <noscript>
                    <xml>
                      <o:OfficeDocumentSettings>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                      </o:OfficeDocumentSettings>
                    </xml>
                  </noscript>
                  <![endif]-->
                </head>
                <body style="margin:0;padding:0;background:#eef1f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                  <!-- Preheader: shows in the inbox preview line, hidden in the body -->
                  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
                    %s &#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;&#8202;
                  </div>

                  <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:40px 16px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="640" cellpadding="0" cellspacing="0"
                               style="width:640px;max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;
                                      box-shadow:0 4px 24px rgba(17,24,39,.08);">

                          <!-- Brand bar -->
                          <tr>
                            <td style="background:#111827;padding:24px 40px;">
                              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="left" style="vertical-align:middle;">
                                    <span style="display:inline-block;width:28px;height:28px;line-height:28px;
                                                 border-radius:8px;background:%s;color:#ffffff;text-align:center;
                                                 font-size:15px;font-weight:700;vertical-align:middle;">A</span>
                                    <span style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:.2px;
                                                 vertical-align:middle;margin-left:10px;">
                                      Appraisal System
                                    </span>
                                  </td>
                                  <td align="right" style="vertical-align:middle;">
                                    <span style="color:#9ca3af;font-size:12px;letter-spacing:.3px;">
                                      Performance &amp; Growth
                                    </span>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <!-- Category ribbon -->
                          <tr>
                            <td style="background:%s;padding:14px 40px;border-bottom:1px solid rgba(0,0,0,.04);">
                              <span style="display:inline-block;width:22px;height:22px;line-height:22px;
                                           border-radius:999px;background:%s;color:#ffffff;text-align:center;
                                           font-size:12px;font-weight:700;vertical-align:middle;">%s</span>
                              <span style="color:%s;font-size:13px;font-weight:700;letter-spacing:.4px;
                                           text-transform:uppercase;vertical-align:middle;margin-left:10px;">
                                %s
                              </span>
                            </td>
                          </tr>

                          <!-- Body -->
                          <tr>
                            <td style="padding:40px 40px 8px;">
                              <p style="margin:0 0 6px;font-size:14px;color:#6b7280;">Hi %s,</p>
                              <h1 style="margin:0 0 18px;font-size:23px;line-height:1.35;font-weight:700;color:#111827;">
                                %s
                              </h1>
                              <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#374151;">
                                %s
                              </p>

                              <!-- CTA button -->
                              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                                <tr>
                                  <td align="center" style="border-radius:10px;background:%s;">
                                    <a href="%s" target="_blank"
                                       style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;
                                              color:#ffffff;text-decoration:none;border-radius:10px;">
                                      View in Appraisal System &rarr;
                                    </a>
                                  </td>
                                </tr>
                              </table>

                              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;"/>

                              <p style="margin:0;font-size:12.5px;color:#9ca3af;line-height:1.6;">
                                This is an automated notification from your Appraisal System.
                                If you weren't expecting this, you can safely ignore it — no action is required.
                                Please do not reply directly to this email.
                              </p>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
                              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="left" style="font-size:12px;color:#9ca3af;">
                                    &copy; %s Appraisal System. All rights reserved.
                                  </td>
                                  <td align="right" style="font-size:12px;">
                                    <a href="%s" style="color:#6b7280;text-decoration:underline;">Open dashboard</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                        </table>

                        <p style="margin:20px 0 0;font-size:11.5px;color:#9ca3af;">
                          You're receiving this because you have an account on the Appraisal System.
                        </p>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(
                title,               // <title>
                title,               // preheader text
                accent,              // brand mark background
                tint,                // category ribbon background
                accent,              // category glyph badge background
                glyph,               // category glyph
                accent,              // category label color
                label,               // category label text
                greetingName,        // "Hi {name},"
                title,               // h1
                message,             // body paragraph
                accent,              // CTA button background
                frontendUrl,         // CTA button href
                year,                // footer copyright year
                frontendUrl          // footer "Open dashboard" href
        );
    }
}