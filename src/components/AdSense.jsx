import React, { useEffect } from 'react';

const AdSense = ({ 
  client = "ca-pub-your-adsense-id", 
  slot, 
  style = { display: 'block' },
  format = "auto",
  responsive = "true",
  className = ""
}) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins 
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

// Different ad components for different placements
export const HeaderAd = () => (
  <AdSense 
    slot="1234567890"
    style={{ display: 'block', width: '100%', height: '90px' }}
    format="horizontal"
    className="mb-4"
  />
);

export const SidebarAd = () => (
  <AdSense 
    slot="0987654321"
    style={{ display: 'block', width: '300px', height: '250px' }}
    format="rectangle"
    className="sticky top-4"
  />
);

export const InArticleAd = () => (
  <AdSense 
    slot="1122334455"
    style={{ display: 'block', textAlign: 'center' }}
    format="fluid"
    className="my-8 p-4 bg-gray-50 rounded-lg"
  />
);

export const FooterAd = () => (
  <AdSense 
    slot="5544332211"
    style={{ display: 'block', width: '100%', height: '90px' }}
    format="horizontal"
    className="mt-4"
  />
);

export default AdSense;