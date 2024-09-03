"use client";
import Script from "next/script";
const BaiDuAnalytics = () => {
  return (
    <>
      <Script
        id="baidu-tongji"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?2448c9e5b54f4436ce635ee9ab8ed147";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
          `,
        }}
      />
    </>
  );
};
export default BaiDuAnalytics;

