"use client";
import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useRef } from "react";

const Chat = () => {
  const { user } = useAuthStore();

  const scriptAddedRef = useRef(false); // Track if script is added

  useEffect(() => {
    // console.log("[DEBUG] Chat component mounted");
    // console.log("[DEBUG] User details:", {
    //   email: user?.email,
    //   typeEmail: typeof user?.email,
    // });

    // // Function to set Tawk attributes
    // const setTawkAttributes = () => {
    //   console.log("[DEBUG] Attempting to set Tawk attributes");
    //   const attributes = {
    //     name: "guest",
    //     email:
    //       user?.email && typeof user.email === "string"
    //         ? user.email
    //         : "guest@gmail.com",
    //   };
    //   console.log("[DEBUG] Attributes to set:", attributes);
    //
    //   if (!attributes.email) {
    //     console.warn("[WARNING] Email is invalid or empty, skipping setAttributes");
    //     return;
    //   }
    //
    //   try {
    //     window.Tawk_API.setAttributes(attributes, (error) => {
    //       if (error) {
    //         console.error("[ERROR] Failed to set Tawk attributes:", error);
    //       } else {
    //         console.log("[SUCCESS] Tawk attributes set successfully");
    //         // Ensure widget is visible
    //         if (window.Tawk_API.showWidget) {
    //           window.Tawk_API.showWidget();
    //           console.log("[DEBUG] Tawk widget shown");
    //         }
    //       }
    //     });
    //   } catch (error) {
    //     console.error("[ERROR] Exception in setAttributes:", error.message);
    //   }
    //
    //   // Debug widget rendering
    //   setTimeout(() => {
    //     const widget = document.querySelector(".tawk-min-container, #tawk-widget");
    //     console.log("[DEBUG] Tawk widget in DOM:", !!widget, widget);
    //   }, 1000);
    // };

    // Prevent re-adding script if already present
    if (document.getElementById("tawk-script") || scriptAddedRef.current) {
      //   console.log("[DEBUG] Tawk script already exists or added");
      // if (window.Tawk_API && window.Tawk_API.setAttributes) {
      //   console.log("[DEBUG] Tawk_API available, setting attributes");
      //   setTawkAttributes();
      // } else {
      //   console.warn("[WARNING] Tawk_API not available");
      // }
      if (window.Tawk_API && window.Tawk_API.showWidget) {
        // console.log("[DEBUG] Tawk_API available, showing widget");
        window.Tawk_API.showWidget();
      } else {
        console.warn("[WARNING] Tawk_API or showWidget not available");
      }
      return;
    }

    // Initialize Tawk_API and Tawk_LoadStart
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create script element
    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = "https://embed.tawk.to/680f2372be6663190a6c0709/1ipti4uiu";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Append script to body
    document.body.appendChild(script);

    scriptAddedRef.current = true; // Mark script as added

    // Handle script load
    script.onload = () => {
      //   console.log("[DEBUG] Tawk script loaded");

      if (window.Tawk_API) {
        // console.log("[DEBUG] Tawk_API available immediately");
        if (window.Tawk_API.showWidget) {
          window.Tawk_API.showWidget();
        }
        // setTawkAttributes();
        return;
      }

      console.warn("[WARNING] Tawk_API not available after script load");
      window.Tawk_API.onLoad = () => {
        // console.log("[DEBUG] Tawk_API onLoad event triggered");
        if (window.Tawk_API.showWidget) {
          window.Tawk_API.showWidget();
          console.log("[DEBUG] Tawk widget shown");
        }
        // setTawkAttributes();
      };

      // Poll for Tawk_API
      let pollAttempts = 0;
      const maxAttempts = 10;
      const pollInterval = setInterval(() => {
        pollAttempts++;
        // console.log(
        //   `[DEBUG] Polling for Tawk_API, attempt ${pollAttempts}/${maxAttempts}`
        // );
        if (window.Tawk_API) {
          //   console.log("[DEBUG] Tawk_API became available after polling");
          clearInterval(pollInterval);
          if (window.Tawk_API.showWidget) {
            window.Tawk_API.showWidget();
            // console.log("[DEBUG] Tawk widget shown");
          }
          // setTawkAttributes();
        } else if (pollAttempts >= maxAttempts) {
          //   console.error("[ERROR] Tawk_API polling timed out after 5 seconds");
          clearInterval(pollInterval);
        }
      }, 500);

      // Debug widget rendering
      setTimeout(() => {
        const widget = document.querySelector(
          ".tawk-min-container, #tawk-widget"
        );
        // console.log("[DEBUG] Tawk widget in DOM:", !!widget, widget);
      }, 1000);
    };

    script.onerror = (error) => {
      //   console.error("[ERROR] Failed to load Tawk script:", error);
      scriptAddedRef.current = false; // Allow retry on error
    };

    // Cleanup (avoid removing script)
    return () => {
      console.log("[DEBUG] Chat component unmounting");
      // Do not remove script to prevent widget disappearance
      // if (document.getElementById("tawk-script")) {
      //   console.log("[DEBUG] Removing Tawk script");
      //   document.getElementById("tawk-script").remove();
      // }
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        // console.log("[DEBUG] Hiding Tawk widget");
        window.Tawk_API.hideWidget();
      }
    };
  }, [user]); // Empty dependency array to run once

  // // Separate effect for user updates
  // useEffect(() => {
  //   if (user?.email && window.Tawk_API && window.Tawk_API.setAttributes) {
  //     console.log("[DEBUG] User email updated, setting attributes");
  //     const attributes = {
  //       name: "guest",
  //       email: user.email,
  //     };
  //     try {
  //       window.Tawk_API.setAttributes(attributes, (error) => {
  //         if (error) {
  //           console.error("[ERROR] Failed to set Tawk attributes (user update):", error);
  //         } else {
  //           console.log("[SUCCESS] Tawk attributes set successfully (user update)");
  //           if (window.Tawk_API.showWidget) {
  //             window.Tawk_API.showWidget();
  //             console.log("[DEBUG] Tawk widget shown (user update)");
  //           }
  //         }
  //       });
  //     } catch (error) {
  //       console.error("[ERROR] Exception in setAttributes (user update):", error.message);
  //     }
  //   }
  // }, [user?.email]);

  return <></>;
};

export default Chat;
