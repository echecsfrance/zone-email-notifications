import { format, isSameDay } from "date-fns";
import { enGB, fr } from "date-fns/locale";

import { Tournament } from "../types.js";

type Messages = {
  htmlTitle: string;
  preheader: string;
  hello: string;
  introduction: string;
  blitz: string;
  rapids: string;
  classics: string;
  others: string;
  unsubscribe: string;
};

const enMessages: Messages = {
  htmlTitle: "Échecs France - New Tournaments",
  preheader: "New chess tournament announcements",
  hello: "Hello,",
  introduction:
    "Here are the chess tournaments that have recently been announced in your selected zones:",
  blitz: "Blitz Tournaments",
  rapids: "Rapid Tournaments",
  classics: "Classical Tournaments",
  others: "Other Tournaments",
  unsubscribe: `Visit your profile to amend these zones, or visit <a href="https://echecsfrance.com">Échecs France</a> to see more tournaments.`,
};

const frMessages: Messages = {
  htmlTitle: "Échecs France - Nouveaux Tournois",
  preheader: "Annonces de nouveaux tournois d'échecs",
  hello: "Bonjour,",
  introduction:
    "Voici les tournois d'échecs récemment annoncés dans les zones que vous avez sélectionnées :",
  blitz: "Tournois blitz",
  rapids: "Tournois rapides",
  classics: "Tournois cadences lentes",
  others: "Autres tournois",
  unsubscribe: `Visitez votre profil pour modifier ces zones, ou rendez-vous sur <a href="https://echecsfrance.com">Échecs France</a> pour voir plus de tournois.`,
};

const formatTournaments = (
  locale: string,
  title: string,
  tournaments: Tournament[],
) => {
  if (tournaments.length === 0) {
    return "";
  }

  const dateLocale = locale === "fr" ? fr : enGB;

  return `
    <h1>${title}</h1>
    <table role="presentation">
    <tbody>
        ${tournaments
          .map((tournament) => {
            return `
            <tr>
                <td>
                    <h3><a href="${tournament.url}" target="_blank">${tournament.tournament}&nbsp;&#8594;</a></h3>
                    <p>
                    <b>
                    ${format(tournament.start_date, "PP", { locale: dateLocale })}
                    ${!isSameDay(tournament.start_date, tournament.end_date) ? `- ${format(tournament.end_date, "PP", { locale: dateLocale })}` : ""}
                    </b>
                    <br />
                    ${tournament.town}, ${tournament.department}
                    </p>
                </td>
            </tr>
            `;
          })
          .join("")}
    </tbody>
    </table>
`;
};

