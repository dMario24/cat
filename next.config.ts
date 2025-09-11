import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "50mb", // 업로드 허용 크기 (문자열)
  },
};

export default nextConfig;
