import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alfisyahri Amrun A. (Asa)',
    short_name: 'asa',
    description: 'Personal portfolio and website of Alfisyahri Amrun A.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FEFEFF',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/pfp-paper.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}
