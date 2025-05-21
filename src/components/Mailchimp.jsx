// components/MailchimpSubscribe.jsx
"use client";

import React, { useEffect } from "react";

const MailchimpSubscribe = () => {
  useEffect(() => {
    // Load Mailchimp validation script after component mounts
    const script = document.createElement("script");
    script.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="mc_embed_shell">
      <link
        href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
        rel="stylesheet"
        type="text/css"
      />
      <style type="text/css">
        {`
          #mc_embed_signup {
            background: transparent;
            clear: left;
            font: 14px Helvetica, Arial, sans-serif;
            width: 100%;
          }
          #mc_embed_signup .mc-field-group input {
            width: 100%;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid var(--orange);
            color: white;
            background: transparent;
          }
          #mc_embed_signup .button {
            background-color: var(--orange);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            cursor: pointer;
            margin-top: 1rem;
          }
          #mc_embed_signup .indicates-required,
          #mc_embed_signup label {
            color: white;
          }
        `}
      </style>
      <div id="mc_embed_signup">
        <form
          action="https://gmail.us19.list-manage.com/subscribe/post?u=27300469191697773aa82d7da&amp;id=ab5ce7e326&amp;f_id=00c480e3f0"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
          noValidate // Added noValidate attribute
        >
          <div id="mc_embed_signup_scroll">
            <h2 className="text-white">Subscribe</h2>
            <div className="indicates-required">
              <span className="asterisk">*</span> indicates required
            </div>
            <div className="mc-field-group">
              <label htmlFor="mce-EMAIL">
                Email Address <span className="asterisk">*</span>
              </label>
              <input
                type="email"
                name="EMAIL"
                className="required email"
                id="mce-EMAIL"
                required
                defaultValue=""
                aria-required="true" // Added aria-required
              />
            </div>
            <div id="mce-responses" className="clear foot">
              <div
                className="response"
                id="mce-error-response"
                style={{ display: "none" }}
              ></div>
              <div
                className="response"
                id="mce-success-response"
                style={{ display: "none" }}
              ></div>
            </div>
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-5000px" }}
            >
              {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
              <input
                type="text"
                name="b_27300469191697773aa82d7da_ab5ce7e326"
                tabIndex="-1"
                defaultValue=""
              />
            </div>
            <div className="optionalParent">
              <div className="clear foot">
                <input
                  type="submit"
                  name="subscribe"
                  id="mc-embedded-subscribe"
                  className="button !py-0"
                  value="Subscribe"
                />
                <p style={{ margin: "0px auto" }}>
                  <a
                    href="http://eepurl.com/jebjgo"
                    title="Mailchimp - email marketing made easy and fun"
                  >
                    <span
                      style={{
                        display: "inline-block",
                        backgroundColor: "transparent",
                        borderRadius: "4px",
                      }}
                    >
                      <img
                        className="refferal_badge"
                        src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
                        alt="Intuit Mailchimp"
                        style={{
                          width: "220px",
                          height: "40px",
                          display: "flex",
                          padding: "2px 0px",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </span>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MailchimpSubscribe;
