import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='zh' suppressHydrationWarning>
      <Head>{/* 可以在这里添加全局的 meta 标签、字体等 */}</Head>
      <body className='flex flex-col text-foreground/70'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
