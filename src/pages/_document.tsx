import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='zh' suppressHydrationWarning>
      <Head>
        <title>OLY ONE</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <body className='flex flex-col text-foreground/70'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