// TODO add png logo file to email header, because web fonts are not rendered correctly by Gmail
const emailTemplate = (
  locale: "en" | "fr",
  blitz: Tournament[],
  rapids: Tournament[],
  classics: Tournament[],
  others: Tournament[],
) => {
  const t = locale === "en" ? enMessages : frMessages;

  return `
    <!doctype html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>${t.htmlTitle}</title>

        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap" rel="stylesheet">

        <style>
            /* -------------------------------------
            GLOBAL RESETS
        ------------------------------------- */

            /*All the styling goes here*/

            img {
                border: none;
                -ms-interpolation-mode: bicubic;
                max-width: 100%;
            }

            body {
                background-color: #eaebed;
                font-family: sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
            }

            table {
                border-collapse: separate;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                min-width: 100%;
                width: 100%;
                margin-bottom: 20px;
            }

            table td {
                font-family: sans-serif;
                font-size: 14px;
                vertical-align: top;
            }

            .zone-name {
                padding: 10px 0;
                margin-top: 10px;
            }

            /* -------------------------------------
                BODY & CONTAINER
            ------------------------------------- */

            .body {
                background-color: #eaebed;
                width: 100%;
            }

            /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
            .container {
                display: block;
                margin: 0 auto !important;
                /* makes it centered */
                max-width: 580px;
                padding: 10px;
                width: 580px;
            }

            /* This should also be a block element, so that it will fill 100% of the .container */
            .content {
                box-sizing: border-box;
                display: block;
                Margin: 0 auto;
                max-width: 580px;
                padding: 10px;
            }

            /* -------------------------------------
                HEADER, FOOTER, MAIN
            ------------------------------------- */
            .main {
                background: #ffffff;
                border-radius: 3px;
                width: 100%;
            }

            .header {
                padding: 20px 0;
            }

            .wrapper {
                box-sizing: border-box;
                padding: 20px;
            }

            .content-block {
                padding-bottom: 10px;
                padding-top: 10px;
            }

            .footer {
                clear: both;
                Margin-top: 10px;
                text-align: center;
                width: 100%;
            }

            .footer td,
            .footer p,
            .footer span,
            .footer a {
                color: #9a9ea6;
                font-size: 12px;
                text-align: center;
            }

            /* -------------------------------------
                TYPOGRAPHY
            ------------------------------------- */
            .julius-sans-one-regular {
                font-family: "Julius Sans One", sans-serif;
                font-weight: 400;
                font-style: normal;
            }

            h1,
            h2,
            h3,
            h4 {
                color: #06090f;
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.4;
                margin-top: 16px;
                margin-bottom: 8px;
            }

            h1 {
                margin-top: 24px;
                font-size: 25px;
                font-weight: 300;
                border-bottom: 1px solid #06090f;
            }

            p,
            ul,
            ol {
                font-family: sans-serif;
                font-size: 14px;
                font-weight: normal;
                margin: 0;
                margin-bottom: 15px;
            }

            p li,
            ul li,
            ol li {
                list-style-position: inside;
                margin-left: 5px;
            }

            a {
                color: #0086C7;
                text-decoration: none;
            }

            /* -------------------------------------
                OTHER STYLES THAT MIGHT BE USEFUL
            ------------------------------------- */
            .last {
                margin-bottom: 0;
            }

            .first {
                margin-top: 0;
            }

            .align-center {
                text-align: center;
            }

            .align-right {
                text-align: right;
            }

            .align-left {
                text-align: left;
            }

            .clear {
                clear: both;
            }

            .mt0 {
                margin-top: 0;
            }

            .mb0 {
                margin-bottom: 0;
            }

            .preheader {
                color: transparent;
                display: none;
                height: 0;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
                visibility: hidden;
                width: 0;
            }

            .powered-by a {
                text-decoration: none;
            }

            hr {
                border: 0;
                border-bottom: 1px solid #f6f6f6;
                Margin: 20px 0;
            }

            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
                table[class=body] h1 {
                    font-size: 28px !important;
                    margin-bottom: 10px !important;
                }

                table[class=body] p,
                table[class=body] ul,
                table[class=body] ol,
                table[class=body] td,
                table[class=body] span,
                table[class=body] a {
                    font-size: 16px !important;
                }

                table[class=body] .wrapper,
                table[class=body] .article {
                    padding: 10px !important;
                }

                table[class=body] .content {
                    padding: 0 !important;
                }

                table[class=body] .container {
                    padding: 0 !important;
                    width: 100% !important;
                }

                table[class=body] .main {
                    border-left-width: 0 !important;
                    border-radius: 0 !important;
                    border-right-width: 0 !important;
                }

                table[class=body] .btn table {
                    width: 100% !important;
                }

                table[class=body] .btn a {
                    width: 100% !important;
                }

                table[class=body] .img-responsive {
                    height: auto !important;
                    max-width: 100% !important;
                    width: auto !important;
                }
            }

            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
                .ExternalClass {
                    width: 100%;
                }

                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                    line-height: 100%;
                }

                .apple-link a {
                    color: inherit !important;
                    font-family: inherit !important;
                    font-size: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                    text-decoration: none !important;
                }
            }
        </style>
    </head>
    <body class="">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
            <td>&nbsp;</td>
            <td class="container">
                <div class="header">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td class="align-center">
                                <h1>
                                    <a class="julius-sans-one-regular" href="https://echecsfrance.com">Échecs France</a>
                                </h1>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="content">
                    <!-- START CENTERED WHITE CONTAINER -->
                    <span class="preheader">${t.preheader}}</span>
                    <table role="presentation" class="main">

                        <!-- START MAIN CONTENT AREA -->
                        <tr>
                            <td class="wrapper">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <p>${t.hello}</p>
                                            <p>${t.introduction}</p>

                                            ${formatTournaments(locale, t.blitz, blitz)}
                                            ${formatTournaments(locale, t.rapids, rapids)}
                                            ${formatTournaments(locale, t.classics, classics)}
                                            ${formatTournaments(locale, t.others, others)}

                                            <p>${t.unsubscribe}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- END MAIN CONTENT AREA -->
                    </table>

                    <!-- START FOOTER -->
                    <div class="footer">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                                <td class="content-block powered-by">
                                    Powered by <a href="https://sendgrid.com">SendGrid</a>.
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!-- END FOOTER -->

                    <!-- END CENTERED WHITE CONTAINER -->
                </div>
            </td>
            <td>&nbsp;</td>
        </tr>
    </table>
    </body>
    </html>
`;
};

export default emailTemplate;
