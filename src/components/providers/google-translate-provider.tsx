"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSettingsStore } from "@/lib/store/settings";
import { getLanguageByCode } from "@/lib/constants/languages";
import { useSettingsInitialization } from "@/hooks/use-settings-initialization";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: {
          pageLanguage: string;
          includedLanguages: string;
          layout: number;
          autoDisplay: boolean;
          multilanguagePage: boolean;
        }, elementId: string) => void;
      };
    };
  }
}

interface GoogleTranslateContextType {
  isLoaded: boolean;
  currentLanguage: string;
  changeLanguage: (languageCode: string) => void;
}

const GoogleTranslateContext = createContext<GoogleTranslateContextType | null>(null);

export function useGoogleTranslate() {
  const context = useContext(GoogleTranslateContext);
  if (!context) {
    throw new Error("useGoogleTranslate must be used within GoogleTranslateProvider");
  }
  return context;
}

interface GoogleTranslateProviderProps {
  children: React.ReactNode;
}

export function GoogleTranslateProvider({ children }: GoogleTranslateProviderProps) {
  const { currentLanguage } = useSettingsStore();
  const [isLoaded, setIsLoaded] = React.useState(false);
  useSettingsInitialization(); // Initialize settings

  // Initialize Google Translate
  useEffect(() => {
    // Create the script element
    const script = document.createElement("script");
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    // Define the callback function
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en", // Default page language
            includedLanguages: "en,es,fr,de,it,pt,ru,ja,ko,zh,ar,hi,af,sq,am,hy,az,eu,be,bn,bs,bg,ca,ny,co,hr,cs,da,nl,eo,et,tl,fi,fy,gl,ka,el,gu,ht,ha,haw,iw,hmn,hu,is,ig,id,ga,jw,kn,kk,km,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,ps,fa,pl,pa,ro,sm,gd,sr,st,sn,sd,si,sk,sl,so,su,sw,sv,tg,ta,te,th,tr,uk,ur,uz,vi,cy,xh,yi,yo,zu",
            layout: 0, // SIMPLE layout
            autoDisplay: false,
            multilanguagePage: true,
          },
          "google_translate_element"
        );
        setIsLoaded(true);
      }
    };

    // Add the script to head
    document.head.appendChild(script);

    // Create the translate element container if it doesn't exist
    if (!document.getElementById("google_translate_element")) {
      const container = document.createElement("div");
      container.id = "google_translate_element";
      container.style.display = "none"; // Hide the default widget
      document.body.appendChild(container);
    }

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      const container = document.getElementById("google_translate_element");
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  // Change language when current language changes
  useEffect(() => {
    if (isLoaded && currentLanguage.code !== "en") {
      const language = getLanguageByCode(currentLanguage.code);
      if (language) {
        changeLanguage(language.googleCode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, currentLanguage.code]);

  const changeLanguage = (languageCode: string) => {
    if (!isLoaded) return;

    // Find Google Translate select element and change its value
    const iframe = document.querySelector("iframe.goog-te-menu-frame") as HTMLIFrameElement;
    if (iframe && iframe.contentDocument) {
      const select = iframe.contentDocument.querySelector("select.goog-te-combo");
      if (select) {
        (select as HTMLSelectElement).value = languageCode;
        select.dispatchEvent(new Event("change"));
      }
    } else {
      // Alternative method using the select in the main document
      const select = document.querySelector("select.goog-te-combo") as HTMLSelectElement;
      if (select) {
        select.value = languageCode;
        select.dispatchEvent(new Event("change"));
      }
    }
  };

  const value: GoogleTranslateContextType = {
    isLoaded,
    currentLanguage: currentLanguage.code,
    changeLanguage,
  };

  return (
    <GoogleTranslateContext.Provider value={value}>
      {children}
      <style jsx global>{`
        /* Hide Google Translate banner and elements */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        .goog-te-menu-value {
          padding: 3px 3px;
        }
        
        .goog-te-gadget {
          display: none !important;
        }
        
        .goog-te-combo {
          display: none !important;
        }
        
        #google_translate_element {
          display: none !important;
        }
        
        /* Fix body position when Google Translate is active */
        body {
          top: 0 !important;
          position: static !important;
        }
        
        /* Hide the top banner frame */
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        body.goog-te-hl-active {
          top: 0 !important;
          position: static !important;
        }
      `}</style>
    </GoogleTranslateContext.Provider>
  );
}