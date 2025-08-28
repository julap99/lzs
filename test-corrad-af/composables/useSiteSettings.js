export const useSiteSettings = () => {
  // Global site settings state
  const siteSettings = useState('siteSettings', () => ({
    siteName: 'corradAF',
    siteDescription: 'corradAF Base Project',
    siteLogo: '',
    siteLoginLogo: '',
    siteLoadingLogo: '',
    siteFavicon: '',
    showSiteNameInHeader: true,
    siteNameFontSize: 18,
    customCSS: '',
    selectedTheme: 'biasa', // Use existing theme system
    customThemeFile: '',
    currentFont: '',
    fontSource: '',
    // SEO fields
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    seoAuthor: '',
    seoOgImage: '',
    seoTwitterCard: 'summary_large_image',
    seoCanonicalUrl: '',
    seoRobots: 'index, follow',
    seoGoogleAnalytics: '',
    seoGoogleTagManager: '',
    seoFacebookPixel: ''
  }));

  // Loading state
  const loading = useState('siteSettingsLoading', () => false);

  // Load site settings from API
  const loadSiteSettings = async () => {
    loading.value = true;
    try {
      const response = await $fetch("/api/devtool/config/site-settings", {
        method: "GET",
      });
      
      if (response && response.data) {
        siteSettings.value = { ...siteSettings.value, ...response.data };
        applyThemeSettings();
        updateGlobalMeta();
      }
    } catch (error) {
      console.error("Error loading site settings:", error);
    } finally {
      loading.value = false;
    }
  };

  // Update global meta tags and SEO
  const updateGlobalMeta = () => {
    if (process.client) {
      // Update page title - use SEO title if available
      const title = siteSettings.value.seoTitle || siteSettings.value.siteName;
      if (title) {
        document.title = title;
        
        // Update meta description - use SEO description if available
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.name = 'description';
          document.head.appendChild(metaDescription);
        }
        metaDescription.content = siteSettings.value.seoDescription || siteSettings.value.siteDescription || title;
        
        // Update keywords meta tag
        if (siteSettings.value.seoKeywords) {
          let keywordsMeta = document.querySelector('meta[name="keywords"]');
          if (!keywordsMeta) {
            keywordsMeta = document.createElement('meta');
            keywordsMeta.name = 'keywords';
            document.head.appendChild(keywordsMeta);
          }
          keywordsMeta.content = siteSettings.value.seoKeywords;
        }
        
        // Update author meta tag
        if (siteSettings.value.seoAuthor) {
          let authorMeta = document.querySelector('meta[name="author"]');
          if (!authorMeta) {
            authorMeta = document.createElement('meta');
            authorMeta.name = 'author';
            document.head.appendChild(authorMeta);
          }
          authorMeta.content = siteSettings.value.seoAuthor;
        }
        
        // Update robots meta tag
        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (!robotsMeta) {
          robotsMeta = document.createElement('meta');
          robotsMeta.name = 'robots';
          document.head.appendChild(robotsMeta);
        }
        robotsMeta.content = siteSettings.value.seoRobots;
        
        // Update Open Graph tags
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.content = title;
        
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
          ogDescription = document.createElement('meta');
          ogDescription.setAttribute('property', 'og:description');
          document.head.appendChild(ogDescription);
        }
        ogDescription.content = siteSettings.value.seoDescription || siteSettings.value.siteDescription || title;
        
        // Update OG image
        if (siteSettings.value.seoOgImage) {
          let ogImage = document.querySelector('meta[property="og:image"]');
          if (!ogImage) {
            ogImage = document.createElement('meta');
            ogImage.setAttribute('property', 'og:image');
            document.head.appendChild(ogImage);
          }
          ogImage.content = siteSettings.value.seoOgImage;
        }
        
        // Update Twitter Card tags
        let twitterCard = document.querySelector('meta[name="twitter:card"]');
        if (!twitterCard) {
          twitterCard = document.createElement('meta');
          twitterCard.name = 'twitter:card';
          document.head.appendChild(twitterCard);
        }
        twitterCard.content = siteSettings.value.seoTwitterCard;
        
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (!twitterTitle) {
          twitterTitle = document.createElement('meta');
          twitterTitle.name = 'twitter:title';
          document.head.appendChild(twitterTitle);
        }
        twitterTitle.content = title;
        
        let twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (!twitterDescription) {
          twitterDescription = document.createElement('meta');
          twitterDescription.name = 'twitter:description';
          document.head.appendChild(twitterDescription);
        }
        twitterDescription.content = siteSettings.value.seoDescription || siteSettings.value.siteDescription || title;
        
        // Update canonical URL
        if (siteSettings.value.seoCanonicalUrl) {
          let canonicalLink = document.querySelector('link[rel="canonical"]');
          if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
          }
          canonicalLink.href = siteSettings.value.seoCanonicalUrl;
        }
      }
      
      // Update favicon
      if (siteSettings.value.siteFavicon) {
        let faviconLink = document.querySelector("link[rel*='icon']");
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.rel = 'icon';
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = siteSettings.value.siteFavicon;
        
        // Update apple touch icon
        let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']");
        if (!appleTouchIcon) {
          appleTouchIcon = document.createElement('link');
          appleTouchIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleTouchIcon);
        }
        appleTouchIcon.href = siteSettings.value.siteFavicon;
      }
      
      // Apply analytics scripts
      if (siteSettings.value.seoGoogleAnalytics) {
        // Add Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${siteSettings.value.seoGoogleAnalytics}`;
        document.head.appendChild(script);
        
        const gtag = document.createElement('script');
        gtag.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${siteSettings.value.seoGoogleAnalytics}');
        `;
        document.head.appendChild(gtag);
      }
      
      if (siteSettings.value.seoGoogleTagManager) {
        // Add Google Tag Manager
        const gtmScript = document.createElement('script');
        gtmScript.textContent = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${siteSettings.value.seoGoogleTagManager}');
        `;
        document.head.appendChild(gtmScript);
      }
      
      if (siteSettings.value.seoFacebookPixel) {
        // Add Facebook Pixel
        const fbScript = document.createElement('script');
        fbScript.textContent = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${siteSettings.value.seoFacebookPixel}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
      }
    }
  };

  // Apply theme settings to the document
  const applyThemeSettings = () => {
    if (process.client) {
      // Apply selected theme using existing theme system
      if (siteSettings.value.selectedTheme) {
        document.documentElement.setAttribute("data-theme", siteSettings.value.selectedTheme);
        localStorage.setItem("theme", siteSettings.value.selectedTheme);
      }
      
      // Apply custom theme file if exists (append to theme.css)
      if (siteSettings.value.customThemeFile) {
        let customThemeElement = document.getElementById('custom-theme-file');
        if (!customThemeElement) {
          customThemeElement = document.createElement('link');
          customThemeElement.id = 'custom-theme-file';
          customThemeElement.rel = 'stylesheet';
          customThemeElement.type = 'text/css';
          document.head.appendChild(customThemeElement);
        }
        customThemeElement.href = siteSettings.value.customThemeFile;
      } else {
        // Remove custom theme file if it exists
        const existingThemeElement = document.getElementById('custom-theme-file');
        if (existingThemeElement) {
          existingThemeElement.remove();
        }
      }
      
      // Apply custom CSS
      let customStyleElement = document.getElementById('custom-site-styles');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'custom-site-styles';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = siteSettings.value.customCSS || '';
    }
  };

  // Set theme (integrate with existing theme system)
  const setTheme = (theme) => {
    siteSettings.value.selectedTheme = theme;
    applyThemeSettings();
    // Optionally save to server
    updateSiteSettings(siteSettings.value);
  };

  // Get current theme
  const getCurrentTheme = () => {
    return siteSettings.value.selectedTheme || 'biasa';
  };

  // Update site settings
  const updateSiteSettings = async (newSettings) => {
    console.log("[useSiteSettings] updateSiteSettings called with:", JSON.parse(JSON.stringify(newSettings)));
    try {
      const response = await $fetch("/api/devtool/config/site-settings", {
        method: "POST",
        body: newSettings,
      });
      console.log("[useSiteSettings] API response received:", JSON.parse(JSON.stringify(response)));
      
      if (response && response.data) {
        siteSettings.value = { ...siteSettings.value, ...response.data }; 
        applyThemeSettings();
        updateGlobalMeta();
        console.log("[useSiteSettings] Returning success from updateSiteSettings.");
        return { success: true, data: response.data };
      }
      
      let errorMessage = "Update operation failed: No data returned from server.";
      if (response && typeof response === 'object' && response !== null && 'message' in response) {
        errorMessage = response.message;
      } else if (response) {
        errorMessage = "Update operation failed: Unexpected server response format on success.";
      } else if (response === undefined) {
        errorMessage = "Update failed: Server returned no content (e.g. 204). Treating as failure as data is expected for settings.";
        console.log("[useSiteSettings] Returning failure (204 or undefined response) from updateSiteSettings.");
        return { success: false, error: { message: errorMessage, details: response } };
      }
      
      console.log("[useSiteSettings] Returning failure (general case) from updateSiteSettings:", errorMessage);
      return { success: false, error: { message: errorMessage, details: response } };
    } catch (error) {
      console.error("[useSiteSettings] Error in updateSiteSettings catch block:", error);
      let detailedMessage = "An unexpected error occurred during update.";
      if (error.data && error.data.message) {
        detailedMessage = error.data.message;
      } else if (error.message) {
        detailedMessage = error.message;
      }
      console.log("[useSiteSettings] Returning failure (catch block) from updateSiteSettings:", detailedMessage);
      return { success: false, error: { message: detailedMessage, details: error } };
    }
  };

  // Add custom theme to theme.css file
  const addCustomThemeToFile = async (themeName, themeCSS) => {
    try {
      const response = await $fetch("/api/devtool/config/add-custom-theme", {
        method: "POST",
        body: {
          themeName,
          themeCSS
        }
      });
      
      return response;
    } catch (error) {
      console.error("Error adding custom theme:", error);
      return { success: false, error };
    }
  };

  return {
    siteSettings,
    loading: readonly(loading),
    loadSiteSettings,
    updateSiteSettings,
    applyThemeSettings,
    updateGlobalMeta,
    getCurrentTheme,
    setTheme,
    addCustomThemeToFile
  };
}; 